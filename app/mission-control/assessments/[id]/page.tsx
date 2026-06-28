"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  business_owner?: boolean | null;
  retiring_soon?: boolean | null;
  charitable_giving?: boolean | null;
  current_advisor?: boolean | null;
  current_cpa?: boolean | null;
  upcoming_sale?: boolean | null;
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

  if (value >= 130) return "border-violet-500/40 bg-violet-500/10 text-violet-300";
  if (value >= 100) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  if (value >= 70) return "border-blue-500/40 bg-blue-500/10 text-blue-300";
  if (value >= 40) return "border-orange-500/40 bg-orange-500/10 text-orange-300";
  return "border-slate-700 bg-slate-900 text-slate-300";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

function getPipelineEstimate(score: number | null) {
  const value = score ?? 0;

  if (value >= 130) return "$6,500+";
  if (value >= 100) return "$3,500 - $6,500";
  if (value >= 70) return "$995 - $3,500";
  if (value >= 40) return "Review needed";
  return "Nurture";
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const id = String(params.id || "");

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadLead() {
      const { data, error } = await supabase
        .from("tax_leads")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setLead(data as Lead);
      }

      setIsLoading(false);
    }

    if (id) {
      loadLead();
    }
  }, [id]);

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
      setIsUpdatingStatus(false);
      return;
    }

    setLead({ ...lead, status: nextStatus });
    setStatusMessage(`Status updated to ${nextStatus}.`);
    setIsUpdatingStatus(false);
  }

  const signals = useMemo(() => (lead ? getPlanningSignals(lead) : []), [lead]);

  const opportunities = useMemo(
    () => (lead ? getLikelyOpportunities(lead) : []),
    [lead],
  );

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

  return (
    <div className="min-h-screen">
      <Header
        title={getFullName(lead)}
        subtitle="Assessment profile, planning signals, and next actions."
      />

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          <Link
            href="/mission-control/assessments"
            className="inline-flex rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
          >
            ← Back to Assessment Center
          </Link>
        </div>

        <section className="mb-8 rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-7 shadow-2xl shadow-blue-950/20">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Mission Control Score
              </p>

              <div className="mt-4 flex flex-wrap items-end gap-4">
                <p className="text-6xl font-black tracking-tight text-white">
                  {lead.lead_score ?? 0}
                </p>

                <span
                  className={`mb-2 rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.16em] ${opportunityTone}`}
                >
                  {opportunityLabel}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-300">
                Estimated planning revenue potential:{" "}
                <span className="font-black text-white">
                  {getPipelineEstimate(lead.lead_score)}
                </span>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 text-lg font-black capitalize text-white">
                  {currentStatus}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Submitted
                </p>
                <p className="mt-2 text-sm font-black text-white">
                  {formatDate(lead.created_at)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Grade
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {lead.lead_grade || "—"}
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
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                AI Executive Summary
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Suggested review focus
              </h2>

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

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Assessment Summary
              </p>

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
                  <p className="mt-1 font-bold text-slate-300">
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
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                Suggested Next Actions
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Review full assessment summary",
                  "Identify top three planning opportunities",
                  "Follow up within 24 hours",
                  "Confirm CPA and advisor involvement",
                  "Prepare first-call agenda",
                ].map((task) => (
                  <div
                    key={task}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300"
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