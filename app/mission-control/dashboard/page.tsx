"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/mission-control/Header";
import StatCard from "@/components/mission-control/StatCard";
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

function getPlanningOpportunity(lead: Lead) {
  const score = lead.lead_score ?? 0;

  if (score >= 130) return "Exceptional";
  if (score >= 100) return "High";
  if (score >= 70) return "Moderate";
  if (score >= 40) return "Developing";
  return "Nurture";
}

function getFullName(lead: Lead) {
  return `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed";
}

export default function MissionControlDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      const { data, error } = await supabase
        .from("tax_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!error && data) {
        setLeads(data as Lead[]);
      }

      setIsLoading(false);
    }

    loadLeads();
  }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((lead) => lead.status === "new").length;
    const exceptional = leads.filter(
      (lead) => getPlanningOpportunity(lead) === "Exceptional",
    ).length;
    const high = leads.filter(
      (lead) => getPlanningOpportunity(lead) === "High",
    ).length;

    return {
      total,
      newLeads,
      qualified: exceptional + high,
      pipelineValue: (exceptional * 6500 + high * 3500).toLocaleString(),
    };
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="min-h-screen">
      <Header
        title="Mission Control"
        subtitle="Here is what needs your attention today."
      />

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-8 rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-7 shadow-2xl shadow-blue-950/20">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-300">
            Morning Brief
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Good to see you, Wade.
          </h1>

          <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-300">
            {stats.newLeads > 0
              ? `${stats.newLeads} new assessment${
                  stats.newLeads === 1 ? "" : "s"
                } need review. ${stats.qualified} appear to be strong planning opportunities.`
              : "No new assessments need review right now. Mission Control is standing by."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Assessments"
            value={String(stats.total)}
            detail="Recent assessment activity"
            trend="Live"
            tone="blue"
          />

          <StatCard
            label="New"
            value={String(stats.newLeads)}
            detail="Need initial review"
            trend="Review"
            tone="orange"
          />

          <StatCard
            label="Qualified"
            value={String(stats.qualified)}
            detail="High or exceptional planning potential"
            trend="Priority"
            tone="green"
          />

          <StatCard
            label="Pipeline"
            value={`$${stats.pipelineValue}`}
            detail="Estimated planning revenue potential"
            trend="Estimate"
            tone="purple"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                  Recent Assessments
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Assessment Queue
                </h2>
              </div>

              <Link
                href="/admin/leads"
                className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white"
              >
                View Current Leads →
              </Link>
            </div>

            {isLoading ? (
              <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
                Loading assessments...
              </p>
            ) : recentLeads.length === 0 ? (
              <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
                No assessments yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/60"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-black text-white">
                            {getFullName(lead)}
                          </h3>

                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                            {getPlanningOpportunity(lead)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-medium text-slate-400">
                          {lead.email || "No email"} ·{" "}
                          {lead.household_income || "Income not provided"} ·{" "}
                          {lead.investable_assets || "Assets not provided"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-black text-slate-300">
                          Score {lead.lead_score ?? 0}
                        </span>

                        <Link
                          href="/admin/leads"
                          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                AI Recommendations
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Today&apos;s Priority
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                {recentLeads[0]
                  ? `${getFullName(
                      recentLeads[0],
                    )} should be reviewed first based on recency and planning potential.`
                  : "Once assessments begin arriving, Mission Control will surface the highest-priority opportunities here."}
              </p>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm font-black text-white">
                  Suggested next action
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Review the assessment, identify likely planning opportunities,
                  then follow up within 24 hours.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Quick Actions
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/tax-opportunity-scan"
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 font-black text-white transition hover:border-blue-500"
                >
                  Open Assessment
                </Link>

                <Link
                  href="/admin/leads"
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 font-black text-white transition hover:border-blue-500"
                >
                  Review Leads
                </Link>

                <Link
                  href="/example-plans"
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 font-black text-white transition hover:border-blue-500"
                >
                  View Sample Reports
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}