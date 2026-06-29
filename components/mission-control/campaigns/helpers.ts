import type {
  CampaignLandingPage,
  GeneratedCampaign,
  MarketingCampaign,
} from "@/components/mission-control/campaigns/types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCampaignStatusLabel(status: string | null) {
  if (!status) return "Draft";

  return status
    .split("-")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getLandingPageFromCampaign(
  campaign: MarketingCampaign,
): CampaignLandingPage | null {
  return campaign.landing_page_json || null;
}

export function getPublicLandingPagePath(campaign: MarketingCampaign) {
  const landingPage = getLandingPageFromCampaign(campaign);

  if (landingPage?.slug) {
    return `/landing/${landingPage.slug}`;
  }

  return `/landing/${campaign.slug}`;
}

export function normalizeGeneratedCampaign(
  campaign: GeneratedCampaign,
): GeneratedCampaign {
  return {
    ...campaign,
    slug: slugify(campaign.slug || campaign.name),
    landing_page: {
      ...campaign.landing_page,
      slug: slugify(campaign.landing_page.slug || campaign.slug || campaign.name),
    },
  };
}