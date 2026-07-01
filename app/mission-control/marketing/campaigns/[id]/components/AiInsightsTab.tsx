"use client";

import { Sparkles, Target, Search, BarChart3 } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type AiInsightsTabProps = {
  campaign: MarketingCampaign;
};

function InsightCard({
  icon,
  title,
  detail,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  badge: string;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
            {icon}
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">{detail}</p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
          {badge}
        </span>
      </div>
    </div>
  );
}

export default function AiInsightsTab({ campaign }: AiInsightsTabProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
        AI Insights
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Campaign Recommendations
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
        AI recommendations will become actionable over time. For now, this
        panel highlights the highest-priority launch improvements for{" "}
        {campaign.name}.
      </p>

      <div className="mt-8 space-y-5">
        <InsightCard
          icon={<Target className="h-6 w-6" />}
          title="Add campaign attribution"
          detail="Connect each assessment back to the landing page and campaign that generated it."
          badge="Critical"
        />

        <InsightCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Connect conversion tracking"
          detail="GA4 and Google Ads conversions should be active before meaningful ad spend begins."
          badge="Launch"
        />

        <InsightCard
          icon={<Search className="h-6 w-6" />}
          title="Expand long-tail keywords"
          detail="Add related profession-specific searches to strengthen SEO and reduce paid ad waste."
          badge="SEO"
        />

        <InsightCard
          icon={<Sparkles className="h-6 w-6" />}
          title="Generate related campaigns"
          detail="Build adjacent campaigns from the same market pack to create a stronger campaign cluster."
          badge="Growth"
        />
      </div>
    </section>
  );
}