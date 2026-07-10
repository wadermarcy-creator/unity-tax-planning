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
  "Wade Marcy <info@unitytaxplanning.com>";
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
    subject: "Your tax planning assessment",
    preview: "A quick look at what happens after your Tax Opportunity Scan.",
  },
  {
    emailType: "day_3_common_gaps",
    minimumAgeHours: 72,
    subject: "A few tax planning items to review",
    preview: "A few areas we commonly review before a planning engagement begins.",
  },
  {
    emailType: "day_7_final_prompt",
    minimumAgeHours: 168,
    subject: "Checking in",
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
      "I wanted to make sure you had the scheduling link in case you would like to talk through your Tax Opportunity Scan.",
      "",
      "Here is the link:",
      calendlyLink,
      "",
      "On the call, we will usually look at income, investments, retirement accounts, business ownership, capital gains, and any major planning decisions coming up.",
      "",
      "No pressure at all — I just wanted to make sure you had the next step.",
      "",
      "Thanks,",
      "",
      "Wade Marcy",
      "Unity Tax Planning",
    ].join("\n");
  }

  if (step.emailType === "day_3_common_gaps") {
    return [
      `Hi ${firstName},`,
      "",
      "A few areas we commonly look at during this type of review are Roth conversion timing, capital gains, business-owner planning, charitable giving, estate coordination, and whether tax planning is being coordinated with investment decisions.",
      "",
      "Your assessment helps us decide whether any of those areas may be worth reviewing further.",
      "",
      "Here is the scheduling link again in case helpful:",
      calendlyLink,
      "",
      "Thanks,",
      "",
      "Wade Marcy",
      "Unity Tax Planning",
    ].join("\n");
  }

  return [
    `Hi ${firstName},`,
    "",
    "I wanted to send one final follow-up on your Tax Opportunity Scan.",
    "",
    "If you still want to talk through it, you can schedule a time here:",
    calendlyLink,
    "",
    "If now is not the right time, no action is needed.",
    "",
    "Thanks,",
    "",
    "Wade Marcy",
    "Unity Tax Planning",
  ].join("\n");
}

function buildHtmlEmail(lead: TaxLead, step: FollowUpStep) {
  const firstName = escapeHtml(clean(lead.first_name) || "there");
  const scheduleLink = `<a href="${escapeHtml(calendlyLink)}" style="color:#2563eb;text-decoration:underline;">${escapeHtml(calendlyLink)}</a>`;

  if (step.emailType === "day_1_review_process") {
    return `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#111827;background:#ffffff;margin:0;padding:0;">
        <p>Hi ${firstName},</p>

        <p>I wanted to make sure you had the scheduling link in case you would like to talk through your Tax Opportunity Scan.</p>

        <p>Here is the link:<br />${scheduleLink}</p>

        <p>On the call, we will usually look at income, investments, retirement accounts, business ownership, capital gains, and any major planning decisions coming up.</p>

        <p>No pressure at all — I just wanted to make sure you had the next step.</p>

        <p>Thanks,</p>

        <p>Wade Marcy<br />Unity Tax Planning</p>
      </div>
    `;
  }

  if (step.emailType === "day_3_common_gaps") {
    return `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#111827;background:#ffffff;margin:0;padding:0;">
        <p>Hi ${firstName},</p>

        <p>A few areas we commonly look at during this type of review are Roth conversion timing, capital gains, business-owner planning, charitable giving, estate coordination, and whether tax planning is being coordinated with investment decisions.</p>

        <p>Your assessment helps us decide whether any of those areas may be worth reviewing further.</p>

        <p>Here is the scheduling link again in case helpful:<br />${scheduleLink}</p>

        <p>Thanks,</p>

        <p>Wade Marcy<br />Unity Tax Planning</p>
      </div>
    `;
  }

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#111827;background:#ffffff;margin:0;padding:0;">
      <p>Hi ${firstName},</p>

      <p>I wanted to send one final follow-up on your Tax Opportunity Scan.</p>

      <p>If you still want to talk through it, you can schedule a time here:<br />${scheduleLink}</p>

      <p>If now is not the right time, no action is needed.</p>

      <p>Thanks,</p>

      <p>Wade Marcy<br />Unity Tax Planning</p>
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
