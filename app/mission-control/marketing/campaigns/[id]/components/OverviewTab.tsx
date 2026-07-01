"use client";

import {
  CheckCircle2,
  FileText,
  Globe,
  Megaphone,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import CampaignHealthPanel from "./CampaignHealthPanel";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type OverviewTabProps = {
  campaign: MarketingCampaign;
  landingPath: string;
  score: {
    completed: number;
    total: number;
    percent: number;
  };
};

function PanelCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
        {title}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function MiniRow({
  icon,
  title,
  detail,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-blue-300">
          {icon}
        </div>

        <div>
          <p className="font-black text-white">{title}</p>
          <p className="text-sm text-slate-500">{detail}</p>
        </div>
      </div>

      {value && <p className="font-black text-emerald-300">{value}</p>}
    </div>
  );
}

export default function OverviewTab({
  campaign,
  landingPath,
  score,
}: OverviewTabProps) {
  return (
    <>
      <CampaignHealthPanel campaign={campaign} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr_0.95fr]">
        <PanelCard title="Campaign Overview">
          <p className="text-sm leading-7 text-slate-400">
            Your campaign is live and organized. Continue optimizing assets,
            tracking assessments, and expanding related campaigns.
          </p>

          <div className="mt-6 space-y-1">
            <MiniRow
              icon={<Target className="h-5 w-5" />}
              title="Target Audience"
              detail={campaign.audience || "Not specified"}
            />
            <MiniRow
              icon={<Target className="h-5 w-5" />}
              title="Primary Offer"
              detail={
                campaign.landing_page_json?.primary_cta ||
                "Tax Opportunity Assessment"
              }
            />
            <MiniRow
              icon={<Globe className="h-5 w-5" />}
              title="Geography"
              detail={campaign.location || "United States"}
            />
            <MiniRow
              icon={<TrendingUp className="h-5 w-5" />}
              title="Campaign Goal"
              detail="Generate qualified tax planning assessments"
            />
          </div>
        </PanelCard>

        <PanelCard title="AI Recommendations">
          <div className="space-y-4">
            <MiniRow
              icon={<Sparkles className="h-5 w-5" />}
              title="Publish related campaigns"
              detail="Build adjacent niche campaigns from the same market pack."
              value="High"
            />
            <MiniRow
              icon={<Target className="h-5 w-5" />}
              title="Add campaign attribution"
              detail="Track which landing page generated each assessment."
              value="Next"
            />
            <MiniRow
              icon={<Search className="h-5 w-5" />}
              title="Connect GA4"
              detail="Measure traffic and conversion before ad spend."
              value="Launch"
            />
          </div>
        </PanelCard>

        <PanelCard title="Market Opportunity">
          <div className="flex items-center justify-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-emerald-500 bg-slate-900">
              <div className="text-center">
                <p className="text-4xl font-black text-white">92</p>
                <p className="text-sm text-slate-400">/100</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center font-black text-emerald-300">
            High Opportunity
          </p>
        </PanelCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr_0.9fr]">
        <PanelCard title="Recent Activity">
          <div className="space-y-1">
            <MiniRow
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Campaign workspace created"
              detail="Workspace foundation added"
              value="Today"
            />
            <MiniRow
              icon={<Globe className="h-5 w-5" />}
              title="Landing page published"
              detail={landingPath}
              value="Ready"
            />
            <MiniRow
              icon={<Sparkles className="h-5 w-5" />}
              title="AI assets generated"
              detail={`${score.completed} assets available`}
              value={`${score.percent}%`}
            />
          </div>
        </PanelCard>

        <PanelCard title="Top Opportunities">
          <div className="space-y-1">
            <MiniRow
              icon={<Search className="h-5 w-5" />}
              title="Add 15 long-tail keywords"
              detail="Expand to related search opportunities"
              value="+ traffic"
            />
            <MiniRow
              icon={<FileText className="h-5 w-5" />}
              title="Create 2 related blog posts"
              detail="Increase topical authority"
              value="+ SEO"
            />
            <MiniRow
              icon={<Megaphone className="h-5 w-5" />}
              title="Test sharper ad headline"
              detail="Improve click-through rate"
              value="+ CTR"
            />
          </div>
        </PanelCard>

        <PanelCard title="Campaign Timeline">
          <div className="space-y-5">
            {[
              ["Today", "Workspace opened", "Campaign management center active"],
              ["Today", "Campaign published", "Landing page accepting traffic"],
              [
                "Earlier",
                "AI assets generated",
                "Ads, SEO, email, and blog created",
              ],
              ["Start", "Campaign created", "Initial campaign setup"],
            ].map(([date, title, detail]) => (
              <div key={`${date}-${title}`} className="flex gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    {date}
                  </p>
                  <p className="mt-1 font-black text-white">{title}</p>
                  <p className="text-sm text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </>
  );
}
