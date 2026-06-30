"use client";

import Link from "next/link";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";
import {
  getCampaignStatusLabel,
  getPublicLandingPagePath,
} from "@/components/mission-control/campaigns/helpers";
import { supabase } from "@/lib/supabase";

type CampaignLibraryProps = {
  campaigns: MarketingCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  isLoading: boolean;
};

function hasAsset(value: unknown) {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function getAssetScore(campaign: MarketingCampaign) {
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

function getStatusTone(status: string | null) {
  if (status === "published") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "paused") {
    return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  }

  return "border-blue-500/30 bg-blue-500/10 text-blue-300";
}

function AssetPill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${
        active
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-slate-700 bg-slate-950 text-slate-500"
      }`}
    >
      {active ? "✓ " : ""}
      {label}
    </span>
  );
}

export default function CampaignLibrary({
  campaigns,
  setCampaigns,
  isLoading,
}: CampaignLibraryProps) {
  async function deleteCampaign(id: string) {
    const confirmed = window.confirm(
      "Delete this campaign? This cannot be undone.",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("marketing_campaigns")
      .delete()
      .eq("id", id);

    if (!error) {
      setCampaigns((current) => current.filter((item) => item.id !== id));
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Campaigns
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Campaign Command Center
          </h2>
        </div>

        <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
          {campaigns.length} campaigns
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          No campaigns yet. Generate your first campaign above.
        </div>
      ) : (
        <div className="space-y-5">
          {campaigns.map((campaign) => {
            const score = getAssetScore(campaign);

            return (
              <article
                key={campaign.id}
                className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/50"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black text-white">
                        {campaign.name}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${getStatusTone(
                          campaign.status,
                        )}`}
                      >
                        {getCampaignStatusLabel(campaign.status)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-bold text-blue-300">
                      Audience: {campaign.audience || "Not specified"}
                    </p>

                    <p className="mt-2 text-sm font-medium text-slate-400">
                      Location: {campaign.location || "Not specified"}
                    </p>

                    <p className="mt-4 line-clamp-2 text-sm font-medium leading-6 text-slate-400">
                      {campaign.landing_page_json?.headline ||
                        "No landing page headline available."}
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Campaign Asset Score
                        </p>

                        <p className="text-xs font-black text-slate-400">
                          {score.completed}/{score.total} · {score.percent}%
                        </p>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-950">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${score.percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <AssetPill
                        label="Landing"
                        active={hasAsset(campaign.landing_page_json)}
                      />
                      <AssetPill
                        label="Ads"
                        active={hasAsset(campaign.google_ads_json)}
                      />
                      <AssetPill
                        label="SEO"
                        active={hasAsset(campaign.seo_json)}
                      />
                      <AssetPill
                        label="Keywords"
                        active={hasAsset(campaign.keywords_json)}
                      />
                      <AssetPill
                        label="Blog"
                        active={hasAsset(campaign.blog_json)}
                      />
                      <AssetPill
                        label="Email"
                        active={hasAsset(campaign.email_json)}
                      />
                      <AssetPill
                        label="FAQ"
                        active={hasAsset(campaign.faq_json)}
                      />
                      <AssetPill
                        label="Case Study"
                        active={hasAsset(campaign.case_study_json)}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
                    <Link
                      href={getPublicLandingPagePath(campaign)}
                      className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                    >
                      View Landing Page
                    </Link>

                    <Link
                      href={`/mission-control/marketing/campaigns/${campaign.id}`}
                      className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
                    >
                      Open Workspace
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-black text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}