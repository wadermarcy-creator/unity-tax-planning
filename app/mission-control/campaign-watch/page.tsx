"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Header from "@/components/mission-control/Header";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clipboard,
  Download,
  ExternalLink,
  Megaphone,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";

type WatchEntry = {
  id: string;
  date: string;
  campaignName: string;
  spend: number;
  clicks: number;
  assessments: number;
  impressions: number;
  searchTermsToBlock: string;
  notes: string;
  actionNeeded: string;
  createdAt: string;
};

type Toast = {
  type: "success" | "error";
  message: string;
};

type FormState = {
  date: string;
  campaignName: string;
  spend: string;
  clicks: string;
  assessments: string;
  impressions: string;
  searchTermsToBlock: string;
  notes: string;
  actionNeeded: string;
};

const STORAGE_KEY = "unity-tax-campaign-watch-v1";
const DEFAULT_CAMPAIGN = "Search - Tax Planning - Georgia";

const defaultNegativeKeywords = [
  "free",
  "refund",
  "irs",
  "tax return",
  "tax prep",
  "bookkeeping",
  "payroll",
  "h&r block",
  "turbotax",
  "job",
  "salary",
  "course",
  "certification",
  "software",
  "calculator",
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function createInitialForm(): FormState {
  return {
    date: getToday(),
    campaignName: DEFAULT_CAMPAIGN,
    spend: "15.00",
    clicks: "0",
    assessments: "0",
    impressions: "0",
    searchTermsToBlock: "",
    notes: "",
    actionNeeded: "Review search terms and add negatives if spend appears off-target.",
  };
}

function parseNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatWholeMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getCostPerAssessment(spend: number, assessments: number) {
  if (assessments <= 0) return null;
  return spend / assessments;
}

function getClickThroughRate(clicks: number, impressions: number) {
  if (impressions <= 0) return null;
  return (clicks / impressions) * 100;
}

function getCostPerClick(spend: number, clicks: number) {
  if (clicks <= 0) return null;
  return spend / clicks;
}

function getLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function csvEscape(value: string | number | null | undefined) {
  const safeValue = String(value ?? "").replace(/"/g, '""');
  return `"${safeValue}"`;
}

function downloadCsv(filename: string, rows: WatchEntry[]) {
  const headers = [
    "Date",
    "Campaign",
    "Spend",
    "Clicks",
    "Impressions",
    "Assessments",
    "Cost Per Assessment",
    "Cost Per Click",
    "CTR",
    "Search Terms To Block",
    "Action Needed",
    "Notes",
  ];

  const csvRows = rows.map((entry) => {
    const cpa = getCostPerAssessment(entry.spend, entry.assessments);
    const cpc = getCostPerClick(entry.spend, entry.clicks);
    const ctr = getClickThroughRate(entry.clicks, entry.impressions);

    return [
      entry.date,
      entry.campaignName,
      entry.spend,
      entry.clicks,
      entry.impressions,
      entry.assessments,
      cpa === null ? "" : cpa.toFixed(2),
      cpc === null ? "" : cpc.toFixed(2),
      ctr === null ? "" : `${ctr.toFixed(2)}%`,
      entry.searchTermsToBlock,
      entry.actionNeeded,
      entry.notes,
    ];
  });

  const csv = [headers, ...csvRows]
    .map((row) => row.map((value) => csvEscape(value)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getEntryHealth(entry: WatchEntry) {
  const cpa = getCostPerAssessment(entry.spend, entry.assessments);

  if (entry.assessments > 0 && cpa !== null && cpa <= 75) {
    return {
      label: "Healthy",
      tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (entry.spend >= 50 && entry.assessments === 0) {
    return {
      label: "Watch Spend",
      tone: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    };
  }

  if (getLines(entry.searchTermsToBlock).length > 0) {
    return {
      label: "Needs Negatives",
      tone: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    };
  }

  return {
    label: "Learning",
    tone: "border-slate-700 bg-slate-900 text-slate-300",
  };
}

export default function CampaignWatchPage() {
  const [entries, setEntries] = useState<WatchEntry[]>([]);
  const [form, setForm] = useState<FormState>(createInitialForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as WatchEntry[];
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hasHydrated]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

    if (!normalizedSearch) return sortedEntries;

    return sortedEntries.filter((entry) => {
      const haystack = [
        entry.date,
        entry.campaignName,
        entry.searchTermsToBlock,
        entry.notes,
        entry.actionNeeded,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [entries, searchTerm]);

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => {
        acc.spend += entry.spend;
        acc.clicks += entry.clicks;
        acc.assessments += entry.assessments;
        acc.impressions += entry.impressions;
        acc.termsToBlock += getLines(entry.searchTermsToBlock).length;
        return acc;
      },
      {
        spend: 0,
        clicks: 0,
        assessments: 0,
        impressions: 0,
        termsToBlock: 0,
      },
    );
  }, [filteredEntries]);

  const costPerAssessment = getCostPerAssessment(totals.spend, totals.assessments);
  const costPerClick = getCostPerClick(totals.spend, totals.clicks);
  const clickThroughRate = getClickThroughRate(totals.clicks, totals.impressions);

  const combinedNegativeKeywords = useMemo(() => {
    const customTerms = entries.flatMap((entry) => getLines(entry.searchTermsToBlock));
    const uniqueTerms = Array.from(
      new Set([...defaultNegativeKeywords, ...customTerms].map((term) => term.toLowerCase())),
    );

    return uniqueTerms.sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const latestEntry = filteredEntries[0] || null;

  function updateForm(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addEntry() {
    const campaignName = form.campaignName.trim() || DEFAULT_CAMPAIGN;
    const date = form.date || getToday();

    const newEntry: WatchEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date,
      campaignName,
      spend: parseNumber(form.spend),
      clicks: Math.round(parseNumber(form.clicks)),
      assessments: Math.round(parseNumber(form.assessments)),
      impressions: Math.round(parseNumber(form.impressions)),
      searchTermsToBlock: form.searchTermsToBlock.trim(),
      notes: form.notes.trim(),
      actionNeeded: form.actionNeeded.trim(),
      createdAt: new Date().toISOString(),
    };

    setEntries((current) => [newEntry, ...current]);
    setForm((current) => ({
      ...createInitialForm(),
      campaignName: current.campaignName,
      date: getToday(),
    }));
    showToast("Campaign watch entry saved.");
  }

  function deleteEntry(entryId: string) {
    setEntries((current) => current.filter((entry) => entry.id !== entryId));
    showToast("Campaign watch entry removed.");
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch (error) {
      console.error(error);
      showToast("Copy failed. Try again from your browser.", "error");
    }
  }

  function copyDailyBrief() {
    const brief = [
      "Unity Tax Google Ads Daily Brief",
      `Campaign: ${latestEntry?.campaignName || DEFAULT_CAMPAIGN}`,
      `Tracked entries: ${filteredEntries.length}`,
      `Spend: ${formatMoney(totals.spend)}`,
      `Clicks: ${totals.clicks}`,
      `Impressions: ${totals.impressions}`,
      `Assessments: ${totals.assessments}`,
      `Cost per assessment: ${costPerAssessment === null ? "No assessments yet" : formatMoney(costPerAssessment)}`,
      `Cost per click: ${costPerClick === null ? "No clicks yet" : formatMoney(costPerClick)}`,
      `CTR: ${clickThroughRate === null ? "No impressions yet" : `${clickThroughRate.toFixed(2)}%`}`,
      `Search terms to block: ${combinedNegativeKeywords.join(", ")}`,
      latestEntry?.actionNeeded ? `Latest action needed: ${latestEntry.actionNeeded}` : "Latest action needed: Review campaign once data is available.",
    ].join("\n");

    copyText(brief, "Google Ads daily brief copied.");
  }

  function exportEntries() {
    if (!filteredEntries.length) {
      showToast("No campaign watch entries to export.", "error");
      return;
    }

    downloadCsv("unity-tax-campaign-watch.csv", filteredEntries);
    showToast("Campaign watch CSV exported.");
  }

  function seedLaunchEntry() {
    const hasToday = entries.some((entry) => entry.date === getToday());

    if (hasToday) {
      showToast("Today already has a campaign watch entry.", "error");
      return;
    }

    const launchEntry: WatchEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: getToday(),
      campaignName: DEFAULT_CAMPAIGN,
      spend: 0,
      clicks: 0,
      assessments: 0,
      impressions: 0,
      searchTermsToBlock: defaultNegativeKeywords.join("\n"),
      notes: "Launch day baseline. Campaign published with $15/day budget, Georgia location, phrase-match keywords, and website assessment conversion tracking.",
      actionNeeded: "Check approval status, first impressions, first clicks, and search terms tomorrow.",
      createdAt: new Date().toISOString(),
    };

    setEntries((current) => [launchEntry, ...current]);
    showToast("Launch baseline entry added.");
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Campaign Watch"
        subtitle="Track Google Ads spend, clicks, assessments, search terms, and daily action items."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {toast && (
          <div
            className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border p-4 text-sm font-bold shadow-2xl shadow-black/30 ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
                : "border-rose-500/40 bg-rose-500/15 text-rose-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="mb-6 overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-slate-950 to-slate-950 p-5 shadow-2xl shadow-emerald-950/20 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Paid Traffic Command Center
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Watch every ad dollar until the campaign proves itself.
              </h1>

              <p className="mt-4 max-w-4xl text-sm font-bold leading-7 text-slate-300 sm:text-base">
                Use this page once per day while Google Ads ramps up. Enter spend, clicks,
                assessments, and bad search terms so Mission Control can show whether the campaign is
                creating real conversations or just noise.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyDailyBrief}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy Daily Brief
                </button>

                <button
                  type="button"
                  onClick={exportEntries}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Export Watch Log
                </button>

                <a
                  href="https://ads.google.com/aw/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Google Ads
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="Tracked Spend"
                value={formatWholeMoney(totals.spend)}
                description="Spend entered into Campaign Watch."
                icon={Megaphone}
              />
              <MetricCard
                label="Clicks"
                value={String(totals.clicks)}
                description={costPerClick === null ? "Waiting for clicks." : `${formatMoney(costPerClick)} CPC`}
                icon={TrendingUp}
              />
              <MetricCard
                label="Assessments"
                value={String(totals.assessments)}
                description={
                  costPerAssessment === null
                    ? "No assessment CPA yet."
                    : `${formatMoney(costPerAssessment)} per assessment`
                }
                icon={CheckCircle2}
              />
              <MetricCard
                label="Negative Terms"
                value={String(combinedNegativeKeywords.length)}
                description="Default plus campaign-discovered terms."
                icon={AlertCircle}
              />
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                  Daily Entry
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">Add today's campaign numbers</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-400">
                  Pull these numbers from Google Ads once per day. Assessments should match Mission Control submissions.
                </p>
              </div>

              <button
                type="button"
                onClick={seedLaunchEntry}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-500/20"
              >
                <RefreshCcw className="h-4 w-4" />
                Add Launch Baseline
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Field label="Date">
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateForm("date", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </Field>

              <Field label="Campaign">
                <input
                  value={form.campaignName}
                  onChange={(event) => updateForm("campaignName", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </Field>

              <Field label="Spend">
                <input
                  inputMode="decimal"
                  value={form.spend}
                  onChange={(event) => updateForm("spend", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  placeholder="15.00"
                />
              </Field>

              <Field label="Clicks">
                <input
                  inputMode="numeric"
                  value={form.clicks}
                  onChange={(event) => updateForm("clicks", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  placeholder="0"
                />
              </Field>

              <Field label="Impressions">
                <input
                  inputMode="numeric"
                  value={form.impressions}
                  onChange={(event) => updateForm("impressions", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  placeholder="0"
                />
              </Field>

              <Field label="Assessments">
                <input
                  inputMode="numeric"
                  value={form.assessments}
                  onChange={(event) => updateForm("assessments", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  placeholder="0"
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Search terms to block">
                <textarea
                  value={form.searchTermsToBlock}
                  onChange={(event) => updateForm("searchTermsToBlock", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 min-h-36"
                  placeholder={"free tax help\ntax refund\nbookkeeping jobs"}
                />
              </Field>

              <Field label="Action needed">
                <textarea
                  value={form.actionNeeded}
                  onChange={(event) => updateForm("actionNeeded", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 min-h-36"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 min-h-28"
                  placeholder="What happened today? Was traffic relevant? Any lead quality concerns?"
                />
              </Field>
            </div>

            <button
              type="button"
              onClick={addEntry}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 lg:w-auto"
            >
              <Plus className="h-4 w-4" />
              Save Campaign Watch Entry
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-300">
              Negative Keyword Bank
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Block bad intent fast</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-400">
              Start with this defensive list, then add real search terms from Google Ads as they appear.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {combinedNegativeKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-black text-orange-100"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => copyText(combinedNegativeKeywords.join("\n"), "Negative keyword list copied.")}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-sm font-black text-orange-100 transition hover:bg-orange-500/20"
            >
              <Clipboard className="h-4 w-4" />
              Copy Negative Keywords
            </button>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Launch rule
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-300">
                Do not broaden keywords or raise budget until search terms prove the campaign is attracting real tax-planning prospects.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
                  Watch Log
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">Daily paid traffic record</h2>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search date, campaign, notes..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-11 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniMetric label="CTR" value={clickThroughRate === null ? "—" : `${clickThroughRate.toFixed(2)}%`} />
              <MiniMetric label="CPC" value={costPerClick === null ? "—" : formatMoney(costPerClick)} />
              <MiniMetric label="CPA" value={costPerAssessment === null ? "—" : formatMoney(costPerAssessment)} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-300">
              Decision Rules
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">What to do with the data</h2>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              <RuleCard
                title="Spend, no leads"
                description="If spend reaches $50+ with no assessments, inspect search terms before changing budget."
              />
              <RuleCard
                title="Bad intent"
                description="Add negative keywords immediately for tax prep, refund, bookkeeping, jobs, and software searches."
              />
              <RuleCard
                title="Good lead"
                description="If a quality assessment comes through, keep budget stable and improve the landing page before scaling."
              />
            </div>
          </div>
        </section>

        {filteredEntries.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-center shadow-xl shadow-black/20">
            <BarChart3 className="mx-auto h-10 w-10 text-slate-500" />
            <p className="mt-4 text-xl font-black text-white">No campaign watch entries yet.</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-400">
              Add the launch baseline now, then return once per day to enter Google Ads spend, clicks, assessments, and bad search terms.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredEntries.map((entry) => {
              const cpa = getCostPerAssessment(entry.spend, entry.assessments);
              const cpc = getCostPerClick(entry.spend, entry.clicks);
              const ctr = getClickThroughRate(entry.clicks, entry.impressions);
              const health = getEntryHealth(entry);
              const terms = getLines(entry.searchTermsToBlock);

              return (
                <article
                  key={entry.id}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 transition hover:border-blue-500/60 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black text-white">{formatDate(entry.date)}</h3>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${health.tone}`}>
                          {health.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-400">{entry.campaignName}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteEntry(entry.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-black text-rose-200 transition hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    <MiniMetric label="Spend" value={formatMoney(entry.spend)} />
                    <MiniMetric label="Clicks" value={String(entry.clicks)} />
                    <MiniMetric label="Assessments" value={String(entry.assessments)} />
                    <MiniMetric label="CPA" value={cpa === null ? "—" : formatMoney(cpa)} />
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <MiniMetric label="Impressions" value={String(entry.impressions)} />
                    <MiniMetric label="CTR" value={ctr === null ? "—" : `${ctr.toFixed(2)}%`} />
                    <MiniMetric label="CPC" value={cpc === null ? "—" : formatMoney(cpc)} />
                  </div>

                  {terms.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-200">
                        Terms to block
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {terms.map((term) => (
                          <span
                            key={`${entry.id}-${term}`}
                            className="rounded-full border border-orange-500/30 bg-slate-950 px-3 py-1 text-xs font-black text-orange-100"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.actionNeeded && (
                    <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                        Action needed
                      </p>
                      <p className="mt-2 text-sm font-bold leading-6 text-blue-50">{entry.actionNeeded}</p>
                    </div>
                  )}

                  {entry.notes && (
                    <p className="mt-5 text-sm font-bold leading-6 text-slate-400">{entry.notes}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-xs font-bold leading-5 text-slate-400">{description}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function RuleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-400">{description}</p>
    </div>
  );
}
