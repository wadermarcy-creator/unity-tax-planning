"use client";

import { useState } from "react";
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

export default function CampaignFactoryPage() {
  const [category, setCategory] = useState("Healthcare");
  const [location, setLocation] = useState("United States");
  const [count, setCount] = useState(12);
  const [selectedPackId, setSelectedPackId] = useState("healthcare");
  const [data, setData] = useState<FactoryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const selectedPack = MARKET_PACKS.find((pack) => pack.id === selectedPackId);

  function selectMarketPack(packId: string) {
    const pack = MARKET_PACKS.find((item) => item.id === packId);

    if (!pack) return;

    setSelectedPackId(pack.id);
    setCategory(pack.name);
    setCount(Math.min(pack.industries.length, 30));
    setData(null);
    setMessage(`${pack.name} market pack selected.`);
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
        setIsGenerating(false);
        return;
      }

      setData(result as FactoryResponse);
      setMessage("Campaign ideas generated.");
    } catch (error) {
      console.error(error);
      setMessage("Campaign Factory failed. Check the API route.");
    }

    setIsGenerating(false);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Campaign Factory"
        subtitle="Generate high-value campaign ideas from proven market packs."
      />

      <div className="px-6 py-8 lg:px-10">
        <section className="mb-8 rounded-[2rem] border border-violet-500/30 bg-violet-500/10 p-7 shadow-2xl shadow-violet-950/20">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-300">
            AI Campaign Factory
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Turn high-income markets into campaign pipelines.
          </h1>

          <p className="mt-4 max-w-4xl text-lg font-medium leading-8 text-slate-300">
            Choose a market pack based on high-income professions, then let
            Mission Control identify specific campaign ideas worth building,
            testing, and publishing.
          </p>
        </section>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Market Packs
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Start with a proven high-value market.
              </h2>
            </div>

            <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
              {MARKET_PACKS.length} packs
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {MARKET_PACKS.map((pack) => {
              const isSelected = selectedPackId === pack.id;

              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => selectMarketPack(pack.id)}
                  className={`rounded-[1.5rem] border p-5 text-left transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-950/20"
                      : "border-slate-800 bg-slate-900 hover:border-blue-500/50"
                  }`}
                >
                  <div className="text-3xl">{pack.icon}</div>

                  <h3 className="mt-4 text-xl font-black text-white">
                    {pack.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                    {pack.industries.length} campaign opportunities
                  </p>
                </button>
              );
            })}
          </div>

          {selectedPack && (
            <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Selected Pack
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">
                    {selectedPack.icon} {selectedPack.name}
                  </h3>
                </div>

                <p className="text-sm font-bold text-slate-400">
                  {selectedPack.industries.length} audiences available
                </p>
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

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
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
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
              No Ideas Yet
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Generate a batch of campaign ideas.
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
              Start with a market pack or enter a custom category. Once ideas
              are generated, you can open the Campaign Generator and build a
              full campaign for any specific audience.
            </p>
          </section>
        ) : (
          <section>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                  Generated Ideas
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {data.category} · {data.location}
                </h2>
              </div>

              <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
                {data.campaigns.length} ideas
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {data.campaigns.map((campaign) => (
                <article
                  key={campaign.slug}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black text-white">
                          {campaign.campaign_name}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                            campaign.priority === "High"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : campaign.priority === "Medium"
                                ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                                : "border-slate-700 bg-slate-900 text-slate-300"
                          }`}
                        >
                          {campaign.priority}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-blue-300">
                        Audience: {campaign.audience}
                      </p>

                      <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                        {campaign.reason}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Estimated Value
                      </p>
                      <p className="mt-2 text-sm font-black text-white">
                        {campaign.estimated_value}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Ad Angle
                      </p>
                      <p className="mt-2 text-sm font-black text-white">
                        {campaign.ad_angle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/mission-control/marketing/campaigns?audience=${encodeURIComponent(
                        campaign.audience,
                      )}&location=${encodeURIComponent(location)}`}
                      className="rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                    >
                      Build Campaign
                    </Link>

                    <Link
                      href={`/landing/${campaign.slug}`}
                      className="rounded-2xl border border-slate-700 px-5 py-4 text-center text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
                    >
                      Future URL
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}