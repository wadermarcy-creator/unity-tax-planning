import { NextResponse } from "next/server";

type AssessmentEmailPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  householdIncome?: string;
  investableAssets?: string;
  retirementAssets?: string;
  planningGoal?: string;
  desiredService?: string;
  urgency?: string;
  referralSource?: string;
  leadScore?: number;
  leadGrade?: string;
  qualificationProfile?: string;
  qualificationIncome?: string;
  qualificationAssets?: string;
  qualificationConcern?: string;
  qualificationTeam?: string;
  selectedTopics?: string[];
  concernSummary?: string;
  calendlyLink?: string;
};

const calendlyLink = "https://calendly.com/wade-unitytaxplanning/30min";
const internalAlertEmail =
  process.env.UNITY_TAX_INTERNAL_EMAIL || "wade@unitytaxplanning.com";
const fromEmail =
  process.env.UNITY_TAX_FROM_EMAIL ||
  "Wade Marcy <info@unitytaxplanning.com>";
const replyToEmail =
  process.env.UNITY_TAX_REPLY_TO_EMAIL || "wade@unitytaxplanning.com";

function clean(value: unknown) {
  return String(value || "").trim();
}

function getFullName(payload: AssessmentEmailPayload) {
  const fullName = `${clean(payload.firstName)} ${clean(payload.lastName)}`.trim();
  return fullName || "New assessment submitter";
}

function escapeHtml(value: unknown) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTextValue(value: unknown) {
  const cleaned = clean(value);
  return cleaned || "Not provided";
}

function formatHtmlValue(value: unknown) {
  return escapeHtml(formatTextValue(value));
}

function buildProspectText(payload: AssessmentEmailPayload) {
  const firstName = clean(payload.firstName) || "there";
  const bookingLink = clean(payload.calendlyLink) || calendlyLink;

  return [
    `Hi ${firstName},`,
    "",
    "Thanks for completing the Unity Tax Opportunity Scan.",
    "",
    "I received your assessment and will review the information you submitted. If you would like to talk through it, here is the scheduling link:",
    bookingLink,
    "",
    "On the call, we will usually look at income, investments, retirement accounts, business ownership, capital gains, and any major planning decisions coming up.",
    "",
    "This review is educational and does not create a client relationship. No tax, legal, or investment advice is provided until your situation is reviewed in more detail and an engagement is accepted.",
    "",
    "Thanks,",
    "",
    "Wade Marcy",
    "Unity Tax Planning",
  ].join("\n");
}

function buildProspectHtml(payload: AssessmentEmailPayload) {
  const firstName = escapeHtml(clean(payload.firstName) || "there");
  const bookingLink = clean(payload.calendlyLink) || calendlyLink;

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#111827;background:#ffffff;margin:0;padding:0;">
      <p>Hi ${firstName},</p>

      <p>Thanks for completing the Unity Tax Opportunity Scan.</p>

      <p>I received your assessment and will review the information you submitted. If you would like to talk through it, here is the scheduling link:</p>

      <p><a href="${escapeHtml(bookingLink)}" style="color:#2563eb;text-decoration:underline;">${escapeHtml(bookingLink)}</a></p>

      <p>On the call, we will usually look at income, investments, retirement accounts, business ownership, capital gains, and any major planning decisions coming up.</p>

      <p style="font-size:13px;color:#4b5563;line-height:1.5;">This review is educational and does not create a client relationship. No tax, legal, or investment advice is provided until your situation is reviewed in more detail and an engagement is accepted.</p>

      <p>Thanks,</p>

      <p>Wade Marcy<br />Unity Tax Planning</p>
    </div>
  `;
}

function buildInternalText(payload: AssessmentEmailPayload) {
  const topics = Array.isArray(payload.selectedTopics)
    ? payload.selectedTopics.join(", ")
    : "Not provided";

  return [
    "New Unity Tax Opportunity Scan submitted",
    "",
    `Name: ${getFullName(payload)}`,
    `Email: ${formatTextValue(payload.email)}`,
    `Phone: ${formatTextValue(payload.phone)}`,
    `Lead score: ${formatTextValue(payload.leadScore)}`,
    `Lead grade: ${formatTextValue(payload.leadGrade)}`,
    `Household income: ${formatTextValue(payload.householdIncome)}`,
    `Investable assets: ${formatTextValue(payload.investableAssets)}`,
    `Retirement assets: ${formatTextValue(payload.retirementAssets)}`,
    `Planning goal: ${formatTextValue(payload.planningGoal)}`,
    `Service interest: ${formatTextValue(payload.desiredService)}`,
    `Urgency: ${formatTextValue(payload.urgency)}`,
    `Referral source: ${formatTextValue(payload.referralSource)}`,
    `Qualification profile: ${formatTextValue(payload.qualificationProfile)}`,
    `Qualification team: ${formatTextValue(payload.qualificationTeam)}`,
    `Selected topics: ${topics || "Not provided"}`,
    "",
    "Concern summary:",
    formatTextValue(payload.concernSummary),
    "",
    "Mission Control: https://www.unitytaxplanning.com/mission-control/assessments",
  ].join("\n");
}

function buildInternalHtml(payload: AssessmentEmailPayload) {
  const topics = Array.isArray(payload.selectedTopics)
    ? payload.selectedTopics.join(", ")
    : "Not provided";

  const rows = [
    ["Name", getFullName(payload)],
    ["Email", payload.email],
    ["Phone", payload.phone],
    ["Lead score", payload.leadScore],
    ["Lead grade", payload.leadGrade],
    ["Household income", payload.householdIncome],
    ["Investable assets", payload.investableAssets],
    ["Retirement assets", payload.retirementAssets],
    ["Planning goal", payload.planningGoal],
    ["Service interest", payload.desiredService],
    ["Urgency", payload.urgency],
    ["Referral source", payload.referralSource],
    ["Qualification profile", payload.qualificationProfile],
    ["Qualification income", payload.qualificationIncome],
    ["Qualification assets", payload.qualificationAssets],
    ["Qualification concern", payload.qualificationConcern],
    ["Qualification team", payload.qualificationTeam],
    ["Selected topics", topics],
  ];

  return `
    <div style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
      <div style="max-width:720px;margin:0 auto;padding:32px 20px;">
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:24px;padding:32px;box-shadow:0 20px 40px rgba(0,0,0,0.35);">
          <p style="margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#93c5fd;">New Assessment</p>
          <h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;color:#ffffff;">New Unity Tax Opportunity Scan submitted</h1>
          <div style="display:block;margin:0 0 22px;">
            ${rows
              .map(
                ([label, value]) => `
                  <div style="border-bottom:1px solid #1e293b;padding:12px 0;">
                    <div style="font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#64748b;">${escapeHtml(label)}</div>
                    <div style="margin-top:4px;font-size:15px;line-height:1.6;color:#f8fafc;">${formatHtmlValue(value)}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div style="border-radius:18px;background:#020617;border:1px solid #1e293b;padding:18px;margin:0 0 24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#93c5fd;">Concern Summary</p>
            <pre style="white-space:pre-wrap;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#cbd5e1;">${escapeHtml(payload.concernSummary)}</pre>
          </div>
          <p style="margin:0;">
            <a href="https://www.unitytaxplanning.com/mission-control/assessments" style="display:inline-block;border-radius:16px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;padding:14px 22px;">Open Mission Control</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

async function sendResendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
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
      reply_to: input.replyTo || replyToEmail,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend email failed: ${details}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AssessmentEmailPayload;
    const prospectEmail = clean(payload.email);
    const fullName = getFullName(payload);

    const emailJobs: Promise<unknown>[] = [];

    if (prospectEmail) {
      emailJobs.push(
        sendResendEmail({
          to: prospectEmail,
          subject: "Your Tax Opportunity Scan was received",
          html: buildProspectHtml(payload),
          text: buildProspectText(payload),
        }),
      );
    }

    emailJobs.push(
      sendResendEmail({
        to: internalAlertEmail,
        subject: `New Unity Tax Assessment: ${fullName}`,
        html: buildInternalHtml(payload),
        text: buildInternalText(payload),
      }),
    );

    const results = await Promise.allSettled(emailJobs);
    const failures = results.filter((result) => result.status === "rejected");

    if (failures.length > 0) {
      console.error("One or more assessment emails failed.", failures);
      return NextResponse.json(
        { ok: false, error: "One or more emails failed to send." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Assessment email route failed.", error);

    return NextResponse.json(
      { ok: false, error: "Assessment email route failed." },
      { status: 500 },
    );
  }
}
