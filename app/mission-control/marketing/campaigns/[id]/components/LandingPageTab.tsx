"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  CampaignLandingPage,
  MarketingCampaign,
} from "@/components/mission-control/campaigns/types";
import { textToList } from "../lib/campaignHelpers";
import EditorActionBar from "./EditorActionBar";

type LandingFormState = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta: string;
  audience: string;
  pain_points: string;
  opportunities: string;
  proof_points: string;
};

type LandingPageTabProps = {
  campaign: MarketingCampaign;
  landingForm: LandingFormState;
  setLandingForm: React.Dispatch<React.SetStateAction<LandingFormState>>;
  landingPath: string;
  isSavingLandingPage: boolean;
  saveMessage: string;
  onSave: () => void;
};

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none focus:border-blue-500"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none focus:border-blue-500"
        />
      )}
    </label>
  );
}

function buildLandingCopy(form: LandingFormState) {
  return [
    "EYEBROW",
    form.eyebrow || "Not set",
    "",
    "HEADLINE",
    form.headline || "Not set",
    "",
    "SUBHEADLINE",
    form.subheadline || "Not set",
    "",
    "PRIMARY CTA",
    form.primary_cta || "Not set",
    "",
    "AUDIENCE",
    form.audience || "Not set",
    "",
    "PAIN POINTS",
    form.pain_points || "Not set",
    "",
    "OPPORTUNITIES",
    form.opportunities || "Not set",
    "",
    "PROOF POINTS",
    form.proof_points || "Not set",
  ].join("\n");
}

function normalizeOptions(options: string[]) {
  return options
    .map((option) => option.trim())
    .filter(Boolean)
    .map((option) => option.replace(/^["']|["']$/g, ""));
}

export default function LandingPageTab({
  campaign,
  landingForm,
  setLandingForm,
  landingPath,
  isSavingLandingPage,
  saveMessage,
  onSave,
}: LandingPageTabProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteMessage, setRewriteMessage] = useState("");
  const [headlineOptions, setHeadlineOptions] = useState<string[]>([]);
  const [subheadlineOptions, setSubheadlineOptions] = useState<string[]>([]);
  const [ctaOptions, setCtaOptions] = useState<string[]>([]);

  const landingPage = campaign.landing_page_json as CampaignLandingPage | null;
  const copyText = buildLandingCopy(landingForm);

  async function requestRewrite({
    currentText,
    instructions,
    count,
  }: {
    currentText: string;
    instructions: string;
    count: number;
  }) {
    const response = await fetch("/api/mission-control/ai/rewrite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: "landing_page",
        campaignName: campaign.name,
        audience: landingForm.audience || campaign.audience,
        location: campaign.location,
        currentText,
        count,
        instructions,
        context: {
          landingPage: campaign.landing_page_json,
          seo: campaign.seo_json,
          keywords: campaign.keywords_json,
          googleAds: campaign.google_ads_json,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "AI rewrite failed.");
    }

    return normalizeOptions(result.options || []);
  }

  async function rewriteLandingPage() {
    setRewriteMessage("");
    setHeadlineOptions([]);
    setSubheadlineOptions([]);
    setCtaOptions([]);
    setIsRewriting(true);

    try {
      const [headlines, subheadlines, ctas] = await Promise.all([
        requestRewrite({
          currentText: landingForm.headline,
          count: 5,
          instructions:
            "Generate landing page headline options. Make them specific to the audience, conversion-focused, professional, and compliant. Avoid guaranteed tax savings language.",
        }),
        requestRewrite({
          currentText: landingForm.subheadline,
          count: 5,
          instructions:
            "Generate landing page subheadline options. Make them clear, specific, professional, and focused on proactive tax planning value without guaranteeing results.",
        }),
        requestRewrite({
          currentText: landingForm.primary_cta,
          count: 5,
          instructions:
            "Generate short call-to-action button text options for a tax planning assessment landing page. Keep each option concise and action-oriented.",
        }),
      ]);

      setHeadlineOptions(headlines);
      setSubheadlineOptions(subheadlines);
      setCtaOptions(ctas);

      if (
        headlines.length === 0 &&
        subheadlines.length === 0 &&
        ctas.length === 0
      ) {
        setRewriteMessage("AI did not return usable landing page options.");
      } else {
        setRewriteMessage(
          "AI landing page options generated. Choose the ones you like, then save and republish.",
        );
      }
    } catch (error) {
      console.error(error);
      setRewriteMessage(
        error instanceof Error ? error.message : "Unexpected AI rewrite error.",
      );
    }

    setIsRewriting(false);
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
        Landing Page Editor
      </p>

      <div className="mt-6">
        <EditorActionBar
          saveLabel="Save & Republish"
          copyLabel="Copy Landing Page"
          rewriteLabel={isRewriting ? "Rewriting..." : "AI Rewrite"}
          copyText={copyText}
          isSaving={isSavingLandingPage || isRewriting}
          onSave={onSave}
          onRewrite={rewriteLandingPage}
        />
      </div>

      {(saveMessage || rewriteMessage) && (
        <div className="mt-5 space-y-3">
          {saveMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {saveMessage}
            </p>
          )}

          {rewriteMessage && (
            <p className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm font-bold text-violet-200">
              {rewriteMessage}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          <Field
            label="Eyebrow"
            value={landingForm.eyebrow}
            onChange={(value) =>
              setLandingForm((current) => ({ ...current, eyebrow: value }))
            }
          />

          <Field
            label="Headline"
            value={landingForm.headline}
            onChange={(value) =>
              setLandingForm((current) => ({ ...current, headline: value }))
            }
          />

          {headlineOptions.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                AI Headline Options
              </p>

              <div className="mt-4 space-y-3">
                {headlineOptions.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      setLandingForm((current) => ({
                        ...current,
                        headline: option,
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

          <Field
            label="Subheadline"
            value={landingForm.subheadline}
            onChange={(value) =>
              setLandingForm((current) => ({
                ...current,
                subheadline: value,
              }))
            }
            textarea
          />

          {subheadlineOptions.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                AI Subheadline Options
              </p>

              <div className="mt-4 space-y-3">
                {subheadlineOptions.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      setLandingForm((current) => ({
                        ...current,
                        subheadline: option,
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

          <Field
            label="Primary CTA"
            value={landingForm.primary_cta}
            onChange={(value) =>
              setLandingForm((current) => ({
                ...current,
                primary_cta: value,
              }))
            }
          />

          {ctaOptions.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                AI CTA Options
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {ctaOptions.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      setLandingForm((current) => ({
                        ...current,
                        primary_cta: option,
                      }))
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm font-bold text-slate-300 hover:border-violet-500 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Field
            label="Audience"
            value={landingForm.audience}
            onChange={(value) =>
              setLandingForm((current) => ({ ...current, audience: value }))
            }
          />

          <Field
            label="Pain Points - one per line"
            value={landingForm.pain_points}
            onChange={(value) =>
              setLandingForm((current) => ({
                ...current,
                pain_points: value,
              }))
            }
            textarea
          />

          <Field
            label="Opportunities - one per line"
            value={landingForm.opportunities}
            onChange={(value) =>
              setLandingForm((current) => ({
                ...current,
                opportunities: value,
              }))
            }
            textarea
          />

          <Field
            label="Proof Points - one per line"
            value={landingForm.proof_points}
            onChange={(value) =>
              setLandingForm((current) => ({
                ...current,
                proof_points: value,
              }))
            }
            textarea
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={landingPath}
              target="_blank"
              className="rounded-2xl border border-slate-700 px-6 py-4 text-center text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
            >
              Preview Page
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Live Preview
          </p>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            {landingForm.eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-white">
            {landingForm.headline}
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            {landingForm.subheadline}
          </p>

          <div className="mt-8 rounded-2xl bg-blue-600 px-5 py-4 text-center font-black text-white">
            {landingForm.primary_cta}
          </div>

          <div className="mt-6 space-y-3">
            {textToList(landingForm.pain_points)
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
          </div>

          {!landingPage && (
            <p className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm font-bold text-yellow-200">
              This campaign does not currently have landing page JSON.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
