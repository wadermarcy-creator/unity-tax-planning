import type {
  LandingPageFormState,
  LandingPageRecord,
} from "@/components/mission-control/landing-pages/types";

export function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function arrayToLines(value: string[] | null | undefined) {
  return (value || []).join("\n");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function recordToForm(page: LandingPageRecord): LandingPageFormState {
  return {
    slug: page.slug,
    eyebrow: page.eyebrow,
    headline: page.headline,
    subheadline: page.subheadline,
    primary_cta: page.primary_cta,
    audience: page.audience,
    pain_points: arrayToLines(page.pain_points),
    opportunities: arrayToLines(page.opportunities),
    proof_points: arrayToLines(page.proof_points),
  };
}