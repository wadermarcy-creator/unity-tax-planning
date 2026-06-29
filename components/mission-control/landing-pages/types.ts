export type LandingPageRecord = {
  id: string;
  slug: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta: string;
  audience: string;
  pain_points: string[] | null;
  opportunities: string[] | null;
  proof_points: string[] | null;
  is_active: boolean | null;
  created_at: string;
};

export type LandingPageFormState = {
  slug: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta: string;
  audience: string;
  pain_points: string;
  opportunities: string;
  proof_points: string;
};

export type AiLandingPageFormState = {
  audience: string;
  location: string;
  goal: string;
};

export const emptyLandingPageForm: LandingPageFormState = {
  slug: "",
  eyebrow: "",
  headline: "",
  subheadline: "",
  primary_cta: "Start My Assessment",
  audience: "",
  pain_points: "",
  opportunities: "",
  proof_points: "",
};

export const emptyAiLandingPageForm: AiLandingPageFormState = {
  audience: "",
  location: "United States",
  goal: "Generate qualified tax planning assessments",
};