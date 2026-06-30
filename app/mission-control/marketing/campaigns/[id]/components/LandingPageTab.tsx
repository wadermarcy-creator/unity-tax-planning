"use client";

import Link from "next/link";
import type {
  CampaignLandingPage,
  MarketingCampaign,
} from "@/components/mission-control/campaigns/types";
import { textToList } from "../lib/campaignHelpers";

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

export default function LandingPageTab({
  campaign,
  landingForm,
  setLandingForm,
  landingPath,
  isSavingLandingPage,
  saveMessage,
  onSave,
}: LandingPageTabProps) {
  const landingPage = campaign.landing_page_json as CampaignLandingPage | null;

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
        Landing Page Editor
      </p>

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
            <button
              type="button"
              onClick={onSave}
              disabled={isSavingLandingPage || !landingPage}
              className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isSavingLandingPage ? "Saving..." : "Save & Republish"}
            </button>

            <Link
              href={landingPath}
              target="_blank"
              className="rounded-2xl border border-slate-700 px-6 py-4 text-center text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
            >
              Preview Page
            </Link>
          </div>

          {saveMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {saveMessage}
            </p>
          )}
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
        </div>
      </div>
    </section>
  );
}