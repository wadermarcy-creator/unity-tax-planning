"use client";

import { BarChart3 } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type AnalyticsTabProps = {
  campaign: MarketingCampaign;
};

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-400">{note}</p>
    </div>
  );
}

export default function AnalyticsTab({ campaign }: AnalyticsTabProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Analytics
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Campaign Performance
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Performance tracking will appear here once GA4, Google Ads
            conversions, and campaign attribution are connected.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <BarChart3 className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Visitors" value="—" note="Waiting for GA4" />
        <MetricCard label="Assessments" value="—" note="Needs attribution" />
        <MetricCard label="Consultations" value="—" note="Calendly later" />
        <MetricCard label="Clients" value="—" note="Pipeline later" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Tracking Roadmap
          </p>

          <div className="mt-5 space-y-4">
            {[
              ["GA4", "Track page visitors and engagement."],
              ["Google Ads", "Track ad spend, clicks, and conversions."],
              ["Campaign Attribution", "Connect each assessment to its campaign source."],
              ["Revenue Attribution", "Tie closed clients back to original campaigns."],
            ].map(([title, detail]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="font-black text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Campaign Identity
          </p>

          <div className="mt-5 space-y-4 text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Campaign
              </p>
              <p className="mt-2 font-black text-white">{campaign.name}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Slug
              </p>
              <p className="mt-2 break-all font-black text-white">
                {campaign.slug}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Status
              </p>
              <p className="mt-2 font-black text-white">
                {campaign.status || "draft"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}