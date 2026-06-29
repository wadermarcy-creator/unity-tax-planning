"use client";

import { useEffect, useState } from "react";
import Header from "@/components/mission-control/Header";
import AiGenerator from "@/components/mission-control/landing-pages/AiGenerator";
import LandingEditor from "@/components/mission-control/landing-pages/LandingEditor";
import LandingLibrary from "@/components/mission-control/landing-pages/LandingLibrary";
import {
  emptyAiLandingPageForm,
  emptyLandingPageForm,
  type AiLandingPageFormState,
  type LandingPageFormState,
  type LandingPageRecord,
} from "@/components/mission-control/landing-pages/types";
import { supabase } from "@/lib/supabase";

export default function LandingPagesCMSPage() {
  const [pages, setPages] = useState<LandingPageRecord[]>([]);
  const [form, setForm] =
    useState<LandingPageFormState>(emptyLandingPageForm);
  const [aiForm, setAiForm] =
    useState<AiLandingPageFormState>(emptyAiLandingPageForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadPages() {
    const { data, error } = await supabase
      .from("marketing_landing_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPages(data as LandingPageRecord[]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadPages();
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        title="Landing Page CMS"
        subtitle="Create, manage, and test ad-specific landing pages."
      />

      <div className="px-6 py-8 lg:px-10">
        <section className="mb-8 rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-7 shadow-2xl shadow-blue-950/20">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-300">
            Marketing Engine
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Build landing pages without touching code.
          </h1>

          <p className="mt-4 max-w-4xl text-lg font-medium leading-8 text-slate-300">
            Generate targeted landing pages for Google Ads, Meta Ads, SEO,
            local campaigns, and niche audiences. Review the AI draft, publish
            it, and send traffic directly into the Unity Tax Opportunity
            Assessment™.
          </p>
        </section>

        <AiGenerator
          aiForm={aiForm}
          setAiForm={setAiForm}
          setForm={setForm}
          setMessage={setMessage}
        />

        {message && (
          <p className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
            {message}
          </p>
        )}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <LandingEditor
            form={form}
            setForm={setForm}
            setPages={setPages}
            setMessage={setMessage}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            loadPages={loadPages}
          />

          <LandingLibrary
            pages={pages}
            setPages={setPages}
            setForm={setForm}
            setMessage={setMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}