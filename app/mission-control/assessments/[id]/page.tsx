"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/mission-control/Header";
import AdvisorNotes from "@/components/mission-control/AdvisorNotes";
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

  business_owner?: boolean | null;
  retiring_soon?: boolean | null;
  charitable_giving?: boolean | null;
  current_advisor?: boolean | null;
  current_cpa?: boolean | null;
  upcoming_sale?: boolean | null;
};

type Toast = {
  id: number;
  message: string;
};

const pipelineStages = [
  { label: "New", value: "new" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Contacted", value: "contacted" },
  { label: "Discovery", value: "discovery" },
  { label: "Proposal", value: "proposal" },
  { label: "Client", value: "client" },
];

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

  if (value >= 130)
    return "border-violet-500/40 bg-violet-500/10 text-violet-300";
  if (value >= 100)
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  if (value >= 70) return "border-blue-500/40 bg-blue-500/10 text-blue-300";
  if (value >= 40)
    return "border-orange-500/40 bg-orange-500/10 text-orange-300";
  return "border-slate-700 bg-slate-900 text-slate-300";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPlanningSignals(lead: Lead) {
  const signals: string[] = [];

  if (lead.business_owner) signals.push("Business owner");
  if (lead.retiring_soon) signals.push("Retirement planning");
  if (lead.charitable_giving) signals.push("Charitable giving");
  if (lead.upcoming_sale) signals.push("Sale or liquidity event");
  if (lead.current_cpa) signals.push("Has CPA");
  if (lead.current_advisor) signals.push("Has financial advisor");

  if (signals.length === 0) signals.push("Review assessment details");

  return signals;
}

function getLikelyOpportunities(lead: Lead) {
  const opportunities: string[] = [];

  if (lead.business_owner) {
    opportunities.push("Entity structure review");
    opportunities.push("Retirement plan design");
    opportunities.push("Business cash-flow tax planning");
  }

  if (lead.upcoming_sale) {
    opportunities.push("Capital gains planning");
    opportunities.push("Pre-sale tax strategy");
  }

  if (lead.retiring_soon) {
    opportunities.push("Roth conversion planning");
    opportunities.push("RMD and income sequencing");
  }

  if (lead.charitable_giving) {
    opportunities.push("Donor-advised fund review");
    opportunities.push("Appreciated asset giving");
  }

  if ((lead.investable_assets || "").includes("$1M")) {
    opportunities.push("Investment tax efficiency");
  }

  if (opportunities.length === 0) {
    opportunities.push("Income tax planning");
    opportunities.push("Investment tax efficiency");
    opportunities.push("CPA coordination");
  }

  return Array.from(new Set(opportunities)).slice(0, 6);
}

function getProjectedAnnualRevenue(score: number | null) {
  const value = score ?? 0;

  if (value >= 130) return { label: "$6,500+", value: 6500 };
  if (value >= 100) return { label: "$3,500 - $6,500", value: 5000 };
  if (value >= 70) return { label: "$995 - $3,500", value: 2500 };
  if (value >= 40) return { label: "$995 review", value: 995 };
  return { label: "Nurture", value: 0 };
}

function getNextBestAction(lead: Lead) {
  const score = lead.lead_score ?? 0;

  if (score >= 130) return "Call today and prepare a strategy agenda before the first conversation.";
  if (score >= 100) return "Move to reviewing, confirm urgency, and schedule a discovery call within 24 hours.";
  if (score >= 70) return "Send a tailored follow-up and qualify timing, CPA involvement, and decision urgency.";
  if (score >= 40) return "Review the assessment and place into nurture unless a clear trigger event exists.";
  return "Add to nurture and watch for a future liquidity, retirement, or income-change trigger.";
}

function getExecutiveRecommendation(lead: Lead, signals: string[], opportunities: string[]) {
  const score = lead.lead_score ?? 0;
  const name = getFullName(lead);
  const topOpportunity = opportunities[0] || "tax planning review";
  const topSignal = signals[0] || "assessment details";

  if (score >= 130) {
    return `${name} should be treated as a same-day priority. The strongest signal is ${topSignal.toLowerCase()}, and the first strategy angle should be ${topOpportunity.toLowerCase()}.`;
  }

  if (score >= 100) {
    return `${name} appears qualified for a consult. Lead with ${topOpportunity.toLowerCase()}, then confirm timing, CPA involvement, and willingness to act.`;
  }

  if (score >= 70) {
    return `${name} is worth follow-up, but needs qualification. Use the assessment concern to uncover urgency before investing heavy strategy time.`;
  }

  if (score >= 40) {
    return `${name} needs a quick review before prioritizing. Look for a hidden tax event, liquidity event, retirement date, or business-owner complexity.`;
  }

  return `${name} should remain in nurture unless the assessment reveals an urgent planning trigger that is not reflected in the score.`;
}

function sanitizeCsvValue(value: string | number | null | undefined) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number | null | undefined>>) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(sanitizeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => sanitizeCsvValue(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getLeadBrief(lead: Lead, signals: string[], opportunities: string[]) {
  const projectedRevenue = getProjectedAnnualRevenue(lead.lead_score);

  return [
    `Unity Tax Assessment Brief`,
    `Name: ${getFullName(lead)}`,
    `Email: ${lead.email || "—"}`,
    `Phone: ${lead.phone || "—"}`,
    `Status: ${lead.status || "new"}`,
    `Priority Score: ${lead.lead_score ?? 0}`,
    `Grade: ${lead.lead_grade || "—"}`,
    `Projected Annual Revenue: ${projectedRevenue.label}`,
    `Household Income: ${lead.household_income || "—"}`,
    `Investable Assets: ${lead.investable_assets || "—"}`,
    `Planning Signals: ${signals.join(", ")}`,
    `Likely Opportunities: ${opportunities.join(", ")}`,
    `Primary Concern: ${lead.biggest_tax_concern || "No concern summary provided."}`,
    `Next Best Action: ${getNextBestAction(lead)}`,
  ].join("\n");
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const id = String(params.id || "");

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string) => {
    const nextToast = { id: Date.now(), message };
    setToast(nextToast);

    window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast?.id === nextToast.id ? null : currentToast,
      );
    }, 2600);
  }, []);

  const loadLead = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setLead(data as Lead);
    }

    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  async function updateStatus(nextStatus: string) {
    if (!lead) return;

    setIsUpdatingStatus(true);
    setStatusMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({ status: nextStatus })
      .eq("id", lead.id);

    if (error) {
      console.error(error);
      setStatusMessage("Status could not be updated. Please try again.");
      showToast("Status update failed.");
      setIsUpdatingStatus(false);
      return;
    }

    setLead({ ...lead, status: nextStatus });
    setStatusMessage(`Status updated to ${nextStatus}.`);
    showToast(`Status updated to ${nextStatus}.`);
    setIsUpdatingStatus(false);
  }

  const signals = useMemo(() => (lead ? getPlanningSignals(lead) : []), [lead]);

  const opportunities = useMemo(
    () => (lead ? getLikelyOpportunities(lead) : []),
    [lead],
  );

  const projectedRevenue = useMemo(
    () => (lead ? getProjectedAnnualRevenue(lead.lead_score) : { label: "—", value: 0 }),
    [lead],
  );

  const executiveRecommendation = useMemo(
    () => (lead ? getExecutiveRecommendation(lead, signals, opportunities) : ""),
    [lead, opportunities, signals],
  );

  const nextBestAction = useMemo(
    () => (lead ? getNextBestAction(lead) : ""),
    [lead],
  );

  const leadBrief = useMemo(
    () => (lead ? getLeadBrief(lead, signals, opportunities) : ""),
    [lead, opportunities, signals],
  );

  async function copyToClipboard(text: string, message: string) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
    } catch {
      showToast("Copy failed. Your browser may be blocking clipboard access.");
    }
  }

  function exportAssessment() {
    if (!lead) return;

    downloadCsv(`assessment-${lead.id}.csv`, [
      {
        id: lead.id,
        created_at: lead.created_at,
        name: getFullName(lead),
        email: lead.email,
        phone: lead.phone,
        status: lead.status || "new",
        lead_score: lead.lead_score ?? 0,
        lead_grade: lead.lead_grade || "",
        projected_annual_revenue: projectedRevenue.label,
        projected_annual_revenue_value: projectedRevenue.value,
        household_income: lead.household_income,
        investable_assets: lead.investable_assets,
        business_owner: lead.business_owner ? "yes" : "no",
        retiring_soon: lead.retiring_soon ? "yes" : "no",
        charitable_giving: lead.charitable_giving ? "yes" : "no",
        upcoming_sale: lead.upcoming_sale ? "yes" : "no",
        current_cpa: lead.current_cpa ? "yes" : "no",
        current_advisor: lead.current_advisor ? "yes" : "no",
        planning_signals: signals.join(", "),
        likely_opportunities: opportunities.join(", "),
        biggest_tax_concern: lead.biggest_tax_concern,
        next_best_action: nextBestAction,
      },
    ]);

    showToast("Assessment exported.");
  }

  function saveHandoff(destination: "strategy-builder" | "client-copilot" | "opportunity-engine") {
    if (!lead) return;

    const payload = {
      source: "assessment-detail",
      destination,
      id: lead.id,
      name: getFullName(lead),
      email: lead.email,
      phone: lead.phone,
      status: lead.status || "new",
      priorityScore: lead.lead_score ?? 0,
      grade: lead.lead_grade || "",
      projectedAnnualRevenue: projectedRevenue.label,
      householdIncome: lead.household_income || "",
      investableAssets: lead.investable_assets || "",
      concern: lead.biggest_tax_concern || "",
      signals,
      opportunities,
      executiveRecommendation,
      nextBestAction,
      createdAt: lead.created_at,
    };

    window.localStorage.setItem("unity-tax-assessment-handoff", JSON.stringify(payload));
    showToast("Assessment brief queued for handoff.");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Assessment Detail" subtitle="Loading assessment..." />

        <div className="px-6 py-8 lg:px-10">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            Loading assessment...
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen">
        <Header
          title="Assessment Not Found"
          subtitle="This record could not be loaded."
        />

        <div className="px-6 py-8 lg:px-10">
          <Link
            href="/mission-control/assessments"
            className="inline-flex rounded-2xl bg-blue-600 px-6 py-4 font-black text-white hover:bg-blue-500"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = lead.status || "new";
  const opportunityLabel = getOpportunityLabel(lead.lead_score);
  const opportunityTone = getOpportunityTone(lead.lead_score);
  const priorityScore = lead.lead_score ?? 0;
  const mailHref = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent(
        "Unity Tax Planning Assessment",
      )}&body=${encodeURIComponent(
        `Hi ${lead.first_name || getFullName(lead)},\n\nThank you for completing the Unity Tax Planning assessment. I reviewed your information and would like to schedule a short call to walk through the opportunities that may apply to your situation.\n\nBest,\nUnity Tax Planning`,
      )}`
    : "";
  const phoneHref = lead.phone ? `tel:${lead.phone}` : "";

  return (
    <div className="min-h-screen">
      <Header
        title={getFullName(lead)}
        subtitle="Assessment profile, planning signals, advisor notes, and next actions."
      />

      {toast && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-blue-500/30 bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-2xl shadow-black/40">
          {toast.message}
        </div>
      )}

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Link
            href="/mission-control/assessments"
            className="inline-flex rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
          >
            ← Back to Assessment Center
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => copyToClipboard(leadBrief, "Assessment brief copied.")}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
            >
              Copy Brief
            </button>

            <button
              type="button"
              onClick={exportAssessment}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
            >
              Export CSV
            </button>

            <button
              type="button"
              onClick={loadLead}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-6 shadow-2xl shadow-blue-950/20 md:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                AI Executive Recommendation
              </p>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
                {opportunityLabel} assessment requiring {priorityScore >= 100 ? "fast follow-up" : "advisor review"}.
              </h1>

              <p className="mt-5 max-w-4xl text-base font-medium leading-8 text-slate-300 md:text-lg">
                {executiveRecommendation}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {mailHref ? (
                  <a
                    href={mailHref}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                  >
                    Email Prospect
                  </a>
                ) : (
                  <span className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-black text-slate-600">
                    No Email
                  </span>
                )}

                {phoneHref ? (
                  <a
                    href={phoneHref}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-black text-emerald-300 transition hover:border-emerald-400 hover:text-emerald-200"
                  >
                    Call Prospect
                  </a>
                ) : (
                  <span className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-black text-slate-600">
                    No Phone
                  </span>
                )}

                <Link
                  href="/mission-control/strategy-builder"
                  onClick={() => saveHandoff("strategy-builder")}
                  className="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-black text-violet-300 transition hover:border-violet-400 hover:text-violet-200"
                >
                  Send to Strategy Builder
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Priority Score
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-5xl font-black text-white">{priorityScore}</p>
                  <span
                    className={`mb-1 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${opportunityTone}`}
                  >
                    {opportunityLabel}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Projected Annual Revenue
                </p>
                <p className="mt-3 text-3xl font-black text-white">
                  {projectedRevenue.label}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  Heuristic estimate based on score and opportunity profile.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Next Best Action
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-300">
                  {nextBestAction}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Pipeline Status
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Move this prospect through the workflow
              </h2>
            </div>

            {statusMessage && (
              <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-300">
                {statusMessage}
              </p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {pipelineStages.map((stage) => {
              const isActive = currentStatus === stage.value;

              return (
                <button
                  key={stage.value}
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => updateStatus(stage.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isActive
                      ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:border-blue-500 hover:text-white"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em]">
                    Stage
                  </p>
                  <p className="mt-2 text-base font-black">{stage.label}</p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                    Strategy Brief
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-white">
                    Suggested review focus
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(executiveRecommendation, "Recommendation copied.")}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
                >
                  Copy Recommendation
                </button>
              </div>

              <p className="mt-4 text-base font-medium leading-8 text-slate-400">
                This prospect appears to be a{" "}
                <span className="font-black text-white">
                  {opportunityLabel.toLowerCase()}
                </span>{" "}
                planning opportunity based on score, financial profile, and
                selected planning topics. Review the highlighted signals first,
                then confirm timing, CPA involvement, and whether there is an
                upcoming tax event.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {signals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-black text-white"
                  >
                    <span className="mr-2 text-blue-300">✓</span>
                    {signal}
                  </div>
                ))}
              </div>
            </article>

            <AdvisorNotes leadId={lead.id} />

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                    Assessment Summary
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-white">
                    Tax concern and context
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      lead.biggest_tax_concern || "No assessment summary provided.",
                      "Assessment summary copied.",
                    )
                  }
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
                >
                  Copy Summary
                </button>
              </div>

              <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm font-medium leading-7 text-slate-300">
                {lead.biggest_tax_concern || "No assessment summary provided."}
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                Likely Planning Opportunities
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <p className="font-black text-white">{opportunity}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Review applicability, timing, tax professional
                      coordination, and implementation complexity.
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-6">
            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                One-Click Actions
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/mission-control/client-copilot"
                  onClick={() => saveHandoff("client-copilot")}
                  className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-sm font-black text-blue-300 transition hover:border-blue-400 hover:text-blue-200"
                >
                  Send to Client Copilot
                </Link>

                <Link
                  href="/mission-control/opportunity-engine"
                  onClick={() => saveHandoff("opportunity-engine")}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-black text-emerald-300 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  Open in Opportunity Engine
                </Link>

                <Link
                  href="/mission-control/strategy-builder"
                  onClick={() => saveHandoff("strategy-builder")}
                  className="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-4 text-sm font-black text-violet-300 transition hover:border-violet-400 hover:text-violet-200"
                >
                  Build Strategy
                </Link>

                <button
                  type="button"
                  onClick={() => copyToClipboard(leadBrief, "Full assessment brief copied.")}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-left text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
                >
                  Copy Full Brief
                </button>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Contact
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Name
                  </p>
                  <p className="mt-1 font-black text-white">
                    {getFullName(lead)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 break-words font-bold text-slate-300">
                    {lead.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Phone
                  </p>
                  <p className="mt-1 font-bold text-slate-300">
                    {lead.phone || "—"}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-300">
                Financial Snapshot
              </p>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Household Income
                  </p>
                  <p className="mt-2 font-black text-white">
                    {lead.household_income || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Investable Assets
                  </p>
                  <p className="mt-2 font-black text-white">
                    {lead.investable_assets || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Submitted
                  </p>
                  <p className="mt-2 font-black text-white">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                Suggested Next Actions
              </p>

              <div className="mt-5 space-y-3">
                {[
                  nextBestAction,
                  "Review full assessment summary",
                  "Identify top three planning opportunities",
                  "Confirm CPA and advisor involvement",
                  "Prepare first-call agenda",
                ].map((task) => (
                  <div
                    key={task}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold leading-6 text-slate-300"
                  >
                    {task}
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  );
}
