"use client";

import { Search } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type KeywordsFormState = {
  primary_keywords: string;
  secondary_keywords: string;
  negative_keywords: string;
};

type KeywordsTabProps = {
  campaign: MarketingCampaign;
  keywordsForm: KeywordsFormState;
  setKeywordsForm: React.Dispatch<React.SetStateAction<KeywordsFormState>>;
  isSavingKeywords: boolean;
  keywordsMessage: string;
  onSave: () => void;
};

function KeywordTextarea({
  label,
  helper,
  value,
  onChange,
  tone = "blue",
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  tone?: "blue" | "red" | "slate";
}) {
  const count = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean).length;

  const toneClass =
    tone === "red"
      ? "text-red-300"
      : tone === "slate"
        ? "text-slate-300"
        : "text-blue-300";

  return (
    <label className="block rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <span
            className={`block text-xs font-black uppercase tracking-[0.16em] ${toneClass}`}
          >
            {label}
          </span>

          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-black text-slate-300">
          {count}
        </span>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm font-bold leading-7 text-white outline-none focus:border-blue-500"
        placeholder="One keyword per line"
      />
    </label>
  );
}

function PreviewPills({
  title,
  value,
  tone = "blue",
}: {
  title: string;
  value: string;
  tone?: "blue" | "red" | "slate";
}) {
  const keywords = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const toneClass =
    tone === "red"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : tone === "slate"
        ? "border-slate-700 bg-slate-950 text-slate-300"
        : "border-blue-500/30 bg-blue-500/10 text-blue-300";

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length === 0 ? (
          <p className="text-sm text-slate-500">No keywords entered.</p>
        ) : (
          keywords.map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full border px-3 py-2 text-sm font-bold ${toneClass}`}
            >
              {keyword}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default function KeywordsTab({
  campaign,
  keywordsForm,
  setKeywordsForm,
  isSavingKeywords,
  keywordsMessage,
  onSave,
}: KeywordsTabProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Keywords Editor
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Search Intent & Keyword Map
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Edit the primary, secondary, and negative keyword lists for this
            campaign. Use one keyword per line.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Search className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          <KeywordTextarea
            label="Primary Keywords"
            helper="Core commercial intent keywords for ads and SEO."
            value={keywordsForm.primary_keywords}
            onChange={(value) =>
              setKeywordsForm((current) => ({
                ...current,
                primary_keywords: value,
              }))
            }
          />

          <KeywordTextarea
            label="Secondary Keywords"
            helper="Supporting search themes and long-tail variations."
            value={keywordsForm.secondary_keywords}
            onChange={(value) =>
              setKeywordsForm((current) => ({
                ...current,
                secondary_keywords: value,
              }))
            }
            tone="slate"
          />

          <KeywordTextarea
            label="Negative Keywords"
            helper="Exclude low-intent or poor-fit searches to reduce wasted spend."
            value={keywordsForm.negative_keywords}
            onChange={(value) =>
              setKeywordsForm((current) => ({
                ...current,
                negative_keywords: value,
              }))
            }
            tone="red"
          />

          <button
            type="button"
            onClick={onSave}
            disabled={isSavingKeywords}
            className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isSavingKeywords ? "Saving Keywords..." : "Save Keywords"}
          </button>

          {keywordsMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {keywordsMessage}
            </p>
          )}
        </div>

        <div className="space-y-5">
          <PreviewPills
            title="Primary Preview"
            value={keywordsForm.primary_keywords}
          />

          <PreviewPills
            title="Secondary Preview"
            value={keywordsForm.secondary_keywords}
            tone="slate"
          />

          <PreviewPills
            title="Negative Preview"
            value={keywordsForm.negative_keywords}
            tone="red"
          />

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Launch Guidance
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Start with exact and phrase match keywords first.</p>
              <p>Use negative keywords before scaling ad spend.</p>
              <p>Avoid broad match until conversion tracking is reliable.</p>
              <p>Review search terms weekly after launch.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}