"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  ClipboardCopy,
  Download,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  household_income: string | null;
  investable_assets: string | null;
  lead_score: number | null;
  lead_grade: string | null;
  status: string | null;
  biggest_tax_concern: string | null;
};

type FilterValue = "all" | "active" | "new" | "qualified" | "follow_up" | "nurture" | "closed" | "archived";

function getFullName(lead: Lead) {
  return `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed";
}

function getOpportunityLabel(score: number | null) {
  const value = score ?? 0;

  if (value >= 130) return "Exceptional";
  if (value >= 100) return "High";
  if (value >= 70) return "Moderate";
  if (value >= 40) return "Developing";
  return "Nurture";
}

function getOpportunityTone(score: number | null) {
  const value = score ?? 0;

  if (value >= 130) return "border-violet-500/40 bg-violet-500/10 text-violet-300";
  if (value >= 100) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  if (value >= 70) return "border-blue-500/40 bg-blue-500/10 text-blue-300";
  if (value >= 40) return "border-orange-500/40 bg-orange-500/10 text-orange-300";
  return "border-slate-700 bg-slate-900 text-slate-300";
}

function getStatusLabel(status: string | null) {
  if (!status) return "Unreviewed";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "Recently";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeText(value: string | null) {
  return (value || "").toLowerCase();
}

function isDormantStatus(status: string | null) {
  return ["closed", "archived"].includes(status || "");
}

function estimateAnnualRevenue(lead: Lead) {
  const score = lead.lead_score ?? 0;
  const income = normalizeText(lead.household_income);
  const assets = normalizeText(lead.investable_assets);
  let estimate = 1_500;

  if (score >= 130) estimate += 7_500;
  else if (score >= 100) estimate += 5_000;
  else if (score >= 70) estimate += 3_000;
  else if (score >= 40) estimate += 1_500;

  if (
    assets.includes("5m") ||
    assets.includes("5 million") ||
    assets.includes("$5") ||
    assets.includes("10m") ||
    assets.includes("10 million") ||
    assets.includes("$10")
  ) {
    estimate += 10_000;
  } else if (
    assets.includes("1m") ||
    assets.includes("1 million") ||
    assets.includes("$1") ||
    assets.includes("2m") ||
    assets.includes("2 million") ||
    assets.includes("$2")
  ) {
    estimate += 5_000;
  } else if (assets.includes("500") || assets.includes("750")) {
    estimate += 2_500;
  }

  if (
    income.includes("500") ||
    income.includes("750") ||
    income.includes("1m") ||
    income.includes("1 million") ||
    income.includes("$1")
  ) {
    estimate += 4_000;
  } else if (income.includes("250") || income.includes("300") || income.includes("400")) {
    estimate += 2_500;
  } else if (income.includes("150") || income.includes("200")) {
    estimate += 1_250;
  }

  return estimate;
}

function getNextBestAction(lead: Lead) {
  const score = lead.lead_score ?? 0;
  const concern = normalizeText(lead.biggest_tax_concern);

  if (score >= 130) return "Call today and position this as a high-priority tax planning review.";
  if (score >= 100) return "Send a personalized follow-up and move this into Strategy Builder.";
  if (concern.includes("capital gain") || concern.includes("sale")) {
    return "Lead with capital gain mitigation and timing strategy options.";
  }
  if (concern.includes("retire") || concern.includes("ira") || concern.includes("roth")) {
    return "Lead with retirement income, Roth conversion, and tax-bracket planning.";
  }
  if (concern.includes("business") || concern.includes("owner")) {
    return "Lead with entity structure, deductions, retirement plan, and exit planning.";
  }
  return "Review the assessment and send a concise tax opportunity recap.";
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return false;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);

  return true;
}

export default function AssessmentsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function copyToClipboard(value: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(successMessage);
    } catch {
      showToast("Copy failed. Select and copy manually.");
    }
  }

  async function loadLeads(options?: { silent?: boolean }) {
    setErrorMessage("");

    if (options?.silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setErrorMessage("Assessments could not be loaded. Check Supabase permissions or the tax_leads table.");
    }

    if (!error && data) {
      setLeads(data as Lead[]);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const score = lead.lead_score ?? 0;
      const status = lead.status || "new";
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !isDormantStatus(status)) ||
        (filter === "qualified" && score >= 100 && !isDormantStatus(status)) ||
        (filter === "follow_up" && ["follow_up", "contacted", "in_review", "reviewing", "discovery", "proposal"].includes(status)) ||
        (filter === "nurture" && score < 70 && !isDormantStatus(status)) ||
        status === filter;

      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;

      const haystack = [
        getFullName(lead),
        lead.email,
        lead.phone,
        lead.household_income,
        lead.investable_assets,
        lead.biggest_tax_concern,
        lead.lead_grade,
        lead.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [filter, leads, search]);

  const rankedLeads = useMemo(() => {
    return leads.filter((lead) => !isDormantStatus(lead.status)).sort((a, b) => {
      const scoreDifference = (b.lead_score ?? 0) - (a.lead_score ?? 0);
      if (scoreDifference !== 0) return scoreDifference;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [leads]);

  const topLead = rankedLeads[0];

  const counts = useMemo(() => {
    return {
      all: leads.length,
      active: leads.filter((lead) => !isDormantStatus(lead.status)).length,
      new: leads.filter((lead) => (lead.status || "new") === "new").length,
      qualified: leads.filter((lead) => (lead.lead_score ?? 0) >= 100 && !isDormantStatus(lead.status)).length,
      nurture: leads.filter((lead) => (lead.lead_score ?? 0) < 70 && !isDormantStatus(lead.status)).length,
      closed: leads.filter((lead) => lead.status === "closed").length,
      archived: leads.filter((lead) => lead.status === "archived").length,
    };
  }, [leads]);

  const projectedAnnualRevenue = useMemo(() => {
    return leads.reduce((total, lead) => total + estimateAnnualRevenue(lead), 0);
  }, [leads]);

  const filteredProjectedAnnualRevenue = useMemo(() => {
    return filteredLeads.reduce((total, lead) => total + estimateAnnualRevenue(lead), 0);
  }, [filteredLeads]);

  const priorityScore = useMemo(() => {
    if (rankedLeads.length === 0) return 0;

    const topFive = rankedLeads.slice(0, 5);
    const average =
      topFive.reduce((total, lead) => total + (lead.lead_score ?? 0), 0) / topFive.length;

    return Math.round(average);
  }, [rankedLeads]);

  const executiveRecommendation = useMemo(() => {
    if (!topLead) {
      return "No assessments are in the queue yet. Confirm the public Tax Opportunity Scan is submitting correctly, then use this page as the daily triage center.";
    }

    const topLeadName = getFullName(topLead);
    const topScore = topLead.lead_score ?? 0;

    if (topScore >= 130) {
      return `${topLeadName} is the highest-priority assessment. Call today, reference their tax concern, and move the opportunity into Strategy Builder before it cools off.`;
    }

    if (topScore >= 100) {
      return `${topLeadName} should be reviewed first. Send a personalized recap, then route the opportunity into Client Copilot or Strategy Builder.`;
    }

    return "The assessment queue is active, but the current top prospects need more qualification. Focus on fast follow-up, clean notes, and moving only the best opportunities forward.";
  }, [topLead]);

  const csvRows = useMemo(() => {
    return filteredLeads.map((lead) => ({
      name: getFullName(lead),
      email: lead.email || "",
      phone: lead.phone || "",
      status: lead.status || "new",
      lead_score: lead.lead_score ?? 0,
      lead_grade: lead.lead_grade || getOpportunityLabel(lead.lead_score),
      household_income: lead.household_income || "",
      investable_assets: lead.investable_assets || "",
      projected_annual_revenue: estimateAnnualRevenue(lead),
      biggest_tax_concern: lead.biggest_tax_concern || "",
      next_best_action: getNextBestAction(lead),
      created_at: lead.created_at,
    }));
  }, [filteredLeads]);

  function exportFilteredLeads() {
    const didExport = downloadCsv("unity-tax-assessments.csv", csvRows);
    showToast(didExport ? "Assessment CSV exported." : "No assessments to export.");
  }

  function copyExecutiveBrief() {
    const brief = [
      "Unity Tax Assessment Center Brief",
      `Total assessments: ${counts.all}`,
      `New assessments: ${counts.new}`,
      `Qualified assessments: ${counts.qualified}`,
      `Priority score: ${priorityScore}`,
      `Projected annual revenue: ${formatCurrency(projectedAnnualRevenue)}`,
      `Top opportunity: ${topLead ? getFullName(topLead) : "None yet"}`,
      `Recommendation: ${executiveRecommendation}`,
    ].join("\n");

    copyToClipboard(brief, "Executive brief copied.");
  }

  function copyLeadBrief(lead: Lead) {
    const brief = [
      `Prospect: ${getFullName(lead)}`,
      `Email: ${lead.email || "No email"}`,
      `Phone: ${lead.phone || "No phone"}`,
      `Score: ${lead.lead_score ?? 0}`,
      `Grade: ${lead.lead_grade || getOpportunityLabel(lead.lead_score)}`,
      `Status: ${getStatusLabel(lead.status)}`,
      `Household income: ${lead.household_income || "Not provided"}`,
      `Investable assets: ${lead.investable_assets || "Not provided"}`,
      `Projected annual revenue: ${formatCurrency(estimateAnnualRevenue(lead))}`,
      `Concern: ${lead.biggest_tax_concern || "No concern summary provided."}`,
      `Next best action: ${getNextBestAction(lead)}`,
    ].join("\n");

    copyToClipboard(brief, `${getFullName(lead)} brief copied.`);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Assessment Center"
        subtitle="Review, prioritize, and convert new tax planning opportunities."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-5 shadow-2xl shadow-blue-950/20 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-blue-200">
                  <Brain className="h-4 w-4" />
                  AI Executive Recommendation
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-300">
                  Launch Triage
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Turn tax assessments into prioritized revenue conversations.
              </h1>

              <p className="mt-4 max-w-4xl text-base font-semibold leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {executiveRecommendation}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[24rem] xl:grid-cols-1">
              <button
                type="button"
                onClick={copyExecutiveBrief}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-blue-50"
              >
                <ClipboardCopy className="h-4 w-4" />
                Copy Brief
              </button>

              <button
                type="button"
                onClick={exportFilteredLeads}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-4 text-sm font-black text-blue-100 transition hover:bg-blue-500/20"
              >
                <Download className="h-4 w-4" />
                Export Current View
              </button>

              <button
                type="button"
                onClick={() => loadLeads({ silent: true })}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-5 py-4 text-sm font-black text-slate-200 transition hover:border-blue-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 xl:col-span-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing" : "Refresh"}
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] border border-violet-500/30 bg-violet-500/10 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-violet-300">
              <Target className="h-4 w-4" />
              Priority Score
            </p>
            <p className="mt-4 text-4xl font-black text-white">{priorityScore}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-violet-100/80">
              Average score of the top assessment opportunities.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              Projected Annual Revenue
            </p>
            <p className="mt-4 text-4xl font-black text-white">
              {formatCurrency(projectedAnnualRevenue)}
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-emerald-100/80">
              Estimated annual value across the assessment queue.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Total Assessments
            </p>
            <p className="mt-4 text-4xl font-black text-white">{counts.all}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
              All submitted Tax Opportunity Scans.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Qualified
            </p>
            <p className="mt-4 text-4xl font-black text-white">{counts.qualified}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
              High or exceptional planning potential.
            </p>
          </div>
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
                  Assessment Filters
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">Review queue</h2>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, concern, income..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { label: "All", value: "all", count: counts.all },
                { label: "Active", value: "active", count: counts.active },
                { label: "New", value: "new", count: counts.new },
                { label: "Qualified", value: "qualified", count: counts.qualified },
                {
                  label: "Follow Up",
                  value: "follow_up",
                  count: leads.filter((lead) =>
                    ["follow_up", "contacted", "in_review", "reviewing", "discovery", "proposal"].includes(
                      lead.status || "",
                    ),
                  ).length,
                },
                { label: "Nurture", value: "nurture", count: counts.nurture },
                { label: "Closed", value: "closed", count: counts.closed },
                { label: "Archived", value: "archived", count: counts.archived },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value as FilterValue)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-black transition sm:px-5 ${
                    filter === item.value
                      ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-blue-500 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className="ml-2 text-xs opacity-70">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Filtered View Value
            </p>
            <p className="mt-3 text-3xl font-black text-white">
              {formatCurrency(filteredProjectedAnnualRevenue)}
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
              {filteredLeads.length} assessment{filteredLeads.length === 1 ? "" : "s"} match this view. Use export when you want a clean working list for follow-up.
            </p>
          </div>
        </section>

        {rankedLeads.length > 0 && (
          <section className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                  One-Click Actions
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">Follow-up queue</h2>
              </div>
              <p className="text-sm font-semibold text-slate-400">
                Top opportunities ranked by score and recency.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {rankedLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-black text-white">{getFullName(lead)}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Score {lead.lead_score ?? 0} · {formatCurrency(estimateAnnualRevenue(lead))}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] ${getOpportunityTone(lead.lead_score)}`}>
                      {getOpportunityLabel(lead.lead_score)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-400">
                    {getNextBestAction(lead)}
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => copyLeadBrief(lead)}
                      className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 transition hover:border-blue-500 hover:text-white"
                    >
                      Copy Brief
                    </button>
                    <Link
                      href={`/mission-control/assessments/${lead.id}`}
                      className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-blue-500"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold leading-6 text-red-200">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-sm font-bold text-slate-400">
            Loading assessments...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8">
            <p className="text-xl font-black text-white">No assessments match this view.</p>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-400">
              Clear the search or switch back to All. If this is a new launch, submit a test Tax Opportunity Scan to confirm the public form is feeding Mission Control.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 transition hover:border-blue-500/60 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="break-words text-2xl font-black text-white">
                        {getFullName(lead)}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${getOpportunityTone(
                          lead.lead_score,
                        )}`}
                      >
                        {getOpportunityLabel(lead.lead_score)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-400">
                      <span>{lead.email || "No email"}</span>
                      <span>{lead.phone || "No phone"}</span>
                      <span>{getStatusLabel(lead.status)}</span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Score
                        </p>
                        <p className="mt-2 text-lg font-black text-white">
                          {lead.lead_score ?? 0}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Revenue
                        </p>
                        <p className="mt-2 text-sm font-black text-white">
                          {formatCurrency(estimateAnnualRevenue(lead))}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Income
                        </p>
                        <p className="mt-2 text-sm font-black text-white">
                          {lead.household_income || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Assets
                        </p>
                        <p className="mt-2 text-sm font-black text-white">
                          {lead.investable_assets || "—"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-2 text-sm font-semibold leading-6 text-slate-400">
                      {lead.biggest_tax_concern || "No concern summary provided."}
                    </p>

                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                        Next Best Action
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                        {getNextBestAction(lead)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 lg:w-48">
                    <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      {formatDate(lead.created_at)}
                    </p>

                    <Link
                      href={`/mission-control/assessments/${lead.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                    >
                      Open Assessment
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => copyLeadBrief(lead)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-blue-500 hover:text-white"
                    >
                      <ClipboardCopy className="h-4 w-4" />
                      Copy
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300 transition hover:border-blue-500 hover:text-white"
                          aria-label={`Email ${getFullName(lead)}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-700">
                          <Mail className="h-4 w-4" />
                        </span>
                      )}

                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300 transition hover:border-blue-500 hover:text-white"
                          aria-label={`Call ${getFullName(lead)}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-700">
                          <Phone className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <Link
            href="/mission-control/client-copilot"
            className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-blue-500/60"
          >
            <UserRound className="h-5 w-5 text-blue-300" />
            <p className="mt-3 text-lg font-black text-white">Client Copilot</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
              Use assessment context to prepare prospect follow-up.
            </p>
          </Link>

          <Link
            href="/mission-control/opportunity-engine"
            className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-blue-500/60"
          >
            <Target className="h-5 w-5 text-emerald-300" />
            <p className="mt-3 text-lg font-black text-white">Opportunity Engine</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
              Rank lead quality, urgency, and revenue potential.
            </p>
          </Link>

          <Link
            href="/mission-control/strategy-builder"
            className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-blue-500/60"
          >
            <FileText className="h-5 w-5 text-violet-300" />
            <p className="mt-3 text-lg font-black text-white">Strategy Builder</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
              Turn the strongest opportunities into tax planning strategy briefs.
            </p>
          </Link>
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-blue-400/40 bg-slate-950 px-5 py-4 text-center text-sm font-black text-white shadow-2xl shadow-black/40">
          {toast}
        </div>
      )}
    </div>
  );
}
