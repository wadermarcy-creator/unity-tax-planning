"use client";

import { FileText } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type BlogTabProps = {
  campaign: MarketingCampaign;
};

export default function BlogTab({ campaign }: BlogTabProps) {
  const blog = campaign.blog_json;
  const outline = blog?.outline || [];

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Blog
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Content & SEO Article Plan
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Review the AI-generated blog topic and outline for this campaign.
            This helps build topical authority around the niche.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <FileText className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
            Blog Title
          </p>

          <h3 className="mt-3 text-3xl font-black leading-tight text-white">
            {blog?.title || "No blog title generated"}
          </h3>

          <div className="mt-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Article Outline
            </p>

            <div className="mt-4 space-y-3">
              {outline.length === 0 ? (
                <p className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
                  No outline generated yet.
                </p>
              ) : (
                outline.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-300">
                      Section {index + 1}
                    </p>

                    <p className="mt-2 text-sm font-bold leading-7 text-slate-300">
                      {item}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Content Summary
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Sections
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {outline.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Purpose
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-300">
                  Support SEO, educate the target audience, and reinforce why
                  proactive planning matters before tax season.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Future Upgrades
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Expand outline into full article.</p>
              <p>Edit title and sections.</p>
              <p>Generate related blog cluster.</p>
              <p>Publish directly to Insights.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}