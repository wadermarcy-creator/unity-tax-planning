"use client";

import React from "react";
import type {
  CampaignGeneratorForm,
  GeneratedCampaign,
} from "@/components/mission-control/campaigns/types";

type AiCampaignGeneratorProps = {
  form: CampaignGeneratorForm;
  setForm: React.Dispatch<React.SetStateAction<CampaignGeneratorForm>>;
  generatedCampaign: GeneratedCampaign | null;
  setGeneratedCampaign: React.Dispatch<
    React.SetStateAction<GeneratedCampaign | null>
  >;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function AiCampaignGenerator({
  form,
  setForm,
  generatedCampaign,
  setGeneratedCampaign,
  setMessage,
}: AiCampaignGeneratorProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);

  function updateForm(field: keyof CampaignGeneratorForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function generateCampaign() {
    setMessage("");

    if (!form.audience.trim()) {
      setMessage("Enter a target audience before generating a campaign.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/mission-control/generate-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Campaign generation failed.");
        setIsGenerating(false);
        return;
      }

      setGeneratedCampaign(data as GeneratedCampaign);
      setMessage("Campaign generated. Review the assets, then save it.");
    } catch (error) {
      console.error(error);
      setMessage("Campaign generation failed. Check the API route and OpenAI key.");
    }

    setIsGenerating(false);
  }

  return (
    <section className="rounded-[2rem] border border-violet-500/30 bg-violet-500/10 p-7 shadow-2xl shadow-violet-950/20">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr] xl:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-300">
            AI Campaign Generator
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Generate an entire marketing campaign from one audience.
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-300">
            Create a landing page, Google Ads assets, SEO metadata, keyword
            lists, blog outline, social posts, and an email follow-up sequence
            in one workflow.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Target Audience
              </label>

              <input
                value={form.audience}
                onChange={(event) => updateForm("audience", event.target.value)}
                placeholder="Pilots, physicians, dentists, business owners..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Location
              </label>

              <input
                value={form.location}
                onChange={(event) => updateForm("location", event.target.value)}
                placeholder="United States, Atlanta, Georgia..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Goal
              </label>

              <input
                value={form.goal}
                onChange={(event) => updateForm("goal", event.target.value)}
                placeholder="Generate qualified tax planning assessments"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <button
              type="button"
              onClick={generateCampaign}
              disabled={isGenerating}
              className="w-full rounded-2xl bg-violet-600 px-6 py-5 text-base font-black text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isGenerating ? "Generating Campaign..." : "Generate Campaign"}
            </button>
          </div>

          {generatedCampaign && (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-black text-emerald-300">
                Campaign ready: {generatedCampaign.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}