import { NextResponse } from "next/server";
import OpenAI from "openai";

type RewriteRequest = {
  asset:
    | "landing_page"
    | "seo"
    | "google_ads"
    | "keywords"
    | "email"
    | "blog"
    | "social";
  campaignName?: string;
  audience?: string;
  location?: string;
  currentText?: string;
  instructions?: string;
  count?: number;
  context?: Record<string, unknown>;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function clampCount(value: unknown) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 5;
  return Math.min(Math.max(Math.round(numberValue), 1), 10);
}

function getAssetInstructions(asset: RewriteRequest["asset"]) {
  switch (asset) {
    case "google_ads":
      return "Create short Google Search ad options. Keep headlines concise and avoid guarantees.";
    case "seo":
      return "Create compliant SEO options with clear niche intent. Avoid guaranteed tax savings language.";
    case "landing_page":
      return "Create conversion-focused landing page copy that is clear, specific, and compliant.";
    case "keywords":
      return "Create search keyword ideas separated as short keyword phrases.";
    case "email":
      return "Create professional follow-up email copy that sounds personal, clear, and fiduciary.";
    case "blog":
      return "Create educational blog copy or article outline ideas for topical authority.";
    case "social":
      return "Create professional social copy suitable for LinkedIn or Facebook.";
    default:
      return "Improve the marketing asset while keeping it compliant and professional.";
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as RewriteRequest;

    if (!body.asset) {
      return NextResponse.json(
        { error: "Missing asset type." },
        { status: 400 },
      );
    }

    const count = clampCount(body.count);

    const prompt = {
      task: "Rewrite or improve a Unity Tax Planning campaign asset.",
      asset: body.asset,
      campaignName: body.campaignName || "Unnamed campaign",
      audience: body.audience || "High-income tax planning prospect",
      location: body.location || "United States",
      currentText: body.currentText || "",
      instructions: body.instructions || "Improve clarity, specificity, and conversion quality.",
      count,
      campaignContext: body.context || {},
      requirements: [
        "Return only valid JSON.",
        "Use this exact shape: { \"options\": [\"option 1\", \"option 2\"] }.",
        `Return exactly ${count} options.`,
        "Do not include markdown.",
        "Do not promise guaranteed tax savings.",
        "Do not provide individualized tax, legal, or investment advice.",
        "Keep language professional, specific, and suitable for a fiduciary planning firm.",
        getAssetInstructions(body.asset),
      ],
    };

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are an expert compliance-aware marketing strategist for a proactive tax planning and wealth management firm.",
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
    });

    const rawText = response.output_text || "";

    let parsed: { options?: string[] } = {};

    try {
      parsed = JSON.parse(rawText) as { options?: string[] };
    } catch {
      const fallbackOptions = rawText
        .split("\n")
        .map((line) => line.replace(/^\d+[\).\s-]+/, "").trim())
        .filter(Boolean)
        .slice(0, count);

      parsed = { options: fallbackOptions };
    }

    const options = (parsed.options || [])
      .map((option) => String(option).trim())
      .filter(Boolean)
      .slice(0, count);

    return NextResponse.json({
      options,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI rewrite failed." },
      { status: 500 },
    );
  }
}
