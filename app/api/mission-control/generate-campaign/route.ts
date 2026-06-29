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

function requiredArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function requiredString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeCampaign(data: any) {
  return {
    name: requiredString(data.name, "Unity Tax Planning Campaign"),
    slug: requiredString(data.slug, "unity-tax-planning-campaign"),
    audience: requiredString(data.audience),
    location: requiredString(data.location, "United States"),

    landing_page: {
      slug: requiredString(data.landing_page?.slug, data.slug),
      eyebrow: requiredString(data.landing_page?.eyebrow),
      headline: requiredString(data.landing_page?.headline),
      subheadline: requiredString(data.landing_page?.subheadline),
      primary_cta: requiredString(
        data.landing_page?.primary_cta,
        "Start My Tax Opportunity Assessment",
      ),
      audience: requiredString(data.landing_page?.audience, data.audience),
      pain_points: requiredArray(data.landing_page?.pain_points),
      opportunities: requiredArray(data.landing_page?.opportunities),
      proof_points: requiredArray(data.landing_page?.proof_points),
    },

    case_study: {
      title: requiredString(data.case_study?.title),
      client: requiredString(data.case_study?.client),
      summary: requiredString(data.case_study?.summary),
      strategies: requiredArray(data.case_study?.strategies),
      estimated_tax_savings: requiredString(
        data.case_study?.estimated_tax_savings,
      ),
      disclaimer: requiredString(
        data.case_study?.disclaimer,
        "Illustrative example only. Results will vary.",
      ),
    },

    faq: requiredArray(data.faq),

    google_ads: {
      headlines: requiredArray(data.google_ads?.headlines),
      descriptions: requiredArray(data.google_ads?.descriptions),
    },

    seo: {
      title: requiredString(data.seo?.title),
      meta_description: requiredString(data.seo?.meta_description),
    },

    keywords: {
      primary_keywords: requiredArray(data.keywords?.primary_keywords),
      secondary_keywords: requiredArray(data.keywords?.secondary_keywords),
      negative_keywords: requiredArray(data.keywords?.negative_keywords),
    },

    blog: {
      title: requiredString(data.blog?.title),
      outline: requiredArray(data.blog?.outline),
    },

    email_sequence: requiredArray(data.email_sequence),

    facebook_ad: {
      primary_text: requiredString(data.facebook_ad?.primary_text),
      headline: requiredString(data.facebook_ad?.headline),
      description: requiredString(data.facebook_ad?.description),
    },

    linkedin_post: {
      post: requiredString(
        data.linkedin_post?.post || data.linkedin_post?.text,
      ),
    },

    youtube_video: {
      title: requiredString(data.youtube_video?.title),
      hook: requiredString(data.youtube_video?.hook),
      outline: requiredArray(data.youtube_video?.outline),
      call_to_action: requiredString(data.youtube_video?.call_to_action),
    },

    lead_magnet: {
      title: requiredString(data.lead_magnet?.title),
      description: requiredString(data.lead_magnet?.description),
      sections: requiredArray(data.lead_magnet?.sections),
    },

    tracking: {
      recommended_conversion_event: requiredString(
        data.tracking?.recommended_conversion_event,
        "Tax Opportunity Assessment Submitted",
      ),
      suggested_utm_campaign: requiredString(
        data.tracking?.suggested_utm_campaign,
      ),
      suggested_utm_source: requiredString(data.tracking?.suggested_utm_source),
      suggested_utm_medium: requiredString(data.tracking?.suggested_utm_medium),
    },
  };
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
You are the AI Chief Marketing Officer for Unity Tax Planning.

Create a complete, compliance-conscious marketing campaign for proactive tax planning.

Audience: ${audience}
Location: ${location}
Goal: ${goal}

Return ONLY valid JSON. Do not include markdown. Do not include commentary.

Use exactly this JSON structure:

{
  "name": "",
  "slug": "",
  "audience": "",
  "location": "",

  "landing_page": {
    "slug": "",
    "eyebrow": "",
    "headline": "",
    "subheadline": "",
    "primary_cta": "",
    "audience": "",
    "pain_points": [],
    "opportunities": [],
    "proof_points": []
  },

  "case_study": {
    "title": "",
    "client": "",
    "summary": "",
    "strategies": [],
    "estimated_tax_savings": "",
    "disclaimer": "Illustrative example only. Results will vary."
  },

  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ],

  "google_ads": {
    "headlines": [],
    "descriptions": []
  },

  "seo": {
    "title": "",
    "meta_description": ""
  },

  "keywords": {
    "primary_keywords": [],
    "secondary_keywords": [],
    "negative_keywords": []
  },

  "blog": {
    "title": "",
    "outline": []
  },

  "email_sequence": [
    {
      "subject": "",
      "body": ""
    }
  ],

  "facebook_ad": {
    "primary_text": "",
    "headline": "",
    "description": ""
  },

  "linkedin_post": {
    "post": ""
  },

  "youtube_video": {
    "title": "",
    "hook": "",
    "outline": [],
    "call_to_action": ""
  },

  "lead_magnet": {
    "title": "",
    "description": "",
    "sections": []
  },

  "tracking": {
    "recommended_conversion_event": "",
    "suggested_utm_campaign": "",
    "suggested_utm_source": "",
    "suggested_utm_medium": ""
  }
}

Campaign rules:
- Focus on proactive tax planning, not tax preparation.
- Do not promise tax savings.
- Do not guarantee outcomes.
- Do not provide individualized tax advice.
- Use professional, fiduciary-style language.
- Use clear direct-response copy for ads.
- Make the landing page useful for both Google Ads and SEO.
- The slug must be lowercase kebab-case.
- The landing page slug should be short and keyword-rich.

Content requirements:
- Include 5-7 pain points.
- Include 6-8 planning opportunities.
- Include 3-5 proof points.
- Include 10-15 Google Ads headlines.
- Include exactly 4 Google Ads descriptions.
- Include 6-10 primary keywords.
- Include 8-12 secondary keywords.
- Include 10-15 negative keywords.
- Include 6 audience-specific FAQs.
- Include a realistic illustrative case study specific to the audience.
- The case study must include a clear disclaimer that results vary.
- Include a 5-part blog outline.
- Include a 3-email follow-up sequence.
- Include one Facebook ad.
- Include one LinkedIn post.
- Include one YouTube video outline.
- Include one lead magnet idea.

Important compliance rules:
- Avoid "guaranteed savings."
- Avoid "we will reduce your taxes."
- Prefer "may help identify," "planning areas," "opportunities worth reviewing," and "tax strategy discussion."
- Estimated tax savings in the case study must be clearly labeled illustrative.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = response.output_text;
    const parsed = extractJson(rawText);
    const normalized = normalizeCampaign(parsed);

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Campaign generation error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Campaign could not be generated.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}