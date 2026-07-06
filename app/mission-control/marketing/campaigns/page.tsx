"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/mission-control/Header";
import AiCampaignGenerator from "@/components/mission-control/campaigns/AiCampaignGenerator";
import CampaignDetails from "@/components/mission-control/campaigns/CampaignDetails";
import CampaignLibrary from "@/components/mission-control/campaigns/CampaignLibrary";
import {
  emptyCampaignGeneratorForm,
  type CampaignGeneratorForm,
  type GeneratedCampaign,
  type MarketingCampaign,
} from "@/components/mission-control/campaigns/types";
import { normalizeGeneratedCampaign } from "@/components/mission-control/campaigns/helpers";
import { supabase } from "@/lib/supabase";

const FACTORY_DRAFT_STORAGE_KEY = "unity-tax-campaign-factory-draft";

type FactoryCampaignDraft = {
  source?: string;
  createdAt?: string;
  category?: string;
  location?: string;
  audience?: string;
  campaignName?: string;
  slug?: string;
  reason?: string;
  estimatedValue?: string;
  adAngle?: string;
  priority?: string;
  priorityScore?: number;
};

type Toast = {
  message: string;
  tone: "success" | "warning" | "error";
};

function safeDecode(value: string | null) {
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readFactoryDraftFromBrowser(): FactoryCampaignDraft | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const hasFactorySignal =
    params.get("factoryDraft") === "1" ||
    params.has("audience") ||
    params.has("campaignName") ||
    params.has("campaign_name");

  if (!hasFactorySignal) return null;

  let storedDraft: FactoryCampaignDraft = {};

  try {
    const storedValue = window.localStorage.getItem(FACTORY_DRAFT_STORAGE_KEY);
    if (storedValue) {
      storedDraft = JSON.parse(storedValue) as FactoryCampaignDraft;
    }
  } catch (error) {
    console.error("Could not read Campaign Factory draft.", error);
  }

  const urlDraft: FactoryCampaignDraft = {
    source: "campaign-factory",
    category: safeDecode(params.get("category")),
    location: safeDecode(params.get("location")),
    audience: safeDecode(params.get("audience")),
    campaignName:
      safeDecode(params.get("campaignName")) ||
      safeDecode(params.get("campaign_name")),
    slug: safeDecode(params.get("slug")),
    reason: safeDecode(params.get("reason")),
    estimatedValue:
      safeDecode(params.get("estimatedValue")) ||
      safeDecode(params.get("estimated_value")),
    adAngle:
      safeDecode(params.get("adAngle")) || safeDecode(params.get("ad_angle")),
    priority: safeDecode(params.get("priority")),
    priorityScore: Number(params.get("priorityScore") || 0) || undefined,
  };

  const draft = {
    ...urlDraft,
    ...storedDraft,
    audience: storedDraft.audience || urlDraft.audience,
    location: storedDraft.location || urlDraft.location,
    campaignName: storedDraft.campaignName || urlDraft.campaignName,
    slug: storedDraft.slug || urlDraft.slug,
    reason: storedDraft.reason || urlDraft.reason,
    estimatedValue: storedDraft.estimatedValue || urlDraft.estimatedValue,
    adAngle: storedDraft.adAngle || urlDraft.adAngle,
    priority: storedDraft.priority || urlDraft.priority,
    priorityScore: storedDraft.priorityScore || urlDraft.priorityScore,
  };

  if (!draft.audience && !draft.campaignName) return null;

  return draft;
}

function getFactoryDraftSummary(draft: FactoryCampaignDraft) {
  return [
    draft.campaignName ? `Campaign: ${draft.campaignName}` : null,
    draft.audience ? `Audience: ${draft.audience}` : null,
    draft.location ? `Location: ${draft.location}` : null,
    draft.priority ? `Priority: ${draft.priority}` : null,
    draft.priorityScore ? `Priority Score: ${draft.priorityScore}/100` : null,
    draft.estimatedValue
      ? `Projected Annual Revenue: ${draft.estimatedValue}`
      : null,
    draft.adAngle ? `Ad Angle: ${draft.adAngle}` : null,
    draft.reason ? `AI Recommendation: ${draft.reason}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildPrefilledForm(
  currentForm: CampaignGeneratorForm,
  draft: FactoryCampaignDraft,
) {
  const campaignName = draft.campaignName || draft.audience || "";
  const audience = draft.audience || "";
  const location = draft.location || "";
  const slug = draft.slug || "";
  const adAngle = draft.adAngle || "";
  const reason = draft.reason || "";
  const estimatedValue = draft.estimatedValue || "";
  const priority = draft.priority || "";
  const notes = [
    reason ? `AI Executive Recommendation: ${reason}` : null,
    adAngle ? `Ad angle: ${adAngle}` : null,
    estimatedValue ? `Projected annual revenue: ${estimatedValue}` : null,
    priority ? `Priority: ${priority}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ...currentForm,

    // Current campaign generator field names.
    audience,
    location,

    // Common alternate names used across Mission Control forms.
    name: campaignName,
    campaignName,
    campaign_name: campaignName,
    title: campaignName,
    slug,
    adAngle,
    ad_angle: adAngle,
    angle: adAngle,
    recommendation: reason,
    reason,
    priority,
    estimatedValue,
    estimated_value: estimatedValue,
    projectedAnnualRevenue: estimatedValue,
    notes,
    additionalContext: notes,
    context: notes,
  } as CampaignGeneratorForm;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [form, setForm] =
    useState<CampaignGeneratorForm>(emptyCampaignGeneratorForm);
  const [generatedCampaign, setGeneratedCampaign] =
    useState<GeneratedCampaign | null>(null);
  const [factoryDraft, setFactoryDraft] = useState<FactoryCampaignDraft | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const factoryDraftSummary = useMemo(() => {
    if (!factoryDraft) return "";
    return getFactoryDraftSummary(factoryDraft);
  }, [factoryDraft]);

  async function loadCampaigns() {
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCampaigns(data as MarketingCampaign[]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    const draft = readFactoryDraftFromBrowser();

    if (!draft) return;

    setFactoryDraft(draft);
    setForm((currentForm) => buildPrefilledForm(currentForm, draft));
    setMessage(
      "Campaign Factory draft loaded. Review the pre-filled inputs, then generate the full campaign.",
    );
    setToast({
      message: "Factory draft loaded into Campaign Builder.",
      tone: "success",
    });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  function clearFactoryDraft() {
    try {
      window.localStorage.removeItem(FACTORY_DRAFT_STORAGE_KEY);
      window.history.replaceState(null, "", window.location.pathname);
    } catch (error) {
      console.error("Could not clear Campaign Factory draft.", error);
    }

    setFactoryDraft(null);
    setMessage("Campaign Factory draft cleared. You can build a campaign manually.");
    setToast({ message: "Factory draft cleared.", tone: "warning" });
  }

  async function copyFactoryDraft() {
    if (!factoryDraftSummary) return;

    try {
      await navigator.clipboard.writeText(factoryDraftSummary);
      setToast({ message: "Factory draft copied.", tone: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Could not copy Factory draft.", tone: "error" });
    }
  }

  async function saveCampaign() {
    if (!generatedCampaign) return;

    setMessage("");
    setIsSaving(true);

    const campaign = normalizeGeneratedCampaign(generatedCampaign);

    const { error } = await supabase.from("marketing_campaigns").insert([
      {
        name: campaign.name,
        slug: campaign.slug,
        audience: campaign.audience,
        location: campaign.location,
        status: "draft",
        landing_page_json: campaign.landing_page,
        google_ads_json: campaign.google_ads,
        seo_json: campaign.seo,
        keywords_json: campaign.keywords,
        blog_json: campaign.blog,
        email_json: campaign.email_sequence,
        facebook_json: campaign.facebook_ad,
        linkedin_json: campaign.linkedin_post,
        case_study_json: campaign.case_study,
        faq_json: campaign.faq,
        youtube_json: campaign.youtube_video,
        lead_magnet_json: campaign.lead_magnet,
        tracking_json: campaign.tracking,
        notes: `Generated campaign for ${campaign.audience}.`,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Campaign could not be saved. The slug may already exist.");
      setToast({
        message: "Campaign could not be saved. The slug may already exist.",
        tone: "error",
      });
      setIsSaving(false);
      return;
    }

    setMessage("Campaign draft saved.");
    setToast({ message: "Campaign draft saved.", tone: "success" });
    setGeneratedCampaign(null);
    await loadCampaigns();
    setIsSaving(false);
  }

  async function publishCampaign() {
    if (!generatedCampaign) return;

    setMessage("");
    setIsPublishing(true);

    const campaign = normalizeGeneratedCampaign(generatedCampaign);
    const landingPage = campaign.landing_page;

    const { error: campaignError } = await supabase
      .from("marketing_campaigns")
      .upsert(
        [
          {
            name: campaign.name,
            slug: campaign.slug,
            audience: campaign.audience,
            location: campaign.location,
            status: "published",
            landing_page_json: landingPage,
            google_ads_json: campaign.google_ads,
            seo_json: campaign.seo,
            keywords_json: campaign.keywords,
            blog_json: campaign.blog,
            email_json: campaign.email_sequence,
            facebook_json: campaign.facebook_ad,
            linkedin_json: campaign.linkedin_post,
            case_study_json: campaign.case_study,
            faq_json: campaign.faq,
            youtube_json: campaign.youtube_video,
            lead_magnet_json: campaign.lead_magnet,
            tracking_json: campaign.tracking,
            notes: `Published campaign for ${campaign.audience}.`,
          },
        ],
        { onConflict: "slug" },
      );

    if (campaignError) {
      console.error(campaignError);
      setMessage("Campaign could not be published.");
      setToast({ message: "Campaign could not be published.", tone: "error" });
      setIsPublishing(false);
      return;
    }

    const { error: landingPageError } = await supabase
      .from("marketing_landing_pages")
      .upsert(
        [
          {
            slug: landingPage.slug,
            eyebrow: landingPage.eyebrow,
            headline: landingPage.headline,
            subheadline: landingPage.subheadline,
            primary_cta: landingPage.primary_cta,
            audience: landingPage.audience,
            pain_points: landingPage.pain_points,
            opportunities: landingPage.opportunities,
            proof_points: landingPage.proof_points,
            is_active: true,
          },
        ],
        { onConflict: "slug" },
      );

    if (landingPageError) {
      console.error(landingPageError);
      setMessage(
        "Campaign saved, but landing page could not be published. Check landing page permissions.",
      );
      setToast({
        message: "Campaign saved, but landing page could not be published.",
        tone: "warning",
      });
      setIsPublishing(false);
      return;
    }

    setMessage(`Campaign published. Live page: /landing/${landingPage.slug}`);
    setToast({ message: "Campaign published.", tone: "success" });
    setGeneratedCampaign(null);
    await loadCampaigns();
    setIsPublishing(false);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Campaigns"
        subtitle="Generate complete marketing campaigns for Unity Tax Planning."
      />

      {toast && (
        <div className="fixed bottom-5 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-md">
          <div
            className={`rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
              toast.tone === "success"
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100 shadow-emerald-950/30"
                : toast.tone === "warning"
                  ? "border-amber-400/30 bg-amber-500/15 text-amber-100 shadow-amber-950/30"
                  : "border-rose-400/30 bg-rose-500/15 text-rose-100 shadow-rose-950/30"
            }`}
          >
            <p className="text-sm font-black">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {factoryDraft && (
          <section className="mb-6 overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-5 shadow-2xl shadow-emerald-950/20 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200 sm:text-sm">
                  Campaign Factory Draft Loaded
                </p>

                <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {factoryDraft.campaignName || factoryDraft.audience}
                </h1>

                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
                  The generator below has been pre-filled from Campaign Factory.
                  Review the inputs, generate the full campaign, then save it as
                  a draft or publish the landing page.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Priority Score
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {factoryDraft.priorityScore || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Projected Revenue
                  </p>
                  <p className="mt-2 text-sm font-black leading-6 text-white">
                    {factoryDraft.estimatedValue || "Review in generator"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Priority
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {factoryDraft.priority || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  AI Executive Recommendation
                </p>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
                  {factoryDraft.reason ||
                    "Campaign Factory selected this audience for builder review."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Ad Angle
                </p>
                <p className="mt-3 text-sm font-black leading-7 text-white">
                  {factoryDraft.adAngle || "Use the campaign generator below."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={copyFactoryDraft}
                className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-black text-emerald-100 transition hover:bg-emerald-500/20"
              >
                Copy Factory Brief
              </button>

              <button
                type="button"
                onClick={clearFactoryDraft}
                className="rounded-2xl border border-slate-700 px-5 py-4 text-sm font-black text-slate-300 transition hover:border-amber-400/50 hover:text-white"
              >
                Clear Factory Draft
              </button>
            </div>
          </section>
        )}

        <div className="mb-8">
          <AiCampaignGenerator
            form={form}
            setForm={setForm}
            generatedCampaign={generatedCampaign}
            setGeneratedCampaign={setGeneratedCampaign}
            setMessage={setMessage}
          />
        </div>

        {message && (
          <p className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
            {message}
          </p>
        )}

        <div className="grid gap-6">
          <CampaignDetails
            generatedCampaign={generatedCampaign}
            saveCampaign={saveCampaign}
            publishCampaign={publishCampaign}
            isSaving={isSaving}
            isPublishing={isPublishing}
          />

          <CampaignLibrary
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
