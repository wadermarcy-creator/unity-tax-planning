"use client";

import { Megaphone } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type GoogleAdsTabProps = {
  campaign: MarketingCampaign;
};

export default function GoogleAdsTab({ campaign }: GoogleAdsTabProps) {
  const headlines = campaign.google_ads_json?.headlines || [];
  const descriptions = campaign.google_ads_json?.descriptions || [];
  const finalUrl = `https://unitytaxplanning.com/landing/${
    campaign.landing_page_json?.slug || campaign.slug
  }`;

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Google Ads
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Responsive Search Ad Assets
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Review the AI-generated ad copy for this campaign. Next version will
            allow editing, copying, and exporting directly to Google Ads.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Megaphone className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Headlines
              </p>

              <p className="text-xs font-black text-slate-400">
                {headlines.length} generated
              </p>
            </div>

            <div className="space-y-3">
              {headlines.length === 0 ? (
                <p className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-500">
                  No headlines generated yet.
                </p>
              ) : (
                headlines.map((headline, index) => (
                  <div
                    key={`${headline}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-300">
                      Headline {index + 1}
                    </p>

                    <p className="mt-2 font-black text-white">{headline}</p>

                    <p className="mt-2 text-xs font-bold text-slate-500">
                      {headline.length} characters
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Descriptions
              </p>

              <p className="text-xs font-black text-slate-400">
                {descriptions.length} generated
              </p>
            </div>

            <div className="space-y-3">
              {descriptions.length === 0 ? (
                <p className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-500">
                  No descriptions generated yet.
                </p>
              ) : (
                descriptions.map((description, index) => (
                  <div
                    key={`${description}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-300">
                      Description {index + 1}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-white">
                      {description}
                    </p>

                    <p className="mt-2 text-xs font-bold text-slate-500">
                      {description.length} characters
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-white p-6 text-slate-950">
            <p className="text-xs font-bold text-slate-500">
              Sponsored · Unity Tax Planning
            </p>

            <p className="mt-2 text-sm text-emerald-700">
              unitytaxplanning.com
            </p>

            <h3 className="mt-2 text-xl font-bold text-blue-700">
              {headlines[0] || campaign.landing_page_json?.headline || campaign.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {descriptions[0] ||
                campaign.landing_page_json?.subheadline ||
                "Start with a focused tax planning assessment."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Final URL
            </p>

            <p className="mt-4 break-all rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm font-bold text-slate-300">
              {finalUrl}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Launch Notes
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Use exact and phrase match first.</p>
              <p>Start with a focused niche campaign before scaling.</p>
              <p>Add negative keywords before spending meaningful budget.</p>
              <p>Do not increase budget until conversions are tracked.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}