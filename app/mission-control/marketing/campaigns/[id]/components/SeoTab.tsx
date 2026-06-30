"use client";

import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

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
          rows={5}
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

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
        SEO Editor
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          <Field
            label={`SEO Title (${titleLength} characters)`}
            value={seoForm.title}
            onChange={(value) =>
              setSeoForm((current) => ({ ...current, title: value }))
            }
          />

          <Field
            label={`Meta Description (${metaLength} characters)`}
            value={seoForm.meta_description}
            onChange={(value) =>
              setSeoForm((current) => ({
                ...current,
                meta_description: value,
              }))
            }
            textarea
          />

          <button
            type="button"
            onClick={onSave}
            disabled={isSavingSeo}
            className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isSavingSeo ? "Saving SEO..." : "Save SEO"}
          </button>

          {seoMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {seoMessage}
            </p>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Search Preview
            </p>

            <p className="mt-6 text-sm text-emerald-400">
              unitytaxplanning.com/landing/{campaign.landing_page_json?.slug || campaign.slug}
            </p>

            <h2 className="mt-2 text-xl font-black text-blue-300">
              {seoForm.title || "SEO title will appear here"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {seoForm.meta_description || "Meta description will appear here."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              SEO Guidance
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>
                Title target: <span className="font-black text-white">50–60 characters</span>
              </p>
              <p>
                Meta target: <span className="font-black text-white">140–160 characters</span>
              </p>
              <p>
                Include the audience and tax planning intent naturally.
              </p>
              <p>
                Avoid promises, guarantees, or overly aggressive savings claims.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}