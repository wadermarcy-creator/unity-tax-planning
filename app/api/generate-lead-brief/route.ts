import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

const APPROVED_ADMIN_EMAIL = "wadermarcy@gmail.com";

type GenerateBriefRequest = {
  leadId?: string;
};

type LeadRecord = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  household_income: string | null;
  investable_assets: string | null;
  business_owner: boolean | null;
  retiring_soon: boolean | null;
  charitable_giving: boolean | null;
  current_advisor: boolean | null;
  current_cpa: boolean | null;
  upcoming_sale: boolean | null;
  biggest_tax_concern: string | null;
  lead_score: number | null;
  lead_grade: string | null;
  status: string | null;
  unity_opportunity: string | null;
};

type AiBrief = {
  executive_summary: string;
  planning_themes: string[];
  missing_information: string[];
  discovery_questions: string[];
  recommended_service: string;
  unity_opportunity: "yes" | "maybe" | "no" | "unknown";
  risk_flags: string[];
  recommended_next_action: string;
  professional_review_notes: string;
};

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getBearerToken(request: NextRequest) {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
}

function createAuthenticatedSupabaseClient(accessToken: string) {
  const supabaseUrl = getRequiredEnvironmentVariable(
    "NEXT_PUBLIC_SUPABASE_URL",
  );

  const supabaseAnonKey = getRequiredEnvironmentVariable(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function createOpenAIClient() {
  const apiKey = getRequiredEnvironmentVariable("OPENAI_API_KEY");

  return new OpenAI({
    apiKey,
  });
}

function buildLeadContext(lead: LeadRecord) {
  return {
    lead_id: lead.id,
    submitted_at: lead.created_at,
    name:
      [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
      "Unnamed lead",
    household_income: lead.household_income || "Not provided",
    investable_assets: lead.investable_assets || "Not provided",
    business_owner: Boolean(lead.business_owner),
    retiring_soon: Boolean(lead.retiring_soon),
    charitable_giving: Boolean(lead.charitable_giving),
    current_advisor: Boolean(lead.current_advisor),
    current_cpa: Boolean(lead.current_cpa),
    upcoming_sale: Boolean(lead.upcoming_sale),
    intake_summary: lead.biggest_tax_concern || "Not provided",
    lead_score: lead.lead_score ?? 0,
    lead_grade: lead.lead_grade || "Not graded",
    current_status: lead.status || "new",
    current_unity_opportunity: lead.unity_opportunity || "unknown",
  };
}

function isValidAiBrief(value: unknown): value is AiBrief {
  if (!value || typeof value !== "object") {
    return false;
  }

  const brief = value as Record<string, unknown>;

  return (
    typeof brief.executive_summary === "string" &&
    Array.isArray(brief.planning_themes) &&
    brief.planning_themes.every((item) => typeof item === "string") &&
    Array.isArray(brief.missing_information) &&
    brief.missing_information.every((item) => typeof item === "string") &&
    Array.isArray(brief.discovery_questions) &&
    brief.discovery_questions.every((item) => typeof item === "string") &&
    typeof brief.recommended_service === "string" &&
    ["yes", "maybe", "no", "unknown"].includes(
      String(brief.unity_opportunity),
    ) &&
    Array.isArray(brief.risk_flags) &&
    brief.risk_flags.every((item) => typeof item === "string") &&
    typeof brief.recommended_next_action === "string" &&
    typeof brief.professional_review_notes === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Unauthorized. An authenticated admin session is required.",
        },
        {
          status: 401,
        },
      );
    }

    const supabase = createAuthenticatedSupabaseClient(accessToken);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("Admin authentication error:", userError);

      return NextResponse.json(
        {
          error: "Your admin session is invalid or has expired.",
        },
        {
          status: 401,
        },
      );
    }

    if (user.email?.toLowerCase() !== APPROVED_ADMIN_EMAIL) {
      return NextResponse.json(
        {
          error: "This account is not authorized to generate AI briefs.",
        },
        {
          status: 403,
        },
      );
    }

    let requestBody: GenerateBriefRequest;

    try {
      requestBody = (await request.json()) as GenerateBriefRequest;
    } catch {
      return NextResponse.json(
        {
          error: "The request body must contain valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const leadId = requestBody.leadId?.trim();

    if (!leadId) {
      return NextResponse.json(
        {
          error: "A lead ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: leadData, error: leadError } = await supabase
      .from("tax_leads")
      .select(
        `
          id,
          created_at,
          first_name,
          last_name,
          email,
          phone,
          household_income,
          investable_assets,
          business_owner,
          retiring_soon,
          charitable_giving,
          current_advisor,
          current_cpa,
          upcoming_sale,
          biggest_tax_concern,
          lead_score,
          lead_grade,
          status,
          unity_opportunity
        `,
      )
      .eq("id", leadId)
      .single();

    if (leadError || !leadData) {
      console.error("Lead lookup error:", leadError);

      return NextResponse.json(
        {
          error: "The selected lead could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const lead = leadData as LeadRecord;
    const leadContext = buildLeadContext(lead);
    const openai = createOpenAIClient();

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: `
You are an internal tax-planning intake analyst supporting Unity Tax Planning.

Your job is to review a prospect's limited intake information and prepare a
preliminary internal opportunity brief for professional review.

Important requirements:

1. This is internal preliminary analysis, not tax, legal, accounting,
   investment, or financial advice.
2. Do not claim that a strategy is appropriate or guaranteed.
3. Do not calculate or invent estimated tax savings.
4. Do not invent facts that were not provided.
5. Clearly identify missing information before suggesting that a topic be
   investigated.
6. Use cautious language such as "may warrant review," "potential planning
   topic," and "subject to verification."
7. Do not recommend a specific security, investment product, insurance
   product, attorney, CPA, or outside provider.
8. Keep the response concise, practical, and useful for a discovery call.
9. Treat all intake information as confidential.
10. The recommended service must be one of:
    - Tax Blind Spot Review
    - Comprehensive Tax Planning Review
    - Advanced Planning & Family Office Coordination
    - Additional Qualification Needed
11. The Unity opportunity field must be:
    - yes
    - maybe
    - no
    - unknown
12. Risk flags should describe uncertainty, urgency, complexity, missing facts,
    or implementation concerns. Do not accuse the prospect of wrongdoing.
13. Professional review notes must remind the reviewer what must be verified
    before any recommendation is presented.
      `.trim(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Create a structured preliminary AI opportunity brief using the following lead
intake information:

${JSON.stringify(leadContext, null, 2)}
              `.trim(),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "unity_tax_lead_brief",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              executive_summary: {
                type: "string",
                description:
                  "A concise internal summary of the prospect and apparent planning complexity.",
              },
              planning_themes: {
                type: "array",
                description:
                  "Potential planning topics that may warrant professional investigation.",
                items: {
                  type: "string",
                },
              },
              missing_information: {
                type: "array",
                description:
                  "Important facts, documents, or assumptions that are still needed.",
                items: {
                  type: "string",
                },
              },
              discovery_questions: {
                type: "array",
                description:
                  "Focused questions Wade can ask during the initial discovery call.",
                items: {
                  type: "string",
                },
              },
              recommended_service: {
                type: "string",
                enum: [
                  "Tax Blind Spot Review",
                  "Comprehensive Tax Planning Review",
                  "Advanced Planning & Family Office Coordination",
                  "Additional Qualification Needed",
                ],
              },
              unity_opportunity: {
                type: "string",
                enum: ["yes", "maybe", "no", "unknown"],
                description:
                  "Preliminary indication of a possible separate Unity Financial Planning opportunity.",
              },
              risk_flags: {
                type: "array",
                description:
                  "Uncertainties, deadlines, complexities, or issues requiring professional attention.",
                items: {
                  type: "string",
                },
              },
              recommended_next_action: {
                type: "string",
                description:
                  "The single most appropriate next operational step.",
              },
              professional_review_notes: {
                type: "string",
                description:
                  "A reminder of what must be verified before presenting recommendations.",
              },
            },
            required: [
              "executive_summary",
              "planning_themes",
              "missing_information",
              "discovery_questions",
              "recommended_service",
              "unity_opportunity",
              "risk_flags",
              "recommended_next_action",
              "professional_review_notes",
            ],
          },
        },
      },
    });

    const outputText = response.output_text?.trim();

    if (!outputText) {
      console.error("OpenAI returned no output text:", response);

      return NextResponse.json(
        {
          error: "The AI service did not return a usable brief.",
        },
        {
          status: 502,
        },
      );
    }

    let aiBrief: unknown;

    try {
      aiBrief = JSON.parse(outputText);
    } catch (parseError) {
      console.error("Could not parse AI brief JSON:", parseError);
      console.error("Raw AI output:", outputText);

      return NextResponse.json(
        {
          error: "The AI brief could not be parsed.",
        },
        {
          status: 502,
        },
      );
    }

    if (!isValidAiBrief(aiBrief)) {
      console.error("AI brief failed validation:", aiBrief);

      return NextResponse.json(
        {
          error: "The AI brief did not match the required structure.",
        },
        {
          status: 502,
        },
      );
    }

    const generatedAt = new Date().toISOString();

    const { data: updatedLead, error: updateError } = await supabase
      .from("tax_leads")
      .update({
        ai_brief: aiBrief,
        ai_brief_generated_at: generatedAt,
        ai_brief_reviewed: false,
        ai_brief_reviewed_at: null,
        ai_brief_reviewed_by: null,
      })
      .eq("id", leadId)
      .select(
        `
          id,
          ai_brief,
          ai_brief_generated_at,
          ai_brief_reviewed,
          ai_brief_reviewed_at,
          ai_brief_reviewed_by
        `,
      )
      .single();

    if (updateError || !updatedLead) {
      console.error("AI brief save error:", updateError);

      return NextResponse.json(
        {
          error:
            "The AI brief was generated but could not be saved to the lead.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      leadId,
      aiBrief: updatedLead.ai_brief,
      generatedAt: updatedLead.ai_brief_generated_at,
      reviewed: updatedLead.ai_brief_reviewed,
    });
  } catch (error) {
    console.error("Generate lead brief route error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected server error occurred.";

    if (message.includes("Missing required environment variable")) {
      return NextResponse.json(
        {
          error:
            "The AI service has not been fully configured on the server.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Could not generate the AI opportunity brief.",
      },
      {
        status: 500,
      },
    );
  }
}