"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  Clipboard,
  Download,
  FileText,
  Mail,
  RefreshCcw,
  ShieldCheck,
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
  reason: string;
  documents: string[];
  questions: string[];
};

type StrategyQueueItem = {
  id: string;
  leadName: string;
  score: number;
  projectedAnnualRevenue: number;
  opportunityCount: number;
  createdAt: string;
};

type Toast = {
  id: number;
  message: string;
};

function getFullName(lead: Lead) {
  return `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed";
}

function getOpportunities(lead: Lead): Opportunity[] {
  const opportunities: Opportunity[] = [];

  if (lead.business_owner) {
    opportunities.push({
      title: "Retirement Plan Design",
      category: "Business Planning",
      confidence: 94,
      estimatedSavings: "High",
      reason:
        "Business owners with meaningful income may benefit from reviewing SEP IRA, Solo 401(k), cash balance, or defined benefit plan options.",
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
      reason:
        "Business ownership can create opportunities around entity selection, S corporation compensation, QBI, payroll, and deduction strategy.",
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
      reason:
        "Upcoming sales often require planning before the transaction closes. Timing, structure, charitable planning, and installment strategies may matter.",
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
      reason:
        "Retirement transition years may create lower-income windows where Roth conversions should be evaluated before RMDs begin.",
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
      reason:
        "Charitable families may benefit from reviewing donor-advised funds, appreciated asset gifts, bunching, and qualified charitable distributions.",
      documents: ["Giving history", "Brokerage statement", "Tax return"],
      questions: [
        "How much do you give annually?",
        "Do you own appreciated securities?",
        "Are you over age 70½?",
      ],
    });
  }

  if ((lead.investable_assets || "").includes("$1M") || (lead.investable_assets || "").includes("$5M")) {
    opportunities.push({
      title: "Investment Tax Efficiency Review",
      category: "Investment Tax",
      confidence: 80,
      estimatedSavings: "Moderate",
      reason:
        "Large taxable or investable assets may create planning opportunities around asset location, tax-loss harvesting, dividend exposure, and capital gains.",
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
      reason:
        "The assessment should be reviewed for income timing, deductions, investment tax efficiency, and CPA coordination opportunities.",
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

function getPriorityScore(lead: Lead | null, selectedOpportunities: Opportunity[]) {
  if (!lead) return 0;

  const leadScore = lead.lead_score ?? 0;
  const confidenceAverage = selectedOpportunities.length
    ? selectedOpportunities.reduce((total, opportunity) => total + opportunity.confidence, 0) /
      selectedOpportunities.length
    : 0;
  const urgencyBoost = lead.upcoming_sale ? 7 : lead.business_owner ? 4 : 0;

  return Math.min(100, Math.round(leadScore * 0.55 + confidenceAverage * 0.4 + urgencyBoost));
}

function getProjectedAnnualRevenue(lead: Lead | null, selectedOpportunities: Opportunity[]) {
  if (!lead) return 0;

  const score = lead.lead_score ?? 0;
  const assets = lead.investable_assets || "";
  const income = lead.household_income || "";

  let base = 2500;

  if (assets.includes("$5M")) base += 17500;
  else if (assets.includes("$1M")) base += 8500;
  else if (assets.includes("$500")) base += 4500;

  if (income.includes("$500") || income.includes("$1M")) base += 5000;
  else if (income.includes("$250")) base += 2500;

  if (lead.business_owner) base += 4500;
  if (lead.upcoming_sale) base += 6500;
  if (lead.retiring_soon) base += 2500;
  if (lead.charitable_giving) base += 1500;

  base += selectedOpportunities.length * 1250;

  if (score >= 90) base *= 1.2;
  else if (score < 60) base *= 0.75;

  return Math.round(base / 250) * 250;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPriorityLabel(score: number) {
  if (score >= 88) return "Immediate Priority";
  if (score >= 74) return "High Priority";
  if (score >= 60) return "Monitor Closely";
  return "Needs Qualification";
}

function getExecutiveRecommendation(lead: Lead | null, selectedOpportunities: Opportunity[]) {
  if (!lead) return "Select an assessment to generate a recommended strategy path.";

  const name = getFullName(lead);
  const topOpportunity = selectedOpportunities[0] || getOpportunities(lead)[0];

  if (lead.upcoming_sale) {
    return `${name} should be moved into a pre-sale strategy workflow immediately. Lead with transaction timing, basis review, CPA coordination, and charitable planning before any liquidity event closes.`;
  }

  if (lead.business_owner && topOpportunity) {
    return `${name} should be positioned around business-owner tax planning. Lead with ${topOpportunity.title.toLowerCase()}, then expand into entity structure, retirement plan design, and recurring planning oversight.`;
  }

  if (lead.retiring_soon) {
    return `${name} should receive a retirement-transition tax review. Lead with Roth conversion windows, income timing, Social Security coordination, and investment tax efficiency.`;
  }

  if (lead.charitable_giving) {
    return `${name} should receive a giving-focused planning review. Lead with donor-advised fund evaluation, appreciated asset gifting, bunching strategy, and QCD eligibility where applicable.`;
  }

  return `${name} should receive a general tax planning review before a proposal is sent. Confirm the primary pain point, request the tax return, and use the selected opportunities to frame the discovery call.`;
}

function buildStrategyText(lead: Lead, selectedOpportunities: Opportunity[]) {
  const name = getFullName(lead);
  const priorityScore = getPriorityScore(lead, selectedOpportunities);
  const projectedAnnualRevenue = getProjectedAnnualRevenue(lead, selectedOpportunities);

  return `UNITY TAX STRATEGY OUTLINE

Prepared For:
${name}

Planning Profile:
- Household Income: ${lead.household_income || "Not provided"}
- Investable Assets: ${lead.investable_assets || "Not provided"}
- Mission Control Score: ${lead.lead_score ?? 0}
- Strategy Priority Score: ${priorityScore}
- Projected Annual Revenue: ${formatCurrency(projectedAnnualRevenue)}
- Current Status: ${lead.status || "new"}
- Primary Concern: ${lead.biggest_tax_concern || "Not provided"}

AI Executive Recommendation:
${getExecutiveRecommendation(lead, selectedOpportunities)}

Executive Summary:
Based on the Unity Tax Opportunity Assessment™, ${name} may have several planning areas worth reviewing. This outline is preliminary and should be confirmed through a deeper document review, CPA coordination, and a formal planning engagement.

Selected Planning Opportunities:

${selectedOpportunities
  .map(
    (opportunity, index) => `${index + 1}. ${opportunity.title}
Category: ${opportunity.category}
Confidence: ${opportunity.confidence}%
Estimated Savings Potential: ${opportunity.estimatedSavings}

Why This May Matter:
${opportunity.reason}

Questions to Ask:
${opportunity.questions.map((question) => `- ${question}`).join("\n")}

Documents to Request:
${opportunity.documents.map((document) => `- ${document}`).join("\n")}
`,
  )
  .join("\n")}

Recommended Next Steps:
1. Confirm the prospect's primary goal and timeline.
2. Request the documents listed above.
3. Review the prior-year tax return and current-year income estimate.
4. Coordinate with the prospect's CPA or tax professional where appropriate.
5. Determine whether a formal tax strategy engagement is appropriate.

Important Notice:
This strategy outline is preliminary and for internal planning discussion only. It is not tax, legal, accounting, investment, or financial advice. No tax savings or outcome is guaranteed.`;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function makeSafeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "strategy";
}

export default function StrategyBuilderPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [strategyQueue, setStrategyQueue] = useState<StrategyQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  async function loadLeads(showToast = false) {
    setIsRefreshing(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      setLeads(data as Lead[]);

      if (data.length > 0 && !selectedLeadId) {
        setSelectedLeadId(data[0].id);
      }

      if (showToast) showToastMessage("Strategy data refreshed.");
    } else if (error) {
      console.error(error);
      if (showToast) showToastMessage("Could not refresh strategy data.");
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const storedQueue = window.localStorage.getItem("unity_strategy_queue");
      if (storedQueue) {
        setStrategyQueue(JSON.parse(storedQueue) as StrategyQueueItem[]);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;

  const opportunities = useMemo(
    () => (selectedLead ? getOpportunities(selectedLead) : []),
    [selectedLead],
  );

  useEffect(() => {
    setSelectedTitles(opportunities.slice(0, 3).map((item) => item.title));
  }, [selectedLeadId, opportunities]);

  const selectedOpportunities = opportunities.filter((opportunity) =>
    selectedTitles.includes(opportunity.title),
  );

  const strategyText = selectedLead
    ? buildStrategyText(selectedLead, selectedOpportunities)
    : "";

  const priorityScore = getPriorityScore(selectedLead, selectedOpportunities);
  const projectedAnnualRevenue = getProjectedAnnualRevenue(selectedLead, selectedOpportunities);
  const executiveRecommendation = getExecutiveRecommendation(selectedLead, selectedOpportunities);
  const topOpportunity = selectedOpportunities[0] || opportunities[0] || null;

  function showToastMessage(message: string) {
    const id = Date.now();
    setToast({ id, message });

    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2400);
  }

  function toggleOpportunity(title: string) {
    setSelectedTitles((current) => {
      const next = current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title];

      return next;
    });
  }

  async function copyStrategy() {
    if (!strategyText) return;
    await navigator.clipboard.writeText(strategyText);
    showToastMessage("Strategy outline copied.");
  }

  async function copyExecutiveBrief() {
    if (!selectedLead) return;

    const brief = `${getFullName(selectedLead)} | Priority ${priorityScore}/100 | ${formatCurrency(
      projectedAnnualRevenue,
    )} projected annual revenue\n\n${executiveRecommendation}`;

    await navigator.clipboard.writeText(brief);
    showToastMessage("Executive brief copied.");
  }

  function exportStrategy() {
    if (!selectedLead || !strategyText) return;
    downloadTextFile(`${makeSafeFilename(getFullName(selectedLead))}-unity-tax-strategy.txt`, strategyText);
    showToastMessage("Strategy outline exported.");
  }

  function queueStrategy() {
    if (!selectedLead) return;

    const nextItem: StrategyQueueItem = {
      id: `${selectedLead.id}-${Date.now()}`,
      leadName: getFullName(selectedLead),
      score: priorityScore,
      projectedAnnualRevenue,
      opportunityCount: selectedOpportunities.length,
      createdAt: new Date().toISOString(),
    };

    const nextQueue = [nextItem, ...strategyQueue].slice(0, 8);
    setStrategyQueue(nextQueue);
    window.localStorage.setItem("unity_strategy_queue", JSON.stringify(nextQueue));
    showToastMessage("Strategy added to queue.");
  }

  function clearQueue() {
    setStrategyQueue([]);
    window.localStorage.removeItem("unity_strategy_queue");
    showToastMessage("Strategy queue cleared.");
  }

  const actionButtonsDisabled = !selectedLead || selectedOpportunities.length === 0;

  return (
    <div className="min-h-screen">
      <Header
        title="Strategy Builder"
        subtitle="Turn opportunity analysis into a clean planning outline."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {toast && (
          <div className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-400/30 bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-2xl shadow-black/40">
            <Check className="h-5 w-5 text-emerald-300" />
            {toast.message}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            Loading strategy builder...
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Strategy Builder
            </p>
            <h1 className="mt-3 text-3xl font-black text-white">No assessments available yet.</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-400">
              Strategy Builder turns assessment data into planning outlines. Once leads begin completing the Unity Tax Opportunity Assessment™, this page will prioritize them and generate internal strategy briefs.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/mission-control/assessments"
                className="rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
              >
                Open Assessments
              </Link>
              <button
                type="button"
                onClick={() => loadLeads(true)}
                className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-black text-white hover:bg-slate-800"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <>
            <section className="mb-6 overflow-hidden rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-5 shadow-2xl shadow-blue-950/20 sm:p-7">
              <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr] xl:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                    <Sparkles className="h-4 w-4" />
                    Unity Tax Strategy Builder™
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                    Build a strategy outline from assessment data.
                  </h1>

                  <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-300 sm:text-lg sm:leading-8">
                    Select a prospect, choose relevant opportunities, and generate a structured planning outline for discovery calls, internal prep, proposals, or client-facing follow-up.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/80 p-4">
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Select Prospect
                  </label>

                  <select
                    value={selectedLeadId}
                    onChange={(event) => setSelectedLeadId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm font-black text-white outline-none focus:border-blue-400 sm:px-5"
                  >
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {getFullName(lead)} · Score {lead.lead_score ?? 0}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-black text-slate-400">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="uppercase tracking-[0.16em] text-slate-500">Loaded</p>
                      <p className="mt-1 text-lg text-white">{leads.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="uppercase tracking-[0.16em] text-slate-500">Selected</p>
                      <p className="mt-1 text-lg text-white">{selectedOpportunities.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {selectedLead && (
              <>
                <section className="mb-6 grid gap-4 lg:grid-cols-3">
                  <article className="rounded-[1.75rem] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                        Priority Score
                      </p>
                      <Target className="h-5 w-5 text-emerald-200" />
                    </div>
                    <p className="mt-4 text-4xl font-black text-white">{priorityScore}</p>
                    <p className="mt-2 text-sm font-bold text-emerald-100">
                      {getPriorityLabel(priorityScore)}
                    </p>
                  </article>

                  <article className="rounded-[1.75rem] border border-blue-400/30 bg-blue-400/10 p-5 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                        Projected Annual Revenue
                      </p>
                      <TrendingUp className="h-5 w-5 text-blue-200" />
                    </div>
                    <p className="mt-4 text-4xl font-black text-white">
                      {formatCurrency(projectedAnnualRevenue)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-blue-100">
                      Internal estimate for prioritization.
                    </p>
                  </article>

                  <article className="rounded-[1.75rem] border border-violet-400/30 bg-violet-400/10 p-5 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                        Best Opening Angle
                      </p>
                      <Brain className="h-5 w-5 text-violet-200" />
                    </div>
                    <p className="mt-4 text-xl font-black text-white">
                      {topOpportunity?.title || "General Review"}
                    </p>
                    <p className="mt-2 text-sm font-bold text-violet-100">
                      {topOpportunity?.category || "Core Planning"}
                    </p>
                  </article>
                </section>

                <section className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-4xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                        <Brain className="h-4 w-4" />
                        AI Executive Recommendation
                      </div>
                      <p className="mt-4 text-base font-bold leading-7 text-slate-200 sm:text-lg sm:leading-8">
                        {executiveRecommendation}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[23rem] xl:grid-cols-1">
                      <button
                        type="button"
                        onClick={copyExecutiveBrief}
                        disabled={actionButtonsDisabled}
                        className="rounded-2xl border border-blue-400/30 bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Copy Executive Brief
                      </button>
                      <button
                        type="button"
                        onClick={queueStrategy}
                        disabled={actionButtonsDisabled}
                        className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Add to Strategy Queue
                      </button>
                    </div>
                  </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <section className="space-y-6">
                    <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-3">
                          <UserRound className="h-6 w-6 text-blue-200" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                            Prospect
                          </p>
                          <h2 className="mt-2 truncate text-2xl font-black text-white sm:text-3xl">
                            {getFullName(selectedLead)}
                          </h2>
                          <p className="mt-2 text-sm font-medium text-slate-400">
                            {selectedLead.email || "No email on file"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Score
                          </p>
                          <p className="mt-2 font-black text-white">
                            {selectedLead.lead_score ?? 0}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Income
                          </p>
                          <p className="mt-2 text-sm font-black text-white">
                            {selectedLead.household_income || "—"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Assets
                          </p>
                          <p className="mt-2 text-sm font-black text-white">
                            {selectedLead.investable_assets || "—"}
                          </p>
                        </div>
                      </div>

                      {selectedLead.biggest_tax_concern && (
                        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                            Primary Tax Concern
                          </p>
                          <p className="mt-2 text-sm font-bold leading-6 text-slate-200">
                            {selectedLead.biggest_tax_concern}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Link
                          href="/mission-control/assessments"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                        >
                          Review Assessments
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                        {selectedLead.email ? (
                          <a
                            href={`mailto:${selectedLead.email}`}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-black text-white hover:bg-slate-800"
                          >
                            Email Prospect
                            <Mail className="h-4 w-4" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={copyExecutiveBrief}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-black text-white hover:bg-slate-800"
                          >
                            Copy Profile
                            <Clipboard className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </article>

                    <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                      <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                        Select Opportunities
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                        Choose the opportunities to include in the generated strategy outline. The top three are selected by default.
                      </p>

                      <div className="mt-5 space-y-3">
                        {opportunities.map((opportunity) => {
                          const isSelected = selectedTitles.includes(opportunity.title);

                          return (
                            <button
                              key={opportunity.title}
                              type="button"
                              onClick={() => toggleOpportunity(opportunity.title)}
                              className={`w-full rounded-2xl border p-4 text-left transition sm:p-5 ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950/20"
                                  : "border-slate-800 bg-slate-900 hover:border-blue-500"
                              }`}
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                    {opportunity.category} · {opportunity.confidence}% confidence
                                  </p>

                                  <h3 className="mt-2 text-lg font-black text-white">
                                    {opportunity.title}
                                  </h3>

                                  <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                                    {opportunity.reason}
                                  </p>
                                </div>

                                <span
                                  className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                                    isSelected
                                      ? "bg-emerald-500 text-white"
                                      : "bg-slate-800 text-slate-400"
                                  }`}
                                >
                                  {isSelected ? "Selected" : "Add"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </article>

                    <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">
                            Strategy Queue
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-400">
                            Local queue for outlines that need follow-up.
                          </p>
                        </div>
                        {strategyQueue.length > 0 && (
                          <button
                            type="button"
                            onClick={clearQueue}
                            className="rounded-full border border-slate-700 px-3 py-2 text-xs font-black text-slate-300 hover:bg-slate-900"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="mt-5 space-y-3">
                        {strategyQueue.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-sm font-bold text-slate-500">
                            No strategies queued yet.
                          </div>
                        ) : (
                          strategyQueue.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-black text-white">{item.leadName}</p>
                                  <p className="mt-1 text-xs font-bold text-slate-500">
                                    {item.opportunityCount} opportunities · Score {item.score}
                                  </p>
                                </div>
                                <p className="text-sm font-black text-emerald-300">
                                  {formatCurrency(item.projectedAnnualRevenue)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </article>
                  </section>

                  <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                          Strategy Outline
                        </p>

                        <h2 className="mt-3 text-2xl font-black text-white">
                          Draft planning summary
                        </h2>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
                        <button
                          type="button"
                          onClick={copyStrategy}
                          disabled={actionButtonsDisabled}
                          className="rounded-2xl bg-blue-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={exportStrategy}
                          disabled={actionButtonsDisabled}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </button>
                        <button
                          type="button"
                          onClick={() => loadLeads(true)}
                          disabled={isRefreshing}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Refresh
                        </button>
                      </div>
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <FileText className="h-5 w-5 text-blue-200" />
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Format
                        </p>
                        <p className="mt-1 text-sm font-black text-white">Internal outline</p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <ShieldCheck className="h-5 w-5 text-emerald-200" />
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Compliance
                        </p>
                        <p className="mt-1 text-sm font-black text-white">Preliminary only</p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <Target className="h-5 w-5 text-violet-200" />
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Focus
                        </p>
                        <p className="mt-1 text-sm font-black text-white">
                          {selectedOpportunities.length} opportunities
                        </p>
                      </div>
                    </div>

                    <div className="max-h-[820px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-medium leading-7 text-slate-300 sm:p-6">
                      {strategyText}
                    </div>
                  </section>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
