"use client";

import { Settings } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type SettingsTabProps = {
  campaign: MarketingCampaign;
};

export default function SettingsTab({ campaign }: SettingsTabProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Settings
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Campaign Controls
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Publishing, duplication, archiving, and advanced controls will live
            here.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Settings className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Campaign Name
          </p>
          <p className="mt-3 text-xl font-black text-white">{campaign.name}</p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Slug
          </p>
          <p className="mt-3 break-all text-xl font-black text-white">
            {campaign.slug}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Status
          </p>
          <p className="mt-3 text-xl font-black text-white">
            {campaign.status || "draft"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
          Future Controls
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Duplicate Campaign",
            "Archive Campaign",
            "Republish Landing Page",
            "Export Campaign Assets",
          ].map((item) => (
            <button
              key={item}
              type="button"
              disabled
              className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm font-black text-slate-500"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}