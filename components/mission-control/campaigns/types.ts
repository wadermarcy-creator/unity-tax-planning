export type MarketingCampaign = {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  audience: string | null;
  location: string | null;
  status: string | null;
  landing_page_json: CampaignLandingPage | null;
  google_ads_json: CampaignGoogleAds | null;
  seo_json: CampaignSeo | null;
  keywords_json: CampaignKeywords | null;
  blog_json: CampaignBlog | null;
  email_json: CampaignEmail[] | null;
  facebook_json: CampaignFacebook | null;
  linkedin_json: CampaignLinkedIn | null;
  notes: string | null;
};

export type CampaignGeneratorForm = {
  audience: string;
  location: string;
  goal: string;
};

export type CampaignLandingPage = {
  slug: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta: string;
  audience: string;
  pain_points: string[];
  opportunities: string[];
  proof_points: string[];
};

export type CampaignGoogleAds = {
  headlines: string[];
  descriptions: string[];
};

export type CampaignSeo = {
  title: string;
  meta_description: string;
};

export type CampaignKeywords = {
  primary_keywords: string[];
  secondary_keywords: string[];
  negative_keywords: string[];
};

export type CampaignBlog = {
  title: string;
  outline: string[];
};

export type CampaignEmail = {
  subject: string;
  body: string;
};

export type CampaignFacebook = {
  primary_text: string;
  headline: string;
  description: string;
};

export type CampaignLinkedIn = {
  post: string;
};

export type GeneratedCampaign = {
  name: string;
  slug: string;
  audience: string;
  location: string;
  landing_page: CampaignLandingPage;
  google_ads: CampaignGoogleAds;
  seo: CampaignSeo;
  keywords: CampaignKeywords;
  blog: CampaignBlog;
  email_sequence: CampaignEmail[];
  facebook_ad: CampaignFacebook;
  linkedin_post: CampaignLinkedIn;
};

export const emptyCampaignGeneratorForm: CampaignGeneratorForm = {
  audience: "",
  location: "United States",
  goal: "Generate qualified tax planning assessments",
};