"use client";

import { Search } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";
import EditorActionBar from "./EditorActionBar";

type SeoFormState = {
  title: string;
  meta_description: string;
};

type SeoTabProps = {
  campaign: MarketingCampaign;
  seoForm: SeoFormState;
  setSeoForm: React.Dispatch<React.SetStateAction<SeoFormState>>;
  isSavingSeo: boolean;
  seoMessage: string;
  onSave: () => void;
};

function buildSeoCopy(seoForm: SeoFormState, campaign: MarketingCampaign) {
  return [
    "SEO TITLE",
    seoForm.title || "Not set",
    "",
    "META DESCRIPTION",
    seoForm.meta_description || "Not set",
    "",
    "URL",
    `https://unitytaxplanning.com/landing/${
      campaign.landing_page_json?.slug || campaign.slug
    }`,
  ].join("\n");
}

export default function SeoTab({
  campaign,
  seoForm,
  setSeoForm,
  isSavingSeo,
  seoMessage,
  onSave,
}: SeoTabProps) {
  const titleLength = seoForm.title.length;
  const metaLength = seoForm.meta_description.length;
  const copyText = buildSeoCopy(seoForm, campaign);

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            SEO Editor
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Search Engine Optimization
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Edit the campaign SEO title and meta description. These will be used
            for the campaign and later connected to the public landing page
            metadata.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Search className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6">
        <EditorActionBar
          saveLabel="Save SEO"
          copyLabel="Copy SEO"
          rewriteLabel="AI Rewrite"
          copyText={copyText}
          isSaving={isSavingSeo}
          onSave={onSave}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              SEO Title ({titleLength} characters)
            </span>
            <input
              value={seoForm.title}
              onChange={(event) =>
                setSeoForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none focus:border-blue-500"
              placeholder="Tax Planning for Pilots | Unity Tax Planning"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Meta Description ({metaLength} characters)
            </span>
            <textarea
              value={seoForm.meta_description}
              onChange={(event) =>
                setSeoForm((current) => ({
                  ...current,
                  meta_description: event.target.value,
                }))
              }
              rows={6}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold leading-7 text-white outline-none focus:border-blue-500"
              placeholder="Explore proactive tax planning strategies for pilots..."
            />
          </label>

          {seoMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {seoMessage}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-white p-6 text-slate-950">
            <p className="text-sm text-emerald-700">
              unitytaxplanning.com/landing/
              {campaign.landing_page_json?.slug || campaign.slug}
            </p>

            <h3 className="mt-2 text-xl font-bold text-blue-700">
              {seoForm.title ||
                campaign.landing_page_json?.headline ||
                campaign.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {seoForm.meta_description ||
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
