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

    const audience = String(body.audience || "").trim();
    const location = String(body.location || "United States").trim();
    const goal = String(
      body.goal || "Generate qualified tax planning assessments",
    ).trim();

    if (!audience) {
      return NextResponse.json(
        { error: "Audience is required." },
        { status: 400 },
      );
    }

    const prompt = `
Create a high-converting landing page for Unity Tax Planning.

Audience: ${audience}
Location: ${location}
Goal: ${goal}

Return ONLY valid JSON using this exact shape:
{
  "slug": "",
  "eyebrow": "",
  "headline": "",
  "subheadline": "",
  "primary_cta": "",
  "audience": "",
  "pain_points": [],
  "opportunities": [],
  "proof_points": []
}

Rules:
- Focus on proactive tax planning, not tax preparation.
- Do not promise tax savings.
- Do not give tax advice.
- Use professional, fiduciary-style language.
- Make the page useful for Google Ads and SEO.
- Keep headline clear and specific.
- Include 4-6 pain points.
- Include 5-7 planning opportunities.
- Include 3 proof points.
- Slug should be lowercase kebab-case.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = response.output_text;
    const json = extractJson(text);

    return NextResponse.json(json);
  } catch (error) {
    console.error("Landing page generation error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Landing page could not be generated.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}