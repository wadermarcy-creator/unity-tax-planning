"use client";

import { Search } from "lucide-react";
import { useState } from "react";
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

function normalizeOptions(options: string[]) {
  return options
    .map((option) => option.trim())
    .filter(Boolean)
    .map((option) => option.replace(/^["']|["']$/g, ""));
}

export default function SeoTab({
  campaign,
  seoForm,
  setSeoForm,
  isSavingSeo,
  seoMessage,
  onSave,
}: SeoTabProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteMessage, setRewriteMessage] = useState("");
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [metaOptions, setMetaOptions] = useState<string[]>([]);

  const titleLength = seoForm.title.length;
  const metaLength = seoForm.meta_description.length;
  const copyText = buildSeoCopy(seoForm, campaign);

  async function rewriteSeo() {
    setRewriteMessage("");
    setTitleOptions([]);
    setMetaOptions([]);
    setIsRewriting(true);

    try {
      const titleResponse = await fetch("/api/mission-control/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: "seo",
          campaignName: campaign.name,
          audience: campaign.audience,
          location: campaign.location,
          currentText: seoForm.title,
          count: 5,
          instructions:
            "Generate SEO title options. Keep them concise, niche-specific, compliant, and generally under 60 characters.",
          context: {
            landingPage: campaign.landing_page_json,
            keywords: campaign.keywords_json,
          },
        }),
      });

      const metaResponse = await fetch("/api/mission-control/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: "seo",
          campaignName: campaign.name,
          audience: campaign.audience,
          location: campaign.location,
          currentText: seoForm.meta_description,
          count: 5,
          instructions:
            "Generate meta description options. Keep them clear, compliant, action-oriented, and generally 140-160 characters.",
          context: {
            landingPage: campaign.landing_page_json,
            keywords: campaign.keywords_json,
          },
        }),
      });

      const titleResult = await titleResponse.json();
      const metaResult = await metaResponse.json();

      if (!titleResponse.ok) {
        setRewriteMessage(titleResult.error || "AI title rewrite failed.");
        setIsRewriting(false);
        return;
      }

      if (!metaResponse.ok) {
        setRewriteMessage(metaResult.error || "AI meta rewrite failed.");
        setIsRewriting(false);
        return;
      }

      const titles = normalizeOptions(titleResult.options || []);
      const metas = normalizeOptions(metaResult.options || []);

      setTitleOptions(titles);
      setMetaOptions(metas);

      if (titles.length === 0 && metas.length === 0) {
        setRewriteMessage("AI did not return usable SEO options.");
      } else {
        setRewriteMessage("AI SEO options generated. Choose the ones you like, then save.");
      }
    } catch (error) {
      console.error(error);
      setRewriteMessage("Unexpected AI rewrite error.");
    }

    setIsRewriting(false);
  }

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
            Edit the campaign SEO title and meta description. Use AI Rewrite to
            generate stronger compliant options.
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
          rewriteLabel={isRewriting ? "Rewriting..." : "AI Rewrite"}
          copyText={copyText}
          isSaving={isSavingSeo || isRewriting}
          onSave={onSave}
          onRewrite={rewriteSeo}
        />
      </div>

      {(seoMessage || rewriteMessage) && (
        <div className="mt-5 space-y-3">
          {seoMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {seoMessage}
            </p>
          )}

          {rewriteMessage && (
            <p className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm font-bold text-violet-200">
              {rewriteMessage}
            </p>
          )}
        </div>
      )}

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

          {titleOptions.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                AI Title Options
              </p>

              <div className="mt-4 space-y-3">
                {titleOptions.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      setSeoForm((current) => ({
                        ...current,
                        title: option,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left text-sm font-bold text-slate-300 hover:border-violet-500 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {metaOptions.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                AI Meta Options
              </p>

              <div className="mt-4 space-y-3">
                {metaOptions.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      setSeoForm((current) => ({
                        ...current,
                        meta_description: option,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left text-sm font-bold leading-7 text-slate-300 hover:border-violet-500 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
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
