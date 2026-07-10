import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const calendlySigningKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

const terminalStatuses = new Set(["client", "closed", "archived"]);

type CalendlyWebhookBody = {
  event?: string;
  payload?: Record<string, unknown>;
};

type TaxLead = {
  id: string;
  email: string | null;
  status: string | null;
  created_at: string;
};

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function clean(value: unknown) {
  return String(value || "").trim();
}

function getNestedString(source: unknown, path: string[]) {
  let current = source as Record<string, unknown> | undefined;

  for (const key of path) {
    if (!current || typeof current !== "object") return "";
    current = current[key] as Record<string, unknown> | undefined;
  }

  return clean(current);
}

function getInviteeEmail(payload: Record<string, unknown>) {
  const directEmail = clean(payload.email || payload.invitee_email);

  if (directEmail) return directEmail.toLowerCase();

  const questions = payload.questions_and_answers;

  if (Array.isArray(questions)) {
    const emailAnswer = questions.find((item) => {
      if (!item || typeof item !== "object") return false;

      const answer = item as Record<string, unknown>;
      const question = clean(answer.question).toLowerCase();

      return question.includes("email");
    }) as Record<string, unknown> | undefined;

    if (emailAnswer) {
      const answer = clean(emailAnswer.answer);
      if (answer.includes("@")) return answer.toLowerCase();
    }
  }

  return "";
}

function getInviteeName(payload: Record<string, unknown>) {
  return clean(payload.name || payload.invitee_name || payload.full_name);
}

function getCalendlyInviteeUri(payload: Record<string, unknown>) {
  return clean(payload.uri || payload.invitee_uri);
}

function getCalendlyEventUri(payload: Record<string, unknown>) {
  return (
    clean(payload.event) ||
    clean(payload.scheduled_event) ||
    getNestedString(payload, ["scheduled_event", "uri"]) ||
    clean(payload.event_uri)
  );
}

function parseCalendlySignatureHeader(header: string) {
  const parts = header.split(",").map((part) => part.trim());
  const parsed: Record<string, string> = {};

  for (const part of parts) {
    const [key, ...valueParts] = part.split("=");
    const value = valueParts.join("=");

    if (key && value) parsed[key] = value;
  }

  return {
    timestamp: parsed.t || parsed.timestamp || "",
    signature: parsed.v1 || parsed.signature || parsed.sig || "",
  };
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifyCalendlySignature(rawBody: string, signatureHeader: string | null) {
  if (!calendlySigningKey) {
    return { ok: true, skipped: true };
  }

  if (!signatureHeader) {
    return { ok: false, skipped: false };
  }

  const { timestamp, signature } = parseCalendlySignatureHeader(signatureHeader);

  if (!timestamp || !signature) {
    return { ok: false, skipped: false };
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", calendlySigningKey)
    .update(signedPayload, "utf8")
    .digest("hex");

  return {
    ok: timingSafeEqual(expectedSignature, signature),
    skipped: false,
  };
}

async function findLeadByEmail(email: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tax_leads")
    .select("id, email, status, created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data || null) as TaxLead | null;
}

async function logWebhookEvent(input: {
  eventType: string;
  inviteeEmail: string;
  inviteeName: string;
  inviteeUri: string;
  eventUri: string;
  leadId: string | null;
  actionTaken: string;
  status: "received" | "processed" | "skipped" | "failed";
  errorMessage?: string;
  rawPayload: CalendlyWebhookBody;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("calendly_webhook_events").insert([
    {
      event_type: input.eventType,
      invitee_email: input.inviteeEmail || null,
      invitee_name: input.inviteeName || null,
      calendly_invitee_uri: input.inviteeUri || null,
      calendly_event_uri: input.eventUri || null,
      lead_id: input.leadId,
      action_taken: input.actionTaken,
      status: input.status,
      error_message: input.errorMessage || null,
      raw_payload: input.rawPayload,
    },
  ]);

  if (error) {
    console.error("Calendly webhook event logging failed.", error);
  }
}

async function updateLeadStatus(lead: TaxLead, nextStatus: string) {
  const currentStatus = lead.status || "new";

  if (terminalStatuses.has(currentStatus)) {
    return {
      updated: false,
      actionTaken: `lead_${currentStatus}_not_changed`,
    };
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("tax_leads")
    .update({ status: nextStatus })
    .eq("id", lead.id);

  if (error) {
    throw error;
  }

  return {
    updated: true,
    actionTaken: `lead_status_updated_to_${nextStatus}`,
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "calendly-webhook",
    signatureVerification: calendlySigningKey ? "enabled" : "not_configured",
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("Calendly-Webhook-Signature");

  const signatureCheck = verifyCalendlySignature(rawBody, signatureHeader);

  if (!signatureCheck.ok) {
    return NextResponse.json(
      { ok: false, error: "Invalid Calendly webhook signature." },
      { status: 401 },
    );
  }

  let body: CalendlyWebhookBody;

  try {
    body = JSON.parse(rawBody) as CalendlyWebhookBody;
  } catch (error) {
    console.error("Calendly webhook JSON parse failed.", error);

    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const eventType = clean(body.event);
  const payload = (body.payload || {}) as Record<string, unknown>;
  const inviteeEmail = getInviteeEmail(payload);
  const inviteeName = getInviteeName(payload);
  const inviteeUri = getCalendlyInviteeUri(payload);
  const eventUri = getCalendlyEventUri(payload);
  const rescheduled = payload.rescheduled === true;

  let lead: TaxLead | null = null;
  let actionTaken = "logged_only";
  let status: "received" | "processed" | "skipped" | "failed" = "received";
  let errorMessage = "";

  try {
    if (!eventType) {
      actionTaken = "missing_event_type";
      status = "skipped";
    } else if (!inviteeEmail) {
      actionTaken = "missing_invitee_email";
      status = "skipped";
    } else {
      lead = await findLeadByEmail(inviteeEmail);

      if (!lead) {
        actionTaken = "no_matching_lead";
        status = "skipped";
      } else if (eventType === "invitee.created") {
        const result = await updateLeadStatus(lead, "scheduled");
        actionTaken = result.actionTaken;
        status = result.updated ? "processed" : "skipped";
      } else if (eventType === "invitee.canceled") {
        if (rescheduled) {
          actionTaken = "reschedule_cancel_event_ignored";
          status = "skipped";
        } else if ((lead.status || "new") === "scheduled") {
          const result = await updateLeadStatus(lead, "contacted");
          actionTaken = "canceled_meeting_lead_returned_to_contacted";
          status = result.updated ? "processed" : "skipped";
        } else {
          actionTaken = "canceled_meeting_logged_only";
          status = "skipped";
        }
      } else {
        actionTaken = `unsupported_event_${eventType}`;
        status = "skipped";
      }
    }
  } catch (error) {
    console.error("Calendly webhook processing failed.", error);
    actionTaken = "processing_failed";
    status = "failed";
    errorMessage = error instanceof Error ? error.message : "Unknown Calendly webhook error.";
  }

  await logWebhookEvent({
    eventType: eventType || "unknown",
    inviteeEmail,
    inviteeName,
    inviteeUri,
    eventUri,
    leadId: lead?.id || null,
    actionTaken,
    status,
    errorMessage,
    rawPayload: body,
  });

  const responseStatus = status === "failed" ? 500 : 200;

  return NextResponse.json(
    {
      ok: status !== "failed",
      eventType,
      inviteeEmail: inviteeEmail || null,
      leadId: lead?.id || null,
      actionTaken,
      status,
      signatureVerification: calendlySigningKey
        ? "enabled"
        : "not_configured",
    },
    { status: responseStatus },
  );
}
