"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Rocket,
  Sparkles,
} from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type CampaignHealthPanelProps = {
  campaign: MarketingCampaign;
};

type HealthItem = {
  label: string;
  complete: boolean;
  detail: string;
  weight: number;
};

function hasAsset(value: unknown) {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function getLength(value: unknown) {
  return typeof value === "string" ? value.trim().length : 0;
}

function calculateHealth(campaign: MarketingCampaign) {
  const landing = campaign.landing_page_json;
  const seo = campaign.seo_json;
  const ads = campaign.google_ads_json;
  const keywords = campaign.keywords_json;
  const emails = campaign.email_json || [];

  const items: HealthItem[] = [
    {
      label: "Landing Page",
      complete:
        !!landing?.headline &&
        !!landing?.subheadline &&
        !!landing?.primary_cta,
      detail: "Headline, subheadline, and CTA are present.",
      weight: 18,
    },
    {
      label: "SEO Title",
      complete:
        getLength(seo?.title) >= 35 && getLength(seo?.title) <= 70,
      detail: "SEO title should generally be 35–70 characters.",
      weight: 12,
    },
    {
      label: "Meta Description",
      complete:
        getLength(seo?.meta_description) >= 120 &&
        getLength(seo?.meta_description) <= 170,
      detail: "Meta description should generally be 120–170 characters.",
      weight: 12,
    },
    {
      label: "Google Ads",
      complete:
        (ads?.headlines || []).filter((item: string) => item.trim()).length >=
          8 &&
        (ads?.descriptions || []).filter((item: string) => item.trim()).length >=
          2,
      detail: "At least 8 headlines and 2 descriptions are ready.",
      weight: 15,
    },
    {
      label: "Keywords",
      complete:
        (keywords?.primary_keywords || []).length >= 3 &&
        (keywords?.negative_keywords || []).length >= 3,
      detail: "Primary and negative keywords are included.",
      weight: 13,
    },
    {
      label: "Email Sequence",
      complete: emails.length >= 2,
      detail: "At least 2 follow-up emails are ready.",
      weight: 10,
    },
    {
      label: "Blog Asset",
      complete: hasAsset(campaign.blog_json),
      detail: "Campaign has at least one supporting blog idea.",
      weight: 7,
    },
    {
      label: "Social Assets",
      complete: hasAsset(campaign.facebook_json) || hasAsset(campaign.linkedin_json),
      detail: "Facebook or LinkedIn copy exists.",
      weight: 5,
    },
    {
      label: "Tracking",
      complete: hasAsset(campaign.tracking_json),
      detail: "Tracking is not fully connected yet.",
      weight: 8,
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = items
    .filter((item) => item.complete)
    .reduce((sum, item) => sum + item.weight, 0);

  const score = Math.round((completedWeight / totalWeight) * 100);
  const completed = items.filter((item) => item.complete);
  const missing = items.filter((item) => !item.complete);

  return {
    score,
    completed,
    missing,
    items,
  };
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Launch Ready";
  if (score >= 75) return "Nearly Ready";
  if (score >= 60) return "Needs Polish";
  return "Needs Work";
}

function getScoreTone(score: number) {
  if (score >= 90) return "text-emerald-300 border-emerald-500 bg-emerald-500/10";
  if (score >= 75) return "text-blue-300 border-blue-500 bg-blue-500/10";
  if (score >= 60) return "text-yellow-300 border-yellow-500 bg-yellow-500/10";
  return "text-red-300 border-red-500 bg-red-500/10";
}

export default function CampaignHealthPanel({
  campaign,
}: CampaignHealthPanelProps) {
  const health = calculateHealth(campaign);
  const scoreTone = getScoreTone(health.score);

  const topMissing = health.missing.slice(0, 4);
  const topCompleted = health.completed.slice(0, 4);

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
            Campaign Copilot
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Campaign Health
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            This score reviews launch-critical campaign assets and highlights
            what needs attention before paid traffic begins.
          </p>
        </div>

        <div className={`rounded-2xl border px-5 py-4 ${scoreTone}`}>
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em]">
                {getScoreLabel(health.score)}
              </p>
              <p className="text-3xl font-black">{health.score}/100</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-center">
            <div className={`flex h-40 w-40 items-center justify-center rounded-full border-[12px] ${scoreTone}`}>
              <div className="text-center">
                <p className="text-5xl font-black text-white">
                  {health.score}
                </p>
                <p className="text-sm font-bold text-slate-400">/100</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-lg font-black text-white">
            {getScoreLabel(health.score)}
          </p>

          <p className="mt-2 text-center text-sm leading-6 text-slate-500">
            {health.completed.length} of {health.items.length} readiness checks
            are complete.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Strengths
            </p>
          </div>

          <div className="space-y-3">
            {topCompleted.length === 0 ? (
              <p className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-500">
                No major launch assets are complete yet.
              </p>
            ) : (
              topCompleted.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <p className="font-black text-white">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.detail}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-300" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
              Needs Attention
            </p>
          </div>

          <div className="space-y-3">
            {topMissing.length === 0 ? (
              <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-200">
                This campaign looks ready for launch review.
              </p>
            ) : (
              topMissing.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-center gap-2">
                    <CircleDashed className="h-4 w-4 text-yellow-300" />
                    <p className="font-black text-white">{item.label}</p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.detail}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex gap-4">
          <Sparkles className="mt-1 h-5 w-5 shrink-0 text-violet-300" />
          <div>
            <p className="font-black text-white">Copilot Recommendation</p>
            <p className="mt-2 text-sm leading-7 text-violet-100/80">
              {health.score >= 90
                ? "This campaign is close to launch-ready. The next priority is tracking, attribution, and final compliance review before paid traffic."
                : topMissing.length > 0
                  ? `Start with ${topMissing[0].label}. Improving that asset should increase this campaign's launch readiness.`
                  : "Review the campaign and confirm all assets are aligned before launch."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
