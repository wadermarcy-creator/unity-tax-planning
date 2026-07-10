import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export async function GET(
  _request: Request,
  context: { params: Promise<{ leadId: string }> },
) {
  try {
    const { leadId } = await context.params;

    if (!leadId) {
      return NextResponse.json(
        { ok: false, error: "Missing lead id." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("prospect_email_events")
      .select(
        "id, lead_id, email_type, recipient_email, status, provider, provider_message_id, error_message, sent_at, created_at",
      )
      .eq("lead_id", leadId)
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("Prospect email events lookup failed.", error);

      return NextResponse.json(
        { ok: false, error: "Prospect email events could not be loaded." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, events: data || [] });
  } catch (error) {
    console.error("Prospect email events route failed.", error);

    return NextResponse.json(
      { ok: false, error: "Prospect email events route failed." },
      { status: 500 },
    );
  }
}
