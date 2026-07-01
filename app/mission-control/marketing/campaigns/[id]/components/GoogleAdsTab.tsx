"use client";

import { Megaphone } from "lucide-react";
import { useState } from "react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";
import EditorActionBar from "./EditorActionBar";

type GoogleAdsFormState = {
  headlines: string[];
  descriptions: string[];
};

type GoogleAdsTabProps = {
  campaign: MarketingCampaign;
  googleAdsForm: GoogleAdsFormState;
  setGoogleAdsForm: React.Dispatch<React.SetStateAction<GoogleAdsFormState>>;
  isSavingGoogleAds: boolean;
  googleAdsMessage: string;
  onSave: () => void;
};

function updateArrayValue(
  values: string[],
  index: number,
  nextValue: string,
) {
  return values.map((value, currentIndex) =>
    currentIndex === index ? nextValue : value,
  );
}

function buildGoogleAdsCopy(form: GoogleAdsFormState) {
  return [
    "HEADLINES",
    ...form.headlines.map((headline, index) => `${index + 1}. ${headline}`),
    "",
    "DESCRIPTIONS",
    ...form.descriptions.map(
      (description, index) => `${index + 1}. ${description}`,
    ),
  ].join("\n");
}

function normalizeOptions(options: string[]) {
  return options
    .map((option) => option.trim())
    .filter(Boolean)
    .map((option) => option.replace(/^["']|["']$/g, ""));
}

export default function GoogleAdsTab({
  campaign,
  googleAdsForm,
  setGoogleAdsForm,
  isSavingGoogleAds,
  googleAdsMessage,
  onSave,
}: GoogleAdsTabProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteMessage, setRewriteMessage] = useState("");

  const finalUrl = `https://unitytaxplanning.com/landing/${
    campaign.landing_page_json?.slug || campaign.slug
  }`;

  const previewHeadline =
    googleAdsForm.headlines.find((headline) => headline.trim()) ||
    campaign.landing_page_json?.headline ||
    campaign.name;

  const previewDescription =
    googleAdsForm.descriptions.find((description) => description.trim()) ||
    campaign.landing_page_json?.subheadline ||
    "Start with a focused tax planning assessment.";

  const copyText = buildGoogleAdsCopy(googleAdsForm);

  async function rewriteGoogleAds() {
    setRewriteMessage("");
    setIsRewriting(true);

    try {
      const response = await fetch("/api/mission-control/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: "google_ads",
          campaignName: campaign.name,
          audience: campaign.audience,
          location: campaign.location,
          currentText: copyText,
          count: 10,
          instructions:
            "Generate stronger Google Search ad headline options. Keep each option concise, specific, compliant, and suitable for proactive tax planning.",
          context: {
            landingPage: campaign.landing_page_json,
            seo: campaign.seo_json,
            keywords: campaign.keywords_json,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setRewriteMessage(result.error || "AI rewrite failed.");
        setIsRewriting(false);
        return;
      }

      const options = normalizeOptions(result.options || []);

      if (options.length === 0) {
        setRewriteMessage("AI did not return usable options.");
        setIsRewriting(false);
        return;
      }

      setGoogleAdsForm((current) => ({
        ...current,
        headlines: [
          ...options.slice(0, Math.max(10, current.headlines.length)),
          ...current.headlines,
        ].slice(0, Math.max(15, current.headlines.length)),
      }));

      setRewriteMessage(
        "AI headline options added. Review them, remove anything you do not want, then save.",
      );
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
            Google Ads Editor
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Responsive Search Ad Assets
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Edit headlines and descriptions for this campaign. Use AI Rewrite to
            generate stronger headline options, then save the ones you want.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Megaphone className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6">
        <EditorActionBar
          saveLabel="Save Google Ads"
          copyLabel="Copy Ad Assets"
          rewriteLabel={isRewriting ? "Rewriting..." : "AI Rewrite"}
          copyText={copyText}
          isSaving={isSavingGoogleAds || isRewriting}
          onSave={onSave}
          onRewrite={rewriteGoogleAds}
        />
      </div>

      {(googleAdsMessage || rewriteMessage) && (
        <div className="mt-5 space-y-3">
          {googleAdsMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {googleAdsMessage}
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
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Headlines
              </p>

              <p className="text-xs font-black text-slate-400">
                {googleAdsForm.headlines.length} assets
              </p>
            </div>

            <div className="space-y-4">
              {googleAdsForm.headlines.map((headline, index) => (
                <label key={`headline-${index}`} className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-blue-300">
                    Headline {index + 1} · {headline.length}/30
                  </span>

                  <input
                    value={headline}
                    onChange={(event) =>
                      setGoogleAdsForm((current) => ({
                        ...current,
                        headlines: updateArrayValue(
                          current.headlines,
                          index,
                          event.target.value,
                        ),
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm font-bold text-white outline-none focus:border-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Descriptions
              </p>

              <p className="text-xs font-black text-slate-400">
                {googleAdsForm.descriptions.length} assets
              </p>
            </div>

            <div className="space-y-4">
              {googleAdsForm.descriptions.map((description, index) => (
                <label key={`description-${index}`} className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-blue-300">
                    Description {index + 1} · {description.length}/90
                  </span>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setGoogleAdsForm((current) => ({
                        ...current,
                        descriptions: updateArrayValue(
                          current.descriptions,
                          index,
                          event.target.value,
                        ),
                      }))
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm font-bold leading-7 text-white outline-none focus:border-blue-500"
                  />
                </label>
              ))}
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
              {previewHeadline}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {previewDescription}
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
              Google Ads Limits
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Headlines should generally stay under 30 characters.</p>
              <p>Descriptions should generally stay under 90 characters.</p>
              <p>Use exact and phrase match keywords first.</p>
              <p>Do not scale spend until conversion tracking is active.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
