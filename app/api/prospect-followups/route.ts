import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type TaxLead = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  household_income?: string | null;
  investable_assets?: string | null;
  biggest_tax_concern?: string | null;
  lead_score?: number | null;
  lead_grade?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type EmailEvent = {
  lead_id: string;
  email_type: string;
};

type FollowUpStep = {
  emailType: "day_1_review_process" | "day_3_common_gaps" | "day_7_final_prompt";
  minimumAgeHours: number;
  subject: string;
  preview: string;
};

const calendlyLink = "https://calendly.com/wade-unitytaxplanning/30min";
const fromEmail =
  process.env.UNITY_TAX_FROM_EMAIL ||
  "Unity Tax Planning <info@unitytaxplanning.com>";
const replyToEmail =
  process.env.UNITY_TAX_REPLY_TO_EMAIL || "wade@unitytaxplanning.com";
const internalAlertEmail =
  process.env.UNITY_TAX_INTERNAL_EMAIL || "wade@unitytaxplanning.com";

const activeStatuses = new Set(["", "new", "reviewing", "contacted"]);
const suppressedStatuses = new Set([
  "scheduled",
  "discovery",
  "proposal",
  "client",
  "closed",
  "archived",
]);

const followUpSteps: FollowUpStep[] = [
  {
    emailType: "day_1_review_process",
    minimumAgeHours: 24,
    subject: "What we review during a tax planning assessment",
    preview: "A quick look at what happens after your Tax Opportunity Scan.",
  },
  {
    emailType: "day_3_common_gaps",
    minimumAgeHours: 72,
    subject: "Common tax planning gaps we look for",
    preview: "A few areas we commonly review before a planning engagement begins.",
  },
  {
    emailType: "day_7_final_prompt",
    minimumAgeHours: 168,
    subject: "Still want us to review your tax planning picture?",
    preview: "One final reminder to schedule your Tax Opportunity Review.",
  },
];

function clean(value: unknown) {
  return String(value || "").trim();
}

function escapeHtml(value: unknown) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLeadName(lead: TaxLead) {
  const fullName = `${clean(lead.first_name)} ${clean(lead.last_name)}`.trim();
  return fullName || "there";
}

function getLeadAgeHours(lead: TaxLead) {
  if (!lead.created_at) return 0;

  const createdAt = new Date(lead.created_at).getTime();
  if (Number.isNaN(createdAt)) return 0;

  return (Date.now() - createdAt) / (1000 * 60 * 60);
}

function getNextDueStep(lead: TaxLead, sentEvents: EmailEvent[]) {
  const ageHours = getLeadAgeHours(lead);
  const sentTypes = new Set(sentEvents.map((event) => event.email_type));

  return followUpSteps.find((step) => {
    return ageHours >= step.minimumAgeHours && !sentTypes.has(step.emailType);
  });
}

function shouldSuppressLead(lead: TaxLead) {
  const status = clean(lead.status).toLowerCase();

  if (suppressedStatuses.has(status)) return true;
  if (!activeStatuses.has(status)) return true;
  if (!clean(lead.email)) return true;

  return false;
}

function buildTextEmail(lead: TaxLead, step: FollowUpStep) {
  const firstName = clean(lead.first_name) || "there";

  if (step.emailType === "day_1_review_process") {
    return [
      `Hi ${firstName},`,
      "",
      "I wanted to share what we typically review after someone completes the Unity Tax Opportunity Scan.",
      "",
      "The review usually focuses on income, assets, timing, planning concerns, current professionals involved, and whether there are any upcoming decisions that could create tax consequences.",
      "",
      "If you would like to walk through your assessment, you can schedule a review here:",
      calendlyLink,
      "",
      "This review is educational and does not create a client relationship. No tax, legal, or investment advice is provided until your situation is reviewed in more detail and an engagement is accepted.",
      "",
      "— Wade Marcy",
      "Unity Tax Planning",
    ].join("\n");
  }

  if (step.emailType === "day_3_common_gaps") {
    return [
      `Hi ${firstName},`,
      "",
      "A few common tax planning gaps we look for include Roth conversion timing, capital gains exposure, business-owner planning, charitable giving strategy, estate coordination, and whether tax planning is being coordinated with investment decisions.",
      "",
      "Your assessment helps us decide whether any of those areas may deserve a deeper review.",
      "",
      "You can schedule your Tax Opportunity Review here:",
      calendlyLink,
      "",
      "— Wade Marcy",
      "Unity Tax Planning",
    ].join("\n");
  }

  return [
    `Hi ${firstName},`,
    "",
    "I wanted to send one final follow-up on your Unity Tax Opportunity Scan.",
    "",
    "If you still want us to review your tax planning picture, you can schedule a time here:",
    calendlyLink,
    "",
    "If now is not the right time, no action is needed.",
    "",
    "— Wade Marcy",
    "Unity Tax Planning",
  ].join("\n");
}

function buildHtmlEmail(lead: TaxLead, step: FollowUpStep) {
  const firstName = escapeHtml(clean(lead.first_name) || "there");
  let mainCopy = "";
  let bulletItems: string[] = [];

  if (step.emailType === "day_1_review_process") {
    mainCopy =
      "After someone completes the Unity Tax Opportunity Scan, we typically review whether their income, assets, timing, and planning concerns suggest that a deeper tax planning conversation may be useful.";
    bulletItems = [
      "Income and investable asset ranges",
      "Retirement, business, capital gains, or estate planning concerns",
      "Current CPA or advisor involvement",
      "Upcoming decisions that may create tax consequences",
    ];
  } else if (step.emailType === "day_3_common_gaps") {
    mainCopy =
      "Many planning opportunities are missed because tax, investment, retirement, charitable, and estate decisions are reviewed separately instead of together.";
    bulletItems = [
      "Roth conversion timing",
      "Capital gains planning",
      "Business-owner tax strategy",
      "Charitable giving structure",
      "Investment tax efficiency",
    ];
  } else {
    mainCopy =
      "I wanted to send one final follow-up on your Unity Tax Opportunity Scan. If you still want us to review your tax planning picture, you can schedule a time below. If now is not the right time, no action is needed.";
    bulletItems = [
      "Schedule a review if you want to continue",
      "Ignore this email if timing is not right",
      "No client relationship is created unless an engagement is accepted",
    ];
  }

  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;padding:32px;box-shadow:0 20px 40px rgba(15,23,42,0.08);">
          <p style="margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#2563eb;">Unity Tax Planning</p>
          <h1 style="margin:0 0 18px;font-size:28px;line-height:1.15;color:#0f172a;">${escapeHtml(step.subject)}</h1>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#334155;">Hi ${firstName},</p>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#334155;">${escapeHtml(mainCopy)}</p>
          <div style="border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;padding:18px;margin:0 0 24px;">
            ${bulletItems
              .map(
                (item) =>
                  `<p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#334155;"><strong style="color:#2563eb;">✓</strong> ${escapeHtml(item)}</p>`,
              )
              .join("")}
          </div>
          <p style="margin:0 0 28px;">
            <a href="${escapeHtml(calendlyLink)}" style="display:inline-block;border-radius:16px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;padding:14px 22px;">Schedule Your Review</a>
          </p>
          <div style="border-radius:18px;background:#eff6ff;border:1px solid #bfdbfe;padding:18px;margin:0 0 24px;">
            <p style="margin:0;font-size:14px;line-height:1.7;color:#1e3a8a;">This review is educational and does not create a client relationship. No tax, legal, or investment advice is provided until your situation is reviewed in more detail and an engagement is accepted.</p>
          </div>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;">— Wade Marcy<br />Unity Tax Planning</p>
        </div>
      </div>
    </div>
  `;
}

async function sendResendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: replyToEmail,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `Resend follow-up failed: ${JSON.stringify(result) || response.statusText}`,
    );
  }

  return result as { id?: string } | null;
}

function createSupabaseAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;

  const authorization = request.headers.get("authorization") || "";
  return authorization === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const lookbackDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const { data: leads, error: leadsError } = await supabase
      .from("tax_leads")
      .select("id, first_name, last_name, email, phone, household_income, investable_assets, biggest_tax_concern, lead_score, lead_grade, status, created_at")
      .gte("created_at", lookbackDate)
      .order("created_at", { ascending: true })
      .limit(250);

    if (leadsError) throw leadsError;

    const activeLeads = ((leads ?? []) as TaxLead[]).filter(
      (lead) => !shouldSuppressLead(lead),
    );

    const leadIds = activeLeads.map((lead) => lead.id);
    let emailEvents: EmailEvent[] = [];

    if (leadIds.length > 0) {
      const { data: events, error: eventsError } = await supabase
        .from("prospect_email_events")
        .select("lead_id, email_type")
        .in("lead_id", leadIds);

      if (eventsError) throw eventsError;
      emailEvents = (events ?? []) as EmailEvent[];
    }

    const sent: Array<{ leadId: string; email: string; emailType: string }> = [];
    const skipped: Array<{ leadId: string; reason: string }> = [];
    const failed: Array<{ leadId: string; emailType: string; error: string }> = [];

    for (const lead of activeLeads) {
      const leadEvents = emailEvents.filter((event) => event.lead_id === lead.id);
      const dueStep = getNextDueStep(lead, leadEvents);

      if (!dueStep) {
        skipped.push({ leadId: lead.id, reason: "No follow-up due yet" });
        continue;
      }

      const recipientEmail = clean(lead.email);

      try {
        const resendResult = await sendResendEmail({
          to: recipientEmail,
          subject: dueStep.subject,
          html: buildHtmlEmail(lead, dueStep),
          text: buildTextEmail(lead, dueStep),
        });

        const { error: insertError } = await supabase
          .from("prospect_email_events")
          .insert({
            lead_id: lead.id,
            email_type: dueStep.emailType,
            recipient_email: recipientEmail,
            status: "sent",
            provider: "resend",
            provider_message_id: resendResult?.id || null,
          });

        if (insertError) throw insertError;

        sent.push({
          leadId: lead.id,
          email: recipientEmail,
          emailType: dueStep.emailType,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";

        await supabase.from("prospect_email_events").insert({
          lead_id: lead.id,
          email_type: dueStep.emailType,
          recipient_email: recipientEmail,
          status: "failed",
          provider: "resend",
          error_message: message,
        });

        failed.push({ leadId: lead.id, emailType: dueStep.emailType, error: message });
      }
    }

    if (failed.length > 0) {
      await sendResendEmail({
        to: internalAlertEmail,
        subject: "Unity Tax follow-up email issue",
        html: `<pre>${escapeHtml(JSON.stringify(failed, null, 2))}</pre>`,
        text: JSON.stringify(failed, null, 2),
      }).catch(() => null);
    }

    return NextResponse.json({
      ok: true,
      checked: activeLeads.length,
      sent,
      skippedCount: skipped.length,
      failed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Prospect follow-up route failed.";
    console.error("Prospect follow-up route failed.", error);

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
