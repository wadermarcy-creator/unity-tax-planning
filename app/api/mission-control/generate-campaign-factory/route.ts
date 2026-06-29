import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI response.");
  }

  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in .env.local." },
        { status: 500 },
      );
    }

    const body = await request.json();

    const category = String(body.category || "").trim();
    const location = String(body.location || "United States").trim();
    const count = Number(body.count || 12);

    if (!category) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 },
      );
    }

    const prompt = `
You are the AI Chief Marketing Officer for Unity Tax Planning.

Create a list of high-value campaign ideas for proactive tax planning.

Category: ${category}
Location: ${location}
Number of campaign ideas: ${count}

Return ONLY valid JSON in this exact shape:

{
  "category": "",
  "location": "",
  "campaigns": [
    {
      "audience": "",
      "campaign_name": "",
      "slug": "",
      "reason": "",
      "estimated_value": "",
      "ad_angle": "",
      "priority": "High"
    }
  ]
}

Rules:
- Focus on audiences likely to have meaningful proactive tax planning needs.
- Use professional, compliance-conscious language.
- Do not promise tax savings.
- Slugs must be lowercase kebab-case.
- Priority must be "High", "Medium", or "Low".
- Campaign ideas should be specific enough to become landing pages.
- Prefer high-income professionals, business owners, investors, and complex planning niches.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const json = extractJson(response.output_text);

    return NextResponse.json(json);
  } catch (error) {
    console.error("Campaign factory error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Campaign factory could not generate ideas.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}