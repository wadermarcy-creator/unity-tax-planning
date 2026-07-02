import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MeetingPrepRequest = {
  lead: Record<string, unknown>;
  score?: number;
  projectedRevenue?: number;
};

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function normalizeArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.replace(/^[-•\d.\s]+/, "").trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeBrief(value: Record<string, unknown>) {
  const followUp =
    typeof value.followUpEmailDraft === "object" && value.followUpEmailDraft
      ? (value.followUpEmailDraft as Record<string, unknown>)
      : {};

  return {
    summary: String(value.summary || "No summary returned."),
    likelyOpportunities: normalizeArray(value.likelyOpportunities),
    questionsToAsk: normalizeArray(value.questionsToAsk),
    documentsToRequest: normalizeArray(value.documentsToRequest),
    talkingPoints: normalizeArray(value.talkingPoints),
    potentialObjections: normalizeArray(value.potentialObjections),
    followUpEmailDraft: {
      subject: String(followUp.subject || "Follow-up after your tax planning assessment"),
      body: String(followUp.body || "Hi,\n\nThank you for completing the assessment. I look forward to reviewing this with you.\n\nBest,\nWade"),
    },
  };
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as MeetingPrepRequest;

    if (!body.lead) {
      return NextResponse.json(
        { error: "Missing lead data." },
        { status: 400 },
      );
    }

    const prompt = {
      task: "Create an internal advisor meeting prep brief for a tax planning prospect.",
      lead: body.lead,
      leadScore: body.score,
      projectedRevenue: body.projectedRevenue,
      requiredJsonShape: {
        summary: "string",
        likelyOpportunities: ["string"],
        questionsToAsk: ["string"],
        documentsToRequest: ["string"],
        talkingPoints: ["string"],
        potentialObjections: ["string"],
        followUpEmailDraft: {
          subject: "string",
          body: "string",
        },
      },
      requirements: [
        "Return only valid JSON. No markdown. No code fences.",
        "Use the requiredJsonShape exactly.",
        "This is for internal professional review only.",
        "Do not guarantee tax savings.",
        "Do not provide individualized tax, legal, or investment advice.",
        "Use cautious language such as review, consider, evaluate, discuss, model, or coordinate with CPA.",
        "Be specific and useful for a fiduciary advisor preparing for a first meeting.",
      ],
    };

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a compliance-aware planning assistant for a fiduciary financial planner. You prepare internal meeting briefs based on prospect assessment data. Always return valid JSON only.",
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const rawText = response.output_text || "";
    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;

    return NextResponse.json(normalizeBrief(parsed));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Meeting prep failed. Please try again." },
      { status: 500 },
    );
  }
}
