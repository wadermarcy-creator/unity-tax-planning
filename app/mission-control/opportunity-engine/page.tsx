"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  FileText,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  household_income: string | null;
  investable_assets: string | null;
  lead_score: number | null;
  status: string | null;
  biggest_tax_concern: string | null;
  business_owner?: boolean | null;
  retiring_soon?: boolean | null;
  charitable_giving?: boolean | null;
  current_advisor?: boolean | null;
  current_cpa?: boolean | null;
  upcoming_sale?: boolean | null;
};

type Opportunity = {
  title: string;
  category: string;
  confidence: number;
  estimatedSavings: string;
  projectedRevenue: number;
  reason: string;
  nextAction: string;
  documents: string[];
  questions: string[];
};

type StrategyQueueItem = {
  id: string;
  queued_at: string;
  lead_id: string;
  lead_name: string;
  lead_email: string | null;
  priority_score: number;
  projected_annual_revenue: number;
  top_opportunity: string;
  opportunities: Opportunity[];
};

type Toast = {
  id: number;
  tone: "success" | "warning" | "error";
  message: string;
};

const STRATEGY_QUEUE_KEY = "unity_tax_opportunity_strategy_queue";

function getFullName(lead: Lead) {
  return `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getHighAssetSignal(lead: Lead) {
  const assets = lead.investable_assets || "";
  return (
    assets.includes("$1M") ||
    assets.includes("$5M") ||
    assets.toLowerCase().includes("million") ||
    assets.includes("1,000,000") ||
    assets.includes("5,000,000")
  );
}

function getOpportunities(lead: Lead): Opportunity[] {
  const opportunities: Opportunity[] = [];

  if (lead.business_owner) {
    opportunities.push({
      title: "Retirement Plan Design",
      category: "Business Planning",
      confidence: 94,
      estimatedSavings: "High",
      projectedRevenue: 9500,
      reason:
        "Business owners with meaningful income may benefit from reviewing SEP IRA, Solo 401(k), cash balance, or defined benefit plan options.",
      nextAction: "Ask for business tax return, payroll details, and owner compensation before the strategy call.",
      documents: [
        "Business tax return",
        "Payroll details",
        "Owner compensation",
        "Current retirement plan documents",
      ],
      questions: [
        "How many employees do you have?",
        "What is your annual business cash flow?",
        "Do you already sponsor a retirement plan?",
      ],
    });

    opportunities.push({
      title: "Entity Structure Review",
      category: "Business Planning",
      confidence: 88,
      estimatedSavings: "Moderate to High",
      projectedRevenue: 7500,
      reason:
        "Business ownership can create opportunities around entity selection, S corporation compensation, QBI, payroll, and deduction strategy.",
      nextAction: "Confirm current tax election and whether reasonable compensation has been reviewed recently.",
      documents: ["Entity documents", "Business tax return", "Profit and loss statement"],
      questions: [
        "How is the business currently taxed?",
        "Are you taking W-2 wages?",
        "Has your CPA reviewed reasonable compensation?",
      ],
    });
  }

  if (lead.upcoming_sale) {
    opportunities.push({
      title: "Pre-Sale Tax Strategy",
      category: "Liquidity Event",
      confidence: 92,
      estimatedSavings: "High",
      projectedRevenue: 12000,
      reason:
        "Upcoming sales often require planning before the transaction closes. Timing, structure, charitable planning, and installment strategies may matter.",
      nextAction: "Move this prospect into a pre-sale planning workflow before the transaction closes.",
      documents: ["Sale estimate", "Basis information", "Entity documents", "CPA projections"],
      questions: [
        "When is the expected sale?",
        "What is your estimated basis?",
        "Is the buyer identified?",
      ],
    });
  }

  if (lead.retiring_soon) {
    opportunities.push({
      title: "Roth Conversion Planning",
      category: "Retirement Planning",
      confidence: 86,
      estimatedSavings: "Long-term",
      projectedRevenue: 6000,
      reason:
        "Retirement transition years may create lower-income windows where Roth conversions should be evaluated before RMDs begin.",
      nextAction: "Build a taxable income timeline and compare conversion windows before Social Security and RMDs.",
      documents: ["IRA balances", "Tax return", "Social Security estimate", "Pension details"],
      questions: [
        "When do you plan to retire?",
        "When do RMDs begin?",
        "Do you expect taxable income to fall temporarily?",
      ],
    });
  }

  if (lead.charitable_giving) {
    opportunities.push({
      title: "Charitable Giving Strategy",
      category: "Charitable Planning",
      confidence: 82,
      estimatedSavings: "Moderate",
      projectedRevenue: 4500,
      reason:
        "Charitable families may benefit from reviewing donor-advised funds, appreciated asset gifts, bunching, and qualified charitable distributions.",
      nextAction: "Ask whether they donate cash or appreciated assets and whether giving is recurring or event-driven.",
      documents: ["Giving history", "Brokerage statement", "Tax return"],
      questions: [
        "How much do you give annually?",
        "Do you own appreciated securities?",
        "Are you over age 70½?",
      ],
    });
  }

  if (getHighAssetSignal(lead)) {
    opportunities.push({
      title: "Investment Tax Efficiency Review",
      category: "Investment Tax",
      confidence: 80,
      estimatedSavings: "Moderate",
      projectedRevenue: 6500,
      reason:
        "Large taxable or investable assets may create planning opportunities around asset location, tax-loss harvesting, dividend exposure, and capital gains.",
      nextAction: "Request brokerage statements and realized gain/loss reports before discussing portfolio tax drag.",
      documents: ["Brokerage statements", "Realized gain/loss report", "Tax return"],
      questions: [
        "How much is held in taxable accounts?",
        "Do you have concentrated positions?",
        "Are there large unrealized gains?",
      ],
    });
  }

  if (opportunities.length === 0) {
    opportunities.push({
      title: "General Tax Planning Review",
      category: "Core Planning",
      confidence: 58,
      estimatedSavings: "Review Needed",
      projectedRevenue: 2500,
      reason:
        "The assessment should be reviewed for income timing, deductions, investment tax efficiency, and CPA coordination opportunities.",
      nextAction: "Start with the most recent tax return and clarify the urgent tax concern before recommending a strategy track.",
      documents: ["Tax return", "Income estimate", "Investment statements"],
      questions: [
        "What prompted the assessment?",
        "What tax issue feels most urgent?",
        "Who prepares your tax return?",
      ],
    });
  }

  return opportunities.sort((a, b) => b.confidence - a.confidence);
}

function getPriorityScore(lead: Lead, opportunities: Opportunity[]) {
  const existingScore = typeof lead.lead_score === "number" ? lead.lead_score : 0;
  const opportunityAverage =
    opportunities.length > 0
      ? Math.round(
          opportunities.reduce((total, item) => total + item.confidence, 0) /
            opportunities.length,
        )
      : 0;

  const base = existingScore > 0 ? Math.round(existingScore * 0.55 + opportunityAverage * 0.45) : opportunityAverage;
  const modifiers =
    (lead.upcoming_sale ? 8 : 0) +
    (lead.business_owner ? 5 : 0) +
    (getHighAssetSignal(lead) ? 4 : 0) +
    (lead.retiring_soon ? 3 : 0);

  return Math.min(99, Math.max(1, base + modifiers));
}

function getProjectedAnnualRevenue(lead: Lead, opportunities: Opportunity[]) {
  const opportunityRevenue = opportunities.reduce(
    (total, item) => total + item.projectedRevenue,
    0,
  );

  const scoreMultiplier = lead.lead_score && lead.lead_score >= 80 ? 1.25 : 1;
  const advisorMultiplier = lead.current_advisor ? 1.1 : 1;

  return Math.round((opportunityRevenue || 2500) * scoreMultiplier * advisorMultiplier);
}

function getScoreTone(score: number) {
  if (score >= 85) return "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";
  if (score >= 70) return "text-blue-300 border-blue-500/30 bg-blue-500/10";
  if (score >= 55) return "text-amber-300 border-amber-500/30 bg-amber-500/10";
  return "text-slate-300 border-slate-700 bg-slate-900";
}

function getExecutiveRecommendation(
  lead: Lead,
  opportunities: Opportunity[],
  priorityScore: number,
  projectedAnnualRevenue: number,
) {
  const name = getFullName(lead);
  const topOpportunity = opportunities[0];

  if (!topOpportunity) {
    return "No tax opportunity recommendation is available yet. Review the assessment and request the latest tax return before assigning a strategy track.";
  }

  if (priorityScore >= 85) {
    return `Prioritize ${name} now. The strongest planning angle is ${topOpportunity.title}, and the projected annual revenue opportunity is approximately ${formatCurrency(
      projectedAnnualRevenue,
    )}. Move this into a focused strategy call and request documents before the meeting.`;
  }

  if (priorityScore >= 70) {
    return `Treat ${name} as a strong follow-up opportunity. Lead with ${topOpportunity.title}, confirm the facts behind the assessment, and use the next conversation to determine whether this becomes a paid tax plan.`;
  }

  return `Keep ${name} in the nurture queue. There may still be planning value, but the current assessment data does not justify urgent prioritization without a tax return, clearer income details, or a stronger planning trigger.`;
}

function buildExecutiveBrief(
  lead: Lead,
  opportunities: Opportunity[],
  priorityScore: number,
  projectedAnnualRevenue: number,
) {
  const topOpportunity = opportunities[0];

  return [
    `Opportunity Engine Brief`,
    `Prospect: ${getFullName(lead)}`,
    `Email: ${lead.email || "Not provided"}`,
    `Status: ${lead.status || "Unassigned"}`,
    `Priority Score: ${priorityScore}/100`,
    `Projected Annual Revenue: ${formatCurrency(projectedAnnualRevenue)}`,
    `Top Opportunity: ${topOpportunity?.title || "General Review"}`,
    `Primary Concern: ${lead.biggest_tax_concern || "Not provided"}`,
    "",
    "AI Executive Recommendation:",
    getExecutiveRecommendation(lead, opportunities, priorityScore, projectedAnnualRevenue),
    "",
    "Questions to Ask:",
    ...(topOpportunity?.questions || []).map((question) => `- ${question}`),
    "",
    "Documents Needed:",
    ...(topOpportunity?.documents || []).map((document) => `- ${document}`),
  ].join("\n");
}

function escapeCsv(value: string | number | null | undefined) {
  const stringValue = value === null || value === undefined ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number | null | undefined>>) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getStoredQueue(): StrategyQueueItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STRATEGY_QUEUE_KEY);
    return stored ? (JSON.parse(stored) as StrategyQueueItem[]) : [];
  } catch {
    return [];
  }
}

export default function OpportunityEnginePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [queuedCount, setQueuedCount] = useState(0);

  async function loadLeads() {
    setLoadError("");

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setLoadError("Opportunity Engine could not load assessments. Check the tax_leads table and permissions.");
      setLeads([]);
      setSelectedLeadId("");
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    const loadedLeads = (data || []) as Lead[];
    setLeads(loadedLeads);

    if (loadedLeads.length > 0) {
      setSelectedLeadId((current) => current || loadedLeads[0].id);
    } else {
      setSelectedLeadId("");
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadLeads();
    setQueuedCount(getStoredQueue().length);
  }, []);

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;

  const opportunities = useMemo(
    () => (selectedLead ? getOpportunities(selectedLead) : []),
    [selectedLead],
  );

  const averageConfidence =
    opportunities.length > 0
      ? Math.round(
          opportunities.reduce((total, item) => total + item.confidence, 0) /
            opportunities.length,
        )
      : 0;

  const priorityScore = selectedLead ? getPriorityScore(selectedLead, opportunities) : 0;
  const projectedAnnualRevenue = selectedLead
    ? getProjectedAnnualRevenue(selectedLead, opportunities)
    : 0;
  const topOpportunity = opportunities[0] || null;
  const executiveRecommendation = selectedLead
    ? getExecutiveRecommendation(
        selectedLead,
        opportunities,
        priorityScore,
        projectedAnnualRevenue,
      )
    : "Select an assessment to generate an executive recommendation.";

  function showToast(message: string, tone: Toast["tone"] = "success") {
    const nextToast = { id: Date.now(), message, tone };
    setToast(nextToast);
    window.setTimeout(() => {
      setToast((current) => (current?.id === nextToast.id ? null : current));
    }, 3200);
  }

  async function copyText(value: string, successMessage: string) {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      showToast(successMessage);
    } catch {
      showToast("Copy failed. You may need to copy it manually from the browser.", "error");
    }
  }

  function refreshReports() {
    setIsRefreshing(true);
    loadLeads();
    setQueuedCount(getStoredQueue().length);
    showToast("Opportunity Engine refreshed.");
  }

  function queueStrategyPlan() {
    if (!selectedLead) return;

    const existingQueue = getStoredQueue();
    const queueItem: StrategyQueueItem = {
      id: `${selectedLead.id}-${Date.now()}`,
      queued_at: new Date().toISOString(),
      lead_id: selectedLead.id,
      lead_name: getFullName(selectedLead),
      lead_email: selectedLead.email,
      priority_score: priorityScore,
      projected_annual_revenue: projectedAnnualRevenue,
      top_opportunity: topOpportunity?.title || "General Tax Planning Review",
      opportunities,
    };

    window.localStorage.setItem(
      STRATEGY_QUEUE_KEY,
      JSON.stringify([queueItem, ...existingQueue].slice(0, 50)),
    );

    setQueuedCount(getStoredQueue().length);
    showToast("Strategy plan added to the local queue.");
  }

  function exportSelectedLead() {
    if (!selectedLead) return;

    downloadCsv(`unity-opportunity-${selectedLead.id}.csv`,
      opportunities.map((opportunity) => ({
        prospect: getFullName(selectedLead),
        email: selectedLead.email || "",
        priority_score: priorityScore,
        projected_annual_revenue: projectedAnnualRevenue,
        opportunity: opportunity.title,
        category: opportunity.category,
        confidence: opportunity.confidence,
        estimated_savings: opportunity.estimatedSavings,
        projected_revenue: opportunity.projectedRevenue,
        reason: opportunity.reason,
        next_action: opportunity.nextAction,
        questions: opportunity.questions.join(" | "),
        documents: opportunity.documents.join(" | "),
      })),
    );

    showToast("Selected opportunity exported.");
  }

  function exportAllLeads() {
    const rows = leads.flatMap((lead) => {
      const leadOpportunities = getOpportunities(lead);
      const leadPriorityScore = getPriorityScore(lead, leadOpportunities);
      const leadProjectedRevenue = getProjectedAnnualRevenue(lead, leadOpportunities);

      return leadOpportunities.map((opportunity) => ({
        created_at: lead.created_at,
        prospect: getFullName(lead),
        email: lead.email || "",
        status: lead.status || "",
        household_income: lead.household_income || "",
        investable_assets: lead.investable_assets || "",
        lead_score: lead.lead_score ?? 0,
        priority_score: leadPriorityScore,
        projected_annual_revenue: leadProjectedRevenue,
        opportunity: opportunity.title,
        category: opportunity.category,
        confidence: opportunity.confidence,
        next_action: opportunity.nextAction,
      }));
    });

    downloadCsv("unity-opportunity-engine-export.csv", rows);
    showToast("Opportunity Engine export downloaded.");
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Opportunity Engine"
        subtitle="Identify the highest-value tax planning opportunities from assessment data."
      />

      {toast && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl shadow-black/40">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 rounded-full p-1 ${
                toast.tone === "success"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : toast.tone === "warning"
                    ? "bg-amber-500/15 text-amber-300"
                    : "bg-rose-500/15 text-rose-300"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold leading-6 text-slate-200">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-auto rounded-full p-1 text-slate-500 hover:bg-slate-900 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
              <p className="font-bold">Loading opportunity engine...</p>
            </div>
          </div>
        ) : loadError ? (
          <section className="rounded-[2rem] border border-rose-500/30 bg-rose-500/10 p-8 shadow-xl shadow-rose-950/20">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-rose-300">
              Data Source Issue
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
              Opportunity Engine needs assessment data.
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-rose-100/80">
              {loadError}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshReports}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 hover:bg-slate-200"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/mission-control/assessments"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/30 px-5 py-4 text-sm font-black text-rose-100 hover:border-rose-200 hover:text-white"
              >
                Open Assessments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : leads.length === 0 ? (
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-300">
              No Assessments Yet
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
              Opportunity Engine will activate after the first tax assessment.
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-slate-400">
              Once prospects complete the tax opportunity scan, this page will rank planning opportunities, show projected annual revenue, and recommend the next best action.
            </p>
            <Link
              href="/mission-control/assessments"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
            >
              Open Assessments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            <section className="mb-6 overflow-hidden rounded-[2rem] border border-violet-500/30 bg-violet-500/10 shadow-2xl shadow-violet-950/20">
              <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 sm:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                    <Sparkles className="h-4 w-4" />
                    AI Tax Opportunity Engine™
                  </div>

                  <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl xl:text-5xl">
                    Rank the next best tax planning opportunity.
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-300 sm:text-base sm:leading-8">
                    This turns assessment data into a prioritized strategy view: who to call, what to lead with, what revenue may be available, and which documents to request before the meeting.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Assessments
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">{leads.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Strategy Queue
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">{queuedCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Top Confidence
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">
                        {topOpportunity?.confidence || 0}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-violet-400/20 bg-slate-950/50 p-6 sm:p-8 xl:border-l xl:border-t-0">
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Select Assessment
                  </label>

                  <select
                    value={selectedLeadId}
                    onChange={(event) => setSelectedLeadId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm font-black text-white outline-none focus:border-violet-400"
                  >
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {getFullName(lead)} · Score {lead.lead_score ?? 0}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        selectedLead &&
                        copyText(
                          buildExecutiveBrief(
                            selectedLead,
                            opportunities,
                            priorityScore,
                            projectedAnnualRevenue,
                          ),
                          "Executive brief copied.",
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Brief
                    </button>
                    <button
                      type="button"
                      onClick={exportAllLeads}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-black text-slate-300 hover:border-violet-400 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      Export All
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {selectedLead && (
              <>
                <section className="mb-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                  <div className="rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-6 shadow-xl shadow-blue-950/20 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                          <Brain className="h-4 w-4" />
                          AI Executive Recommendation
                        </div>
                        <h2 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl">
                          {topOpportunity?.title || "Review Assessment"}
                        </h2>
                      </div>

                      <div className={`rounded-2xl border px-4 py-3 text-center ${getScoreTone(priorityScore)}`}>
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.16em]">
                          Priority Score
                        </p>
                        <p className="mt-1 text-3xl font-black">{priorityScore}</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm font-semibold leading-7 text-slate-200 sm:text-base sm:leading-8">
                      {executiveRecommendation}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={queueStrategyPlan}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 hover:bg-slate-200"
                      >
                        <ClipboardList className="h-4 w-4" />
                        Queue Strategy Plan
                      </button>
                      <Link
                        href="/mission-control/assessments"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-300/30 px-5 py-4 text-sm font-black text-blue-100 hover:border-blue-200 hover:text-white"
                      >
                        Review Assessments
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={exportSelectedLead}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-300/30 px-5 py-4 text-sm font-black text-blue-100 hover:border-blue-200 hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                        Export Prospect
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                        <TrendingUp className="h-4 w-4" />
                        Projected Annual Revenue
                      </p>
                      <p className="mt-4 text-4xl font-black text-white">
                        {formatCurrency(projectedAnnualRevenue)}
                      </p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
                        Internal estimate based on the visible tax planning opportunities.
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                        <Target className="h-4 w-4" />
                        Opportunity Confidence
                      </p>
                      <p className="mt-4 text-4xl font-black text-white">
                        {averageConfidence}%
                      </p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
                        Average confidence across {opportunities.length} suggested planning area{opportunities.length === 1 ? "" : "s"}.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      <UserRound className="h-4 w-4" />
                      Prospect
                    </p>
                    <p className="mt-4 text-2xl font-black text-white">{getFullName(selectedLead)}</p>
                    <p className="mt-3 break-words text-sm font-semibold text-slate-400">
                      {selectedLead.email || "No email provided"}
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      <BarChart3 className="h-4 w-4" />
                      Lead Details
                    </p>
                    <p className="mt-4 text-sm font-bold leading-7 text-slate-300">
                      Income: {selectedLead.household_income || "Unknown"}
                      <br />
                      Assets: {selectedLead.investable_assets || "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      <FileText className="h-4 w-4" />
                      Assessment Status
                    </p>
                    <p className="mt-4 text-2xl font-black text-white">
                      {selectedLead.status || "New"}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-slate-400">
                      Submitted {formatDate(selectedLead.created_at)}
                    </p>
                  </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-2">
                  {opportunities.map((opportunity, index) => (
                    <article
                      key={`${opportunity.title}-${index}`}
                      className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                            <Lightbulb className="h-3.5 w-3.5" />
                            {opportunity.category}
                          </p>

                          <h2 className="mt-4 text-2xl font-black text-white">
                            {opportunity.title}
                          </h2>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-emerald-300">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.16em]">
                            Confidence
                          </p>
                          <p className="mt-1 text-2xl font-black">{opportunity.confidence}%</p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Estimated Savings
                          </p>
                          <p className="mt-2 text-lg font-black text-white">
                            {opportunity.estimatedSavings}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Revenue Potential
                          </p>
                          <p className="mt-2 text-lg font-black text-white">
                            {formatCurrency(opportunity.projectedRevenue)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-sm font-semibold leading-7 text-slate-400">
                        {opportunity.reason}
                      </p>

                      <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                          Next Best Action
                        </p>
                        <p className="mt-2 text-sm font-bold leading-6 text-blue-50/90">
                          {opportunity.nextAction}
                        </p>
                      </div>

                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                            Questions to Ask
                          </p>

                          <div className="space-y-2">
                            {opportunity.questions.map((question) => (
                              <p
                                key={question}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm font-bold leading-6 text-slate-300"
                              >
                                {question}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                            Documents Needed
                          </p>

                          <div className="space-y-2">
                            {opportunity.documents.map((document) => (
                              <p
                                key={document}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm font-bold leading-6 text-slate-300"
                              >
                                {document}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              [
                                `${opportunity.title} — ${getFullName(selectedLead)}`,
                                `Category: ${opportunity.category}`,
                                `Confidence: ${opportunity.confidence}%`,
                                `Revenue Potential: ${formatCurrency(opportunity.projectedRevenue)}`,
                                `Reason: ${opportunity.reason}`,
                                `Next Action: ${opportunity.nextAction}`,
                              ].join("\n"),
                              "Opportunity copied.",
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Opportunity
                        </button>

                        <button
                          type="button"
                          onClick={queueStrategyPlan}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-4 text-sm font-black text-slate-300 hover:border-violet-500 hover:text-white"
                        >
                          <ClipboardList className="h-4 w-4" />
                          Queue Plan
                        </button>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
