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

export type CampaignCaseStudy = {
  title: string;
  client: string;
  summary: string;
  strategies: string[];
  estimated_tax_savings: string;
  disclaimer: string;
};

export type CampaignFaqItem = {
  question: string;
  answer: string;
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

export type CampaignYouTube = {
  title: string;
  hook: string;
  outline: string[];
  call_to_action: string;
};

export type CampaignLeadMagnet = {
  title: string;
  description: string;
  sections: string[];
};

export type CampaignTracking = {
  recommended_conversion_event: string;
  suggested_utm_campaign: string;
  suggested_utm_source: string;
  suggested_utm_medium: string;
};

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
  case_study_json: CampaignCaseStudy | null;
  faq_json: CampaignFaqItem[] | null;
  youtube_json: CampaignYouTube | null;
  lead_magnet_json: CampaignLeadMagnet | null;
  tracking_json: CampaignTracking | null;
  notes: string | null;
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
  case_study: CampaignCaseStudy;
  faq: CampaignFaqItem[];
  youtube_video: CampaignYouTube;
  lead_magnet: CampaignLeadMagnet;
  tracking: CampaignTracking;
};

export const emptyCampaignGeneratorForm: CampaignGeneratorForm = {
  audience: "",
  location: "United States",
  goal: "Generate qualified tax planning assessments",
};