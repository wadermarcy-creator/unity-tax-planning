"use client";

import type {
  LandingPageFormState,
  LandingPageRecord,
} from "@/components/mission-control/landing-pages/types";
import { linesToArray, slugify } from "@/components/mission-control/landing-pages/helpers";
import { supabase } from "@/lib/supabase";

type LandingEditorProps = {
  form: LandingPageFormState;
  setForm: React.Dispatch<React.SetStateAction<LandingPageFormState>>;
  setPages: React.Dispatch<React.SetStateAction<LandingPageRecord[]>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  loadPages: () => Promise<void>;
};

export default function LandingEditor({
  form,
  setForm,
  setMessage,
  isSaving,
  setIsSaving,
  loadPages,
}: LandingEditorProps) {
  function updateForm(field: keyof LandingPageFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "slug" ? slugify(value) : value,
    }));
  }

  function generateSlugFromHeadline() {
    setForm((current) => ({
      ...current,
      slug: slugify(current.headline),
    }));
  }

  async function createLandingPage() {
    setMessage("");

    if (
      !form.slug ||
      !form.eyebrow ||
      !form.headline ||
      !form.subheadline ||
      !form.primary_cta ||
      !form.audience
    ) {
      setMessage("Please complete the required fields before saving.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("marketing_landing_pages").insert([
      {
        slug: form.slug,
        eyebrow: form.eyebrow,
        headline: form.headline,
        subheadline: form.subheadline,
        primary_cta: form.primary_cta,
        audience: form.audience,
        pain_points: linesToArray(form.pain_points),
        opportunities: linesToArray(form.opportunities),
        proof_points: linesToArray(form.proof_points),
        is_active: true,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage(
        "This landing page could not be saved. The slug may already exist.",
      );
      setIsSaving(false);
      return;
    }

    setForm({
      slug: "",
      eyebrow: "",
      headline: "",
      subheadline: "",
      primary_cta: "Start My Assessment",
      audience: "",
      pain_points: "",
      opportunities: "",
      proof_points: "",
    });

    setMessage("Landing page created.");
    await loadPages();
    setIsSaving(false);
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
        Landing Page Editor
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Review and publish campaign page
      </h2>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Eyebrow
          </label>
          <input
            value={form.eyebrow}
            onChange={(event) => updateForm("eyebrow", event.target.value)}
            placeholder="Tax Planning for Physicians"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Headline
          </label>
          <input
            value={form.headline}
            onChange={(event) => updateForm("headline", event.target.value)}
            placeholder="Physicians may be missing valuable tax planning opportunities."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Slug
            </label>

            <button
              type="button"
              onClick={generateSlugFromHeadline}
              className="text-xs font-black uppercase tracking-[0.16em] text-blue-300 hover:text-blue-200"
            >
              Generate
            </button>
          </div>

          <input
            value={form.slug}
            onChange={(event) => updateForm("slug", event.target.value)}
            placeholder="physician-tax-planning"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <p className="mt-2 text-xs font-medium text-slate-500">
            URL: /landing/{form.slug || "your-page-slug"}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Subheadline
          </label>
          <textarea
            value={form.subheadline}
            onChange={(event) => updateForm("subheadline", event.target.value)}
            placeholder="If your income is high and your tax situation is getting more complex, a proactive review may help identify areas worth exploring."
            className="min-h-28 w-full resize-y rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-medium leading-7 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Primary CTA
          </label>
          <input
            value={form.primary_cta}
            onChange={(event) => updateForm("primary_cta", event.target.value)}
            placeholder="Start My Physician Assessment"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Audience
          </label>
          <input
            value={form.audience}
            onChange={(event) => updateForm("audience", event.target.value)}
            placeholder="Physicians, specialists, and medical practice owners"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Pain Points
          </label>
          <textarea
            value={form.pain_points}
            onChange={(event) => updateForm("pain_points", event.target.value)}
            placeholder={
              "One per line\nYou earn a high income but feel taxes keep rising.\nYou want better coordination with your CPA."
            }
            className="min-h-32 w-full resize-y rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-medium leading-7 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Opportunities
          </label>
          <textarea
            value={form.opportunities}
            onChange={(event) => updateForm("opportunities", event.target.value)}
            placeholder={
              "One per line\nRetirement plan design\nInvestment tax efficiency\nCharitable planning"
            }
            className="min-h-32 w-full resize-y rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-medium leading-7 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Proof Points
          </label>
          <textarea
            value={form.proof_points}
            onChange={(event) => updateForm("proof_points", event.target.value)}
            placeholder={
              "One per line\nBuilt for proactive planning, not just tax filing.\nDesigned to coordinate with your CPA."
            }
            className="min-h-32 w-full resize-y rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-medium leading-7 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={createLandingPage}
          disabled={isSaving}
          className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isSaving ? "Creating Page..." : "Create Landing Page"}
        </button>
      </div>
    </section>
  );
}