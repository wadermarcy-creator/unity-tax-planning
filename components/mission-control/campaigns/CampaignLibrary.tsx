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
            Campaign Library
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
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-white">
                      {campaign.name}
                    </h3>

                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                      {getCampaignStatusLabel(campaign.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold text-blue-300">
                    Audience: {campaign.audience || "Not specified"}
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-400">
                    Location: {campaign.location || "Not specified"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-400">
                    {campaign.landing_page_json?.headline ||
                      "No landing page headline available."}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link
                    href={getPublicLandingPagePath(campaign)}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                  >
                    View Landing Page
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
          ))}
        </div>
      )}
    </section>
  );
}