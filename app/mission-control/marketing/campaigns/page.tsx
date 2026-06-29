"use client";

import { useEffect, useState } from "react";
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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [form, setForm] =
    useState<CampaignGeneratorForm>(emptyCampaignGeneratorForm);
  const [generatedCampaign, setGeneratedCampaign] =
    useState<GeneratedCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState("");

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
        notes: `Generated campaign for ${campaign.audience}.`,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Campaign could not be saved. The slug may already exist.");
      setIsSaving(false);
      return;
    }

    setMessage("Campaign draft saved.");
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
            notes: `Published campaign for ${campaign.audience}.`,
          },
        ],
        { onConflict: "slug" },
      );

    if (campaignError) {
      console.error(campaignError);
      setMessage("Campaign could not be published.");
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
      setIsPublishing(false);
      return;
    }

    setMessage(`Campaign published. Live page: /landing/${landingPage.slug}`);
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

      <div className="px-6 py-8 lg:px-10">
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

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
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