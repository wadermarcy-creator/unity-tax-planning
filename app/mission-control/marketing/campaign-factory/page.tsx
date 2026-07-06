"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/mission-control/Header";
import { MARKET_PACKS } from "@/lib/campaignFactory/marketPacks";

type CampaignIdea = {
  audience: string;
  campaign_name: string;
  slug: string;
  reason: string;
  estimated_value: string;
  ad_angle: string;
  priority: "High" | "Medium" | "Low";
};

type FactoryResponse = {
  category: string;
  location: string;
  campaigns: CampaignIdea[];
};

type Toast = {
  message: string;
  tone: "success" | "warning" | "error";
};

const priorityStyles: Record<CampaignIdea["priority"], string> = {
  High: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Medium: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  Low: "border-slate-600 bg-slate-900 text-slate-300",
};

const priorityScoreBase: Record<CampaignIdea["priority"], number> = {
  High: 94,
  Medium: 78,
  Low: 62,
};

const FACTORY_DRAFT_STORAGE_KEY = "unity-tax-campaign-factory-draft";

type CampaignFactoryDraft = {
  source: "campaign-factory";
  createdAt: string;
  category: string;
  location: string;
  audience: string;
  campaignName: string;
  slug: string;
  reason: string;
  estimatedValue: string;
  adAngle: string;
  priority: CampaignIdea["priority"];
  priorityScore: number;
};

function getPriorityScore(campaign: CampaignIdea, index = 0) {
  return Math.max(
    55,
    priorityScoreBase[campaign.priority] - Math.min(index * 2, 10),
  );
}

function getScoreBarWidth(score: number) {
  return `${Math.min(Math.max(score, 0), 100)}%`;
}

function getCampaignBrief(campaign: CampaignIdea, location: string) {
  return [
    `Campaign: ${campaign.campaign_name}`,
    `Audience: ${campaign.audience}`,
    `Location: ${location}`,
    `Priority: ${campaign.priority}`,
    `Projected Annual Revenue: ${campaign.estimated_value}`,
    `Ad Angle: ${campaign.ad_angle}`,
    `AI Reason: ${campaign.reason}`,
  ].join("\n");
}

function getCampaignBuilderHref(
  campaign: CampaignIdea,
  factoryLocation: string,
  category: string,
  priorityScore: number,
) {
  const params = new URLSearchParams({
    factoryDraft: "1",
    audience: campaign.audience,
    location: factoryLocation,
    category,
    campaignName: campaign.campaign_name,
    slug: campaign.slug,
    priority: campaign.priority,
    priorityScore: String(priorityScore),
  });

  return `/mission-control/marketing/campaigns?${params.toString()}`;
}

function storeCampaignFactoryDraft(
  campaign: CampaignIdea,
  factoryLocation: string,
  category: string,
  priorityScore: number,
) {
  const draft: CampaignFactoryDraft = {
    source: "campaign-factory",
    createdAt: new Date().toISOString(),
    category,
    location: factoryLocation,
    audience: campaign.audience,
    campaignName: campaign.campaign_name,
    slug: campaign.slug,
    reason: campaign.reason,
    estimatedValue: campaign.estimated_value,
    adAngle: campaign.ad_angle,
    priority: campaign.priority,
    priorityScore,
  };

  try {
    window.localStorage.setItem(
      FACTORY_DRAFT_STORAGE_KEY,
      JSON.stringify(draft),
    );
  } catch (error) {
    console.error("Could not store Campaign Factory draft.", error);
  }
}

export default function CampaignFactoryPage() {
  const [category, setCategory] = useState("Healthcare");
  const [location, setLocation] = useState("United States");
  const [count, setCount] = useState(12);
  const [selectedPackId, setSelectedPackId] = useState("healthcare");
  const [data, setData] = useState<FactoryResponse | null>(null);
  const [campaignQueue, setCampaignQueue] = useState<CampaignIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const selectedPack = MARKET_PACKS.find((pack) => pack.id === selectedPackId);

  const sortedCampaigns = useMemo(() => {
    if (!data) return [];

    return [...data.campaigns].sort(
      (a, b) => priorityScoreBase[b.priority] - priorityScoreBase[a.priority],
    );
  }, [data]);

  const executivePick = sortedCampaigns[0] || null;
  const executivePickScore = executivePick
    ? getPriorityScore(executivePick)
    : 0;
  const highPriorityCount = data
    ? data.campaigns.filter((campaign) => campaign.priority === "High").length
    : 0;

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(messageText: string, tone: Toast["tone"] = "success") {
    setToast({ message: messageText, tone });
  }

  function selectMarketPack(packId: string) {
    const pack = MARKET_PACKS.find((item) => item.id === packId);

    if (!pack) return;

    setSelectedPackId(pack.id);
    setCategory(pack.name);
    setCount(Math.min(pack.industries.length, 30));
    setData(null);
    setCampaignQueue([]);
    setMessage(`${pack.name} market pack selected.`);
    showToast(`${pack.name} market pack selected.`, "success");
  }

  async function generateIdeas() {
    setMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch(
        "/api/mission-control/generate-campaign-factory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category, location, count }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not generate campaign ideas.");
        showToast(
          result.error || "Could not generate campaign ideas.",
          "error",
        );
        setIsGenerating(false);
        return;
      }

      setData(result as FactoryResponse);
      setCampaignQueue([]);
      setMessage("Campaign ideas generated.");
      showToast("Campaign ideas generated.", "success");
    } catch (error) {
      console.error(error);
      setMessage("Campaign Factory failed. Check the API route.");
      showToast("Campaign Factory failed. Check the API route.", "error");
    }

    setIsGenerating(false);
  }

  function addToQueue(campaign: CampaignIdea) {
    setCampaignQueue((currentQueue) => {
      const isAlreadyQueued = currentQueue.some(
        (queueItem) => queueItem.slug === campaign.slug,
      );

      if (isAlreadyQueued) return currentQueue;

      return [...currentQueue, campaign];
    });

    showToast(`${campaign.campaign_name} added to Campaign Queue.`, "success");
  }

  function removeFromQueue(slug: string) {
    setCampaignQueue((currentQueue) =>
      currentQueue.filter((campaign) => campaign.slug !== slug),
    );
    showToast("Campaign removed from queue.", "warning");
  }

  async function copyCampaignBrief(campaign: CampaignIdea) {
    try {
      await navigator.clipboard.writeText(
        getCampaignBrief(campaign, data?.location || location),
      );
      showToast("Campaign brief copied.", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not copy campaign brief.", "error");
    }
  }

  async function copyQueueBrief() {
    if (!campaignQueue.length) {
      showToast("Add at least one campaign to the queue first.", "warning");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        campaignQueue
          .map((campaign, index) =>
            [
              `Queue Position: ${index + 1}`,
              getCampaignBrief(campaign, data?.location || location),
            ].join("\n"),
          )
          .join("\n\n---\n\n"),
      );
      showToast("Campaign Queue copied.", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not copy Campaign Queue.", "error");
    }
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Campaign Factory"
        subtitle="Generate high-value campaign ideas from proven market packs."
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
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-violet-400/20 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.28),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-5 shadow-2xl shadow-violet-950/20 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200 sm:text-sm">
                AI Campaign Factory
              </p>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                Turn high-income markets into a launch-ready campaign pipeline.
              </h1>

              <p className="mt-4 max-w-4xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
                Pick a market pack, generate specific campaign opportunities,
                queue the highest-priority ideas, and send the best one into the
                campaign builder without slowing down.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Packs
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {MARKET_PACKS.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Ideas
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {data?.campaigns.length || 0}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Queue
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {campaignQueue.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-950/75 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300 sm:text-sm">
                Market Packs
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Start with a proven high-value market.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
                {MARKET_PACKS.length} packs
              </span>
              <span className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
                {selectedPack?.industries.length || 0} audiences
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {MARKET_PACKS.map((pack) => {
              const isSelected = selectedPackId === pack.id;

              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => selectMarketPack(pack.id)}
                  className={`group rounded-[1.5rem] border p-5 text-left transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-950/20"
                      : "border-slate-800 bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-3xl">{pack.icon}</div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                        isSelected
                          ? "border-blue-400/40 bg-blue-400/10 text-blue-200"
                          : "border-slate-700 bg-slate-950 text-slate-400 group-hover:border-blue-500/50 group-hover:text-blue-200"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-white">
                    {pack.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                    {pack.industries.length} campaign opportunities ready for
                    targeting.
                  </p>
                </button>
              );
            })}
          </div>

          {selectedPack && (
            <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Selected Pack
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">
                    {selectedPack.icon} {selectedPack.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={generateIdeas}
                  disabled={isGenerating}
                  className="rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-400"
                >
                  {isGenerating ? "Generating..." : "One-Click Generate"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedPack.industries.map((industry) => (
                  <span
                    key={industry}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-300"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-950/75 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div className="mb-5 flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300 sm:text-sm">
              Build Settings
            </p>
            <h2 className="text-2xl font-black text-white">
              Generate the next batch.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_160px_auto] lg:items-end">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Category
              </label>

              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                placeholder="Healthcare"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Location
              </label>

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                placeholder="United States"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Count
              </label>

              <input
                type="number"
                min={3}
                max={30}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <button
              type="button"
              onClick={generateIdeas}
              disabled={isGenerating}
              className="rounded-2xl bg-violet-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isGenerating ? "Generating..." : "Generate Ideas"}
            </button>
          </div>

          {message && (
            <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {message}
            </p>
          )}
        </section>

        {!data ? (
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-6 shadow-xl shadow-black/20 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500 sm:text-sm">
                  No Ideas Yet
                </p>

                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  Generate a launch-ready batch of campaign ideas.
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                  Start with a market pack or enter a custom category. Once
                  ideas are generated, Mission Control will surface an AI
                  Executive Recommendation, score priorities, and let you queue
                  campaigns for execution.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/70 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                  Launch Workflow
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Choose a market pack",
                    "Generate ideas",
                    "Review AI recommendation",
                    "Queue campaigns",
                    "Build the first campaign",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-black text-violet-200">
                        {index + 1}
                      </span>
                      <span className="text-sm font-black text-slate-200">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            {executivePick && (
              <div className="rounded-[2rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_34%),rgba(2,6,23,0.88)] p-5 shadow-xl shadow-emerald-950/10 sm:p-6">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-4xl">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200 sm:text-sm">
                      AI Executive Recommendation
                    </p>

                    <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                      Launch {executivePick.campaign_name} first.
                    </h2>

                    <p className="mt-4 text-sm font-medium leading-7 text-slate-300 sm:text-base">
                      This campaign has the strongest combination of priority,
                      revenue potential, and a clear ad angle. Build this first,
                      publish the landing page, and use the remaining ideas as
                      the next testing queue.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Priority Score
                      </p>
                      <p className="mt-2 text-3xl font-black text-white">
                        {executivePickScore}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Projected Annual Revenue
                      </p>
                      <p className="mt-2 text-lg font-black text-white">
                        {executivePick.estimated_value}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        High Priority
                      </p>
                      <p className="mt-2 text-3xl font-black text-white">
                        {highPriorityCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={getCampaignBuilderHref(
                      executivePick,
                      data.location,
                      data.category,
                      executivePickScore,
                    )}
                    onClick={() =>
                      storeCampaignFactoryDraft(
                        executivePick,
                        data.location,
                        data.category,
                        executivePickScore,
                      )
                    }
                    className="rounded-2xl bg-emerald-500 px-5 py-4 text-center text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400"
                  >
                    Build Recommended Campaign
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToQueue(executivePick)}
                    className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-black text-emerald-100 transition hover:bg-emerald-500/20"
                  >
                    Add Recommendation to Queue
                  </button>

                  <button
                    type="button"
                    onClick={() => copyCampaignBrief(executivePick)}
                    className="rounded-2xl border border-slate-700 px-5 py-4 text-sm font-black text-slate-300 transition hover:border-emerald-400/50 hover:text-white"
                  >
                    Copy Executive Brief
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300 sm:text-sm">
                  Generated Ideas
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {data.category} · {data.location}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
                  {data.campaigns.length} ideas
                </span>
                <span className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
                  {campaignQueue.length} queued
                </span>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="grid gap-5 2xl:grid-cols-2">
                {data.campaigns.map((campaign, index) => {
                  const priorityScore = getPriorityScore(campaign, index);
                  const isQueued = campaignQueue.some(
                    (queueItem) => queueItem.slug === campaign.slug,
                  );

                  return (
                    <article
                      key={`${campaign.slug}-${index}`}
                      className="group rounded-[2rem] border border-slate-800 bg-slate-950/75 p-5 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-blue-500/40 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${priorityStyles[campaign.priority]}`}
                            >
                              {campaign.priority} Priority
                            </span>
                            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                              Score {priorityScore}
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-black leading-tight text-white">
                            {campaign.campaign_name}
                          </h3>

                          <p className="mt-3 text-sm font-bold text-blue-300">
                            Audience: {campaign.audience}
                          </p>

                          <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                            {campaign.reason}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Priority Score
                          </p>
                          <p className="text-sm font-black text-white">
                            {priorityScore}/100
                          </p>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: getScoreBarWidth(priorityScore) }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Projected Annual Revenue
                          </p>
                          <p className="mt-2 text-sm font-black text-white">
                            {campaign.estimated_value}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Ad Angle
                          </p>
                          <p className="mt-2 text-sm font-black leading-6 text-white">
                            {campaign.ad_angle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <Link
                          href={getCampaignBuilderHref(
                            campaign,
                            data.location,
                            data.category,
                            priorityScore,
                          )}
                          onClick={() =>
                            storeCampaignFactoryDraft(
                              campaign,
                              data.location,
                              data.category,
                              priorityScore,
                            )
                          }
                          className="rounded-2xl bg-blue-600 px-4 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                        >
                          Build
                        </Link>

                        <button
                          type="button"
                          onClick={() => addToQueue(campaign)}
                          disabled={isQueued}
                          className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm font-black text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
                        >
                          {isQueued ? "Queued" : "Queue"}
                        </button>

                        <button
                          type="button"
                          onClick={() => copyCampaignBrief(campaign)}
                          className="rounded-2xl border border-slate-700 px-4 py-4 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
                        >
                          Copy
                        </button>

                        <Link
                          href={`/landing/${campaign.slug}`}
                          className="rounded-2xl border border-slate-700 px-4 py-4 text-center text-sm font-black text-slate-300 transition hover:border-violet-500 hover:text-white"
                        >
                          URL
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-black/20 xl:sticky xl:top-6 xl:self-start sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
                      Campaign Queue
                    </p>
                    <h3 className="mt-3 text-2xl font-black text-white">
                      Launch order
                    </h3>
                  </div>
                  <span className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-black text-slate-300">
                    {campaignQueue.length}
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                  Queue the campaigns you want to build next. Copy the queue as
                  a launch brief or jump directly into the first campaign.
                </p>

                <div className="mt-5 space-y-3">
                  {campaignQueue.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-5 text-center">
                      <p className="text-sm font-black text-slate-300">
                        No campaigns queued yet.
                      </p>
                      <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                        Add the executive recommendation or queue campaigns from
                        the cards.
                      </p>
                    </div>
                  ) : (
                    campaignQueue.map((campaign, index) => (
                      <div
                        key={`${campaign.slug}-queue`}
                        className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                              #{index + 1} · {campaign.priority}
                            </p>
                            <h4 className="mt-2 text-sm font-black leading-6 text-white">
                              {campaign.campaign_name}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromQueue(campaign.slug)}
                            className="rounded-full border border-slate-700 px-3 py-1 text-xs font-black text-slate-400 transition hover:border-rose-400/50 hover:text-rose-200"
                          >
                            Remove
                          </button>
                        </div>

                        <p className="mt-3 text-xs font-bold leading-5 text-blue-300">
                          {campaign.audience}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 grid gap-3">
                  {campaignQueue[0] && (
                    <Link
                      href={getCampaignBuilderHref(
                        campaignQueue[0],
                        data.location,
                        data.category,
                        getPriorityScore(campaignQueue[0]),
                      )}
                      onClick={() =>
                        storeCampaignFactoryDraft(
                          campaignQueue[0],
                          data.location,
                          data.category,
                          getPriorityScore(campaignQueue[0]),
                        )
                      }
                      className="rounded-2xl bg-violet-600 px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
                    >
                      Build First Queued Campaign
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={copyQueueBrief}
                    className="rounded-2xl border border-slate-700 px-5 py-4 text-sm font-black text-slate-300 transition hover:border-violet-500 hover:text-white"
                  >
                    Copy Queue Brief
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCampaignQueue([]);
                      showToast("Campaign Queue cleared.", "warning");
                    }}
                    disabled={!campaignQueue.length}
                    className="rounded-2xl border border-slate-800 px-5 py-4 text-sm font-black text-slate-500 transition hover:border-rose-400/50 hover:text-rose-200 disabled:cursor-not-allowed disabled:hover:border-slate-800 disabled:hover:text-slate-500"
                  >
                    Clear Queue
                  </button>
                </div>
              </aside>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
