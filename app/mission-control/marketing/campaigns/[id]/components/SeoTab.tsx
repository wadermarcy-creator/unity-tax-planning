"use client";

import { Search } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type SeoTabProps = {
  campaign: MarketingCampaign;
};

export default function SeoTab({ campaign }: SeoTabProps) {
  const seo = campaign.seo_json;
  const titleLength = seo?.title?.length || 0;
  const metaLength = seo?.meta_description?.length || 0;

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            SEO
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Search Engine Optimization
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Review the campaign&apos;s SEO title, meta description, and search
            preview. Editing comes next after the workspace refactor is complete.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Search className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              SEO Title
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
              {seo?.title || "No SEO title generated"}
            </h3>

            <p className="mt-3 text-sm font-bold text-slate-500">
              {titleLength} characters
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Meta Description
            </p>

            <p className="mt-3 text-sm font-bold leading-7 text-slate-300">
              {seo?.meta_description || "No meta description generated."}
            </p>

            <p className="mt-3 text-sm font-bold text-slate-500">
              {metaLength} characters
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-white p-6 text-slate-950">
            <p className="text-sm text-emerald-700">
              unitytaxplanning.com/landing/
              {campaign.landing_page_json?.slug || campaign.slug}
            </p>

            <h3 className="mt-2 text-xl font-bold text-blue-700">
              {seo?.title || campaign.landing_page_json?.headline || campaign.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {seo?.meta_description ||
                campaign.landing_page_json?.subheadline ||
                "Start with a focused tax planning assessment."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              SEO Guidance
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Title target: 50–60 characters.</p>
              <p>Meta target: 140–160 characters.</p>
              <p>Use niche-specific language naturally.</p>
              <p>Avoid guaranteed tax savings language.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}