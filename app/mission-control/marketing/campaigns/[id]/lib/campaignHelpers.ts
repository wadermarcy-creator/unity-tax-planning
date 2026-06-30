export function hasAsset(value: unknown) {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToText(value: string[] | undefined) {
  return (value || []).join("\n");
}

export function getAssetScore(campaign: {
  landing_page_json?: unknown;
  google_ads_json?: unknown;
  seo_json?: unknown;
  keywords_json?: unknown;
  blog_json?: unknown;
  email_json?: unknown;
  facebook_json?: unknown;
  linkedin_json?: unknown;
  case_study_json?: unknown;
  faq_json?: unknown;
  youtube_json?: unknown;
  lead_magnet_json?: unknown;
  tracking_json?: unknown;
}) {
  const assets = [
    campaign.landing_page_json,
    campaign.google_ads_json,
    campaign.seo_json,
    campaign.keywords_json,
    campaign.blog_json,
    campaign.email_json,
    campaign.facebook_json,
    campaign.linkedin_json,
    campaign.case_study_json,
    campaign.faq_json,
    campaign.youtube_json,
    campaign.lead_magnet_json,
    campaign.tracking_json,
  ];

  const completed = assets.filter(hasAsset).length;

  return {
    completed,
    total: assets.length,
    percent: Math.round((completed / assets.length) * 100),
  };
}