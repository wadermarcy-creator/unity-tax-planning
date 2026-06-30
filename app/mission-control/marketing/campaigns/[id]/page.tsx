"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Bolt,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  Megaphone,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import type {
  CampaignLandingPage,
  MarketingCampaign,
} from "@/components/mission-control/campaigns/types";
import { getPublicLandingPagePath } from "@/components/mission-control/campaigns/helpers";
import { supabase } from "@/lib/supabase";

function hasAsset(value: unknown) {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToText(value: string[] | undefined) {
  return (value || []).join("\n");
}

function getAssetScore(campaign: MarketingCampaign) {
  const assets = [
    campaign.landing_page_json,
    campaign.google_ads_json,
    campaign.seo_json,
    campaign.keywords_json,
    campaign.blog_json,
    campaign.email_json,
    campaign.facebook_json,
    campaign.linkedin_json,
    campaign.case_study_json,
    campaign.faq_json,
    campaign.youtube_json,
    campaign.lead_magnet_json,
    campaign.tracking_json,
  ];

  const completed = assets.filter(hasAsset).length;

  return {
    completed,
    total: assets.length,
    percent: Math.round((completed / assets.length) * 100),
  };
}

function StatusBadge({ status }: { status: string | null }) {
  const published = status === "published";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
        published
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-blue-500/30 bg-blue-500/10 text-blue-300"
      }`}
    >
      {status || "draft"}
    </span>
  );
}

function PanelCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
        {title}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

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

function SetupItem({
  icon,
  label,
  detail,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
          {icon}
        </div>

        <div>
          <p className="font-black text-white">{label}</p>
          <p className="text-xs font-bold text-slate-500">{detail}</p>
        </div>
      </div>

      {active ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      ) : (
        <Circle className="h-5 w-5 text-slate-600" />
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm font-bold text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-black text-emerald-300">{trend}</p>
    </div>
  );
}

function MiniRow({
  icon,
  title,
  detail,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-blue-300">
          {icon}
        </div>

        <div>
          <p className="font-black text-white">{title}</p>
          <p className="text-sm text-slate-500">{detail}</p>
        </div>
      </div>

      {value && <p className="font-black text-emerald-300">{value}</p>}
    </div>
  );
}

export default function CampaignWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");

  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  const [landingForm, setLandingForm] = useState({
    eyebrow: "",
    headline: "",
    subheadline: "",
    primary_cta: "",
    audience: "",
    pain_points: "",
    opportunities: "",
    proof_points: "",
  });

  const [isSavingLandingPage, setIsSavingLandingPage] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function loadCampaign() {
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setIsLoading(false);
      return;
    }

    const loadedCampaign = data as MarketingCampaign;
    setCampaign(loadedCampaign);

    const landingPage = loadedCampaign.landing_page_json;

    if (landingPage) {
      setLandingForm({
        eyebrow: landingPage.eyebrow || "",
        headline: landingPage.headline || "",
        subheadline: landingPage.subheadline || "",
        primary_cta: landingPage.primary_cta || "",
        audience: landingPage.audience || loadedCampaign.audience || "",
        pain_points: listToText(landingPage.pain_points),
        opportunities: listToText(landingPage.opportunities),
        proof_points: listToText(landingPage.proof_points),
      });
    }

    setIsLoading(false);
  }

  async function saveLandingPage() {
    if (!campaign || !campaign.landing_page_json) return;

    setSaveMessage("");
    setIsSavingLandingPage(true);

    const updatedLandingPage: CampaignLandingPage = {
      ...campaign.landing_page_json,
      eyebrow: landingForm.eyebrow,
      headline: landingForm.headline,
      subheadline: landingForm.subheadline,
      primary_cta: landingForm.primary_cta,
      audience: landingForm.audience,
      pain_points: textToList(landingForm.pain_points),
      opportunities: textToList(landingForm.opportunities),
      proof_points: textToList(landingForm.proof_points),
    };

    const { error: campaignError } = await supabase
      .from("marketing_campaigns")
      .update({
        landing_page_json: updatedLandingPage,
      })
      .eq("id", campaign.id);

    if (campaignError) {
      console.error(campaignError);
      setSaveMessage("Landing page could not be saved.");
      setIsSavingLandingPage(false);
      return;
    }

    const { error: landingPageError } = await supabase
      .from("marketing_landing_pages")
      .upsert(
        [
          {
            slug: updatedLandingPage.slug,
            eyebrow: updatedLandingPage.eyebrow,
            headline: updatedLandingPage.headline,
            subheadline: updatedLandingPage.subheadline,
            primary_cta: updatedLandingPage.primary_cta,
            audience: updatedLandingPage.audience,
            pain_points: updatedLandingPage.pain_points,
            opportunities: updatedLandingPage.opportunities,
            proof_points: updatedLandingPage.proof_points,
            is_active: true,
          },
        ],
        { onConflict: "slug" },
      );

    if (landingPageError) {
      console.error(landingPageError);
      setSaveMessage("Saved to campaign, but public landing page was not updated.");
      setIsSavingLandingPage(false);
      return;
    }

    setCampaign({
      ...campaign,
      landing_page_json: updatedLandingPage,
    });

    setSaveMessage("Landing page saved and republished.");
    setIsSavingLandingPage(false);
  }

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const score = useMemo(() => {
    if (!campaign) return { completed: 0, total: 13, percent: 0 };
    return getAssetScore(campaign);
  }, [campaign]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Campaign Workspace" subtitle="Loading campaign..." />
        <div className="p-10 text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen">
        <Header title="Campaign Not Found" subtitle="This campaign does not exist." />

        <div className="p-10">
          <button
            type="button"
            onClick={() => router.push("/mission-control/marketing/campaigns")}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const landingPath = getPublicLandingPagePath(campaign);

  const tabs = [
    "Overview",
    "Landing Page",
    "Google Ads",
    "SEO",
    "Keywords",
    "Email",
    "Blog",
    "Social",
    "Analytics",
    "AI Insights",
    "Settings",
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Campaign Workspace"
        subtitle="Manage every campaign asset from one place."
      />

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-white">
                {campaign.name}
              </h1>

              <StatusBadge status={campaign.status} />
            </div>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              {campaign.landing_page_json?.headline ||
                "Campaign workspace for this marketing campaign."}
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-slate-500">
              <span>Created campaign</span>
              <span>•</span>
              <span>Audience: {campaign.audience || "Not specified"}</span>
              <span>•</span>
              <span>ID: {campaign.id.slice(0, 8)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={landingPath}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm font-black text-white hover:border-blue-500"
            >
              Preview Landing Page <ExternalLink className="h-4 w-4" />
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
            >
              <Bolt className="h-4 w-4" /> Quick Actions
            </button>
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
          <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr_1fr]">
            <div className="flex flex-col items-center justify-center border-slate-800 xl:border-r">
              <p className="mb-6 self-start text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Campaign Health
              </p>

              <div className="flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-emerald-500 bg-slate-900 shadow-xl shadow-emerald-950/20">
                <div className="text-center">
                  <p className="text-5xl font-black text-white">{score.percent}</p>
                  <p className="text-sm font-bold text-slate-400">/100</p>
                </div>
              </div>

              <p className="mt-6 text-lg font-black text-emerald-300">
                {score.percent >= 90
                  ? "Excellent"
                  : score.percent >= 70
                    ? "Strong"
                    : "Needs Work"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {score.completed} of {score.total} campaign assets complete
              </p>
            </div>

            <div className="border-slate-800 xl:border-r xl:pr-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                  Setup Progress
                </p>

                <p className="text-sm font-black text-slate-400">
                  {score.percent}% Complete
                </p>
              </div>

              <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${score.percent}%` }}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <SetupItem
                  icon={<Globe className="h-5 w-5" />}
                  label="Landing Page"
                  detail={campaign.status === "published" ? "Published" : "Draft"}
                  active={hasAsset(campaign.landing_page_json)}
                />
                <SetupItem
                  icon={<Megaphone className="h-5 w-5" />}
                  label="Google Ads"
                  detail="Generated"
                  active={hasAsset(campaign.google_ads_json)}
                />
                <SetupItem
                  icon={<Search className="h-5 w-5" />}
                  label="SEO"
                  detail="Optimized"
                  active={hasAsset(campaign.seo_json)}
                />
                <SetupItem
                  icon={<Target className="h-5 w-5" />}
                  label="Keywords"
                  detail={`${campaign.keywords_json?.primary_keywords?.length || 0} primary`}
                  active={hasAsset(campaign.keywords_json)}
                />
                <SetupItem
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  detail={`${campaign.email_json?.length || 0} emails`}
                  active={hasAsset(campaign.email_json)}
                />
                <SetupItem
                  icon={<FileText className="h-5 w-5" />}
                  label="Blog"
                  detail={campaign.blog_json?.title || "Generated"}
                  active={hasAsset(campaign.blog_json)}
                />
              </div>
            </div>

            <div>
              <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Campaign Performance
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard label="Visitors" value="—" trend="Waiting for GA4" />
                <MetricCard label="Assessments" value="—" trend="Connect attribution" />
                <MetricCard label="Consultations" value="—" trend="Calendly later" />
                <MetricCard label="Conversion Rate" value="—" trend="Pending traffic" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 overflow-x-auto rounded-[2rem] border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "Overview" && (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr_0.95fr]">
            <PanelCard title="Campaign Overview">
              <p className="text-sm leading-7 text-slate-400">
                Your campaign is live and organized. Continue optimizing assets,
                tracking assessments, and expanding related campaigns.
              </p>

              <div className="mt-6 space-y-1">
                <MiniRow
                  icon={<Target className="h-5 w-5" />}
                  title="Target Audience"
                  detail={campaign.audience || "Not specified"}
                />
                <MiniRow
                  icon={<Target className="h-5 w-5" />}
                  title="Primary Offer"
                  detail={
                    campaign.landing_page_json?.primary_cta ||
                    "Tax Opportunity Assessment"
                  }
                />
                <MiniRow
                  icon={<Globe className="h-5 w-5" />}
                  title="Geography"
                  detail={campaign.location || "United States"}
                />
                <MiniRow
                  icon={<TrendingUp className="h-5 w-5" />}
                  title="Campaign Goal"
                  detail="Generate qualified tax planning assessments"
                />
              </div>
            </PanelCard>

            <PanelCard title="AI Recommendations">
              <div className="space-y-4">
                <MiniRow
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Publish related campaigns"
                  detail="Build adjacent niche campaigns from the same market pack."
                  value="High"
                />
                <MiniRow
                  icon={<Target className="h-5 w-5" />}
                  title="Add campaign attribution"
                  detail="Track which landing page generated each assessment."
                  value="Next"
                />
                <MiniRow
                  icon={<Search className="h-5 w-5" />}
                  title="Connect GA4"
                  detail="Measure traffic and conversion before ad spend."
                  value="Launch"
                />
              </div>
            </PanelCard>

            <PanelCard title="Market Opportunity">
              <div className="flex items-center justify-center">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-emerald-500 bg-slate-900">
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">92</p>
                    <p className="text-sm text-slate-400">/100</p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center font-black text-emerald-300">
                High Opportunity
              </p>
            </PanelCard>
          </div>
        )}

        {activeTab === "Landing Page" && (
          <PanelCard title="Landing Page Editor">
            <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
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
                    onClick={saveLandingPage}
                    disabled={isSavingLandingPage}
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
              </div>
            </div>
          </PanelCard>
        )}

        {activeTab === "Google Ads" && (
          <PanelCard title="Google Ads">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Headlines
                </p>
                <div className="mt-4 space-y-3">
                  {(campaign.google_ads_json?.headlines || []).map((headline) => (
                    <p key={headline} className="rounded-xl bg-slate-950 p-3 text-white">
                      {headline}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Descriptions
                </p>
                <div className="mt-4 space-y-3">
                  {(campaign.google_ads_json?.descriptions || []).map((description) => (
                    <p key={description} className="rounded-xl bg-slate-950 p-3 text-white">
                      {description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </PanelCard>
        )}

        {activeTab === "SEO" && (
          <PanelCard title="SEO">
            <div className="grid gap-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  SEO Title
                </p>
                <p className="mt-2 text-white">{campaign.seo_json?.title || "Not set"}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Meta Description
                </p>
                <p className="mt-2 text-slate-300">
                  {campaign.seo_json?.meta_description || "Not set"}
                </p>
              </div>
            </div>
          </PanelCard>
        )}

        {activeTab === "Keywords" && (
          <PanelCard title="Keywords">
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="font-black text-white">Primary</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(campaign.keywords_json?.primary_keywords || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="font-black text-white">Secondary</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(campaign.keywords_json?.secondary_keywords || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-slate-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="font-black text-white">Negative</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(campaign.keywords_json?.negative_keywords || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-bold text-red-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PanelCard>
        )}

        {activeTab === "Email" && (
          <PanelCard title="Email Sequence">
            <div className="space-y-4">
              {(campaign.email_json || []).map((email, index) => (
                <div
                  key={`${email.subject}-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Email {index + 1}
                  </p>
                  <p className="mt-2 text-xl font-black text-white">{email.subject}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    {email.body}
                  </p>
                </div>
              ))}
            </div>
          </PanelCard>
        )}

        {activeTab === "Blog" && (
          <PanelCard title="Blog">
            <h2 className="text-2xl font-black text-white">
              {campaign.blog_json?.title || "No blog title generated"}
            </h2>

            <div className="mt-5 space-y-3">
              {(campaign.blog_json?.outline || []).map((item) => (
                <p
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-300"
                >
                  {item}
                </p>
              ))}
            </div>
          </PanelCard>
        )}

        {activeTab === "Social" && (
          <PanelCard title="Social">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="font-black text-white">Facebook Ad</p>
                <p className="mt-3 text-slate-300">
                  {campaign.facebook_json?.primary_text || "No Facebook ad generated."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="font-black text-white">LinkedIn Post</p>
                <p className="mt-3 text-slate-300">
                  {campaign.linkedin_json?.post || "No LinkedIn post generated."}
                </p>
              </div>
            </div>
          </PanelCard>
        )}

        {activeTab === "Analytics" && (
          <PanelCard title="Analytics">
            <p className="text-slate-400">
              Analytics will connect here after GA4, Google Ads, and campaign attribution are active.
            </p>
          </PanelCard>
        )}

        {activeTab === "AI Insights" && (
          <PanelCard title="AI Insights">
            <div className="space-y-4">
              <MiniRow
                icon={<Sparkles className="h-5 w-5" />}
                title="Improve campaign specificity"
                detail="Add more profession-specific language to the hero section and FAQ."
                value="Conversion"
              />
              <MiniRow
                icon={<Search className="h-5 w-5" />}
                title="Generate related campaign cluster"
                detail="Build adjacent campaigns from the same profession family."
                value="SEO"
              />
              <MiniRow
                icon={<Target className="h-5 w-5" />}
                title="Add tracking before ads"
                detail="Do not scale paid spend until attribution and conversion tracking are active."
                value="Critical"
              />
            </div>
          </PanelCard>
        )}

        {activeTab === "Settings" && (
          <PanelCard title="Settings">
            <p className="text-slate-400">
              Campaign settings, publishing controls, and archive options will live here.
            </p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}