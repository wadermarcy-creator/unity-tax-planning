"use client";

import { Share2 } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type SocialTabProps = {
  campaign: MarketingCampaign;
};

export default function SocialTab({ campaign }: SocialTabProps) {
  const facebook = campaign.facebook_json;
  const linkedin = campaign.linkedin_json;

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Social
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Social Campaign Assets
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Review AI-generated social copy for Facebook and LinkedIn. Future
            versions will allow editing, copying, and scheduling.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Share2 className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
            Facebook Ad
          </p>

          <h3 className="mt-3 text-2xl font-black text-white">
            {facebook?.headline || "No Facebook headline generated"}
          </h3>

          <p className="mt-4 text-sm font-bold leading-7 text-slate-300">
            {facebook?.primary_text || "No Facebook primary text generated."}
          </p>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Description
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {facebook?.description || "No description generated."}
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
            LinkedIn Post
          </p>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="whitespace-pre-wrap text-sm font-bold leading-7 text-slate-300">
              {linkedin?.post || "No LinkedIn post generated."}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}