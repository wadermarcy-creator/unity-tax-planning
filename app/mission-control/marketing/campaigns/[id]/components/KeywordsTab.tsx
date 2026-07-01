"use client";

import { Search } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type KeywordsTabProps = {
  campaign: MarketingCampaign;
};

function KeywordPill({
  keyword,
  tone = "blue",
}: {
  keyword: string;
  tone?: "blue" | "slate" | "red";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : tone === "slate"
        ? "border-slate-700 bg-slate-950 text-slate-300"
        : "border-blue-500/30 bg-blue-500/10 text-blue-300";

  return (
    <span
      className={`rounded-full border px-3 py-2 text-sm font-bold ${toneClass}`}
    >
      {keyword}
    </span>
  );
}

export default function KeywordsTab({ campaign }: KeywordsTabProps) {
  const primary = campaign.keywords_json?.primary_keywords || [];
  const secondary = campaign.keywords_json?.secondary_keywords || [];
  const negative = campaign.keywords_json?.negative_keywords || [];

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Keywords
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Search Intent & Keyword Map
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Review primary, secondary, and negative keywords for this campaign.
            These keywords support both Google Ads and SEO planning.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Search className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                Primary Keywords
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Core commercial intent
              </p>
            </div>

            <p className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-300">
              {primary.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {primary.length === 0 ? (
              <p className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-500">
                No primary keywords generated yet.
              </p>
            ) : (
              primary.map((keyword) => (
                <KeywordPill key={keyword} keyword={keyword} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Secondary Keywords
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Supporting search themes
              </p>
            </div>

            <p className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-slate-300">
              {secondary.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {secondary.length === 0 ? (
              <p className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-500">
                No secondary keywords generated yet.
              </p>
            ) : (
              secondary.map((keyword) => (
                <KeywordPill key={keyword} keyword={keyword} tone="slate" />
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">
                Negative Keywords
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Exclusions to reduce waste
              </p>
            </div>

            <p className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-black text-red-300">
              {negative.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {negative.length === 0 ? (
              <p className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-500">
                No negative keywords generated yet.
              </p>
            ) : (
              negative.map((keyword) => (
                <KeywordPill key={keyword} keyword={keyword} tone="red" />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Google Ads Use
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Start with exact and phrase match keywords. Avoid broad match until
            conversion tracking is reliable.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            SEO Use
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Use primary keywords in the title, H1, URL, and opening copy while
            keeping the language natural and compliant.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Next Upgrade
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Future versions will add CPC, search volume, SEO difficulty, and
            one-click keyword expansion.
          </p>
        </div>
      </div>
    </section>
  );
}