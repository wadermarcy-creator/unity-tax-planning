"use client";

import React from "react";
import type {
  AiLandingPageFormState,
  LandingPageFormState,
} from "@/components/mission-control/landing-pages/types";
import { arrayToLines, slugify } from "@/components/mission-control/landing-pages/helpers";

type AiGeneratorProps = {
  aiForm: AiLandingPageFormState;
  setAiForm: React.Dispatch<React.SetStateAction<AiLandingPageFormState>>;
  setForm: React.Dispatch<React.SetStateAction<LandingPageFormState>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function AiGenerator({
  aiForm,
  setAiForm,
  setForm,
  setMessage,
}: AiGeneratorProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);

  function updateAiForm(field: keyof AiLandingPageFormState, value: string) {
    setAiForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function generateWithAi() {
    setMessage("");

    if (!aiForm.audience.trim()) {
      setMessage("Enter a target audience before generating.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/mission-control/generate-landing-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aiForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "AI generation failed.");
        setIsGenerating(false);
        return;
      }

      setForm({
        slug: slugify(data.slug || data.headline || aiForm.audience),
        eyebrow: data.eyebrow || "",
        headline: data.headline || "",
        subheadline: data.subheadline || "",
        primary_cta: data.primary_cta || "Start My Assessment",
        audience: data.audience || aiForm.audience,
        pain_points: arrayToLines(data.pain_points),
        opportunities: arrayToLines(data.opportunities),
        proof_points: arrayToLines(data.proof_points),
      });

      setMessage(
        "AI draft generated. Review it, edit anything you want, then create the landing page.",
      );
    } catch (error) {
      console.error(error);
      setMessage("AI generation failed. Check your API route and OpenAI key.");
    }

    setIsGenerating(false);
  }

  return (
    <section className="mb-8 rounded-[2rem] border border-violet-500/30 bg-violet-500/10 p-7 shadow-2xl shadow-violet-950/20">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr] xl:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-300">
            AI Landing Page Generator
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
            Tell Mission Control who you want to target.
          </h2>

          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-300">
            Enter a niche, profession, problem, or city. AI will draft the
            headline, CTA, pain points, planning areas, and proof points.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Target Audience
              </label>

              <input
                value={aiForm.audience}
                onChange={(event) => updateAiForm("audience", event.target.value)}
                placeholder="Pilots, dentists, physicians, business owners..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Location
              </label>

              <input
                value={aiForm.location}
                onChange={(event) => updateAiForm("location", event.target.value)}
                placeholder="United States, Atlanta, Georgia..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Goal
              </label>

              <input
                value={aiForm.goal}
                onChange={(event) => updateAiForm("goal", event.target.value)}
                placeholder="Generate qualified tax planning assessments"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <button
              type="button"
              onClick={generateWithAi}
              disabled={isGenerating}
              className="w-full rounded-2xl bg-violet-600 px-6 py-5 text-base font-black text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}