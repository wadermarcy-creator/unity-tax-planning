"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AssessmentsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadLeads() {
      const { data, error } = await supabase
        .from("tax_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        setLeads(data as Lead[]);
      }

      setIsLoading(false);
    }

    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    if (filter === "all") return leads;

    if (filter === "qualified") {
      return leads.filter((lead) => (lead.lead_score ?? 0) >= 100);
    }

    return leads.filter((lead) => lead.status === filter);
  }, [filter, leads]);

  const counts = useMemo(() => {
    return {
      all: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      qualified: leads.filter((lead) => (lead.lead_score ?? 0) >= 100).length,
    };
  }, [leads]);

  return (
    <div className="min-h-screen">
      <Header
        title="Assessment Center"
        subtitle="Review, prioritize, and convert new tax planning opportunities."
      />

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Total
            </p>
            <p className="mt-4 text-4xl font-black text-white">{counts.all}</p>
            <p className="mt-3 text-sm font-medium text-slate-400">
              All submitted assessments
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
              New
            </p>
            <p className="mt-4 text-4xl font-black text-white">{counts.new}</p>
            <p className="mt-3 text-sm font-medium text-slate-400">
              Awaiting initial review
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
              Qualified
            </p>
            <p className="mt-4 text-4xl font-black text-white">
              {counts.qualified}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-400">
              High or exceptional planning potential
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { label: "All", value: "all" },
            { label: "New", value: "new" },
            { label: "Qualified", value: "qualified" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                filter === item.value
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-slate-800 bg-slate-950 text-slate-400 hover:border-blue-500 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            Loading assessments...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            No assessments match this filter.
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20 transition hover:border-blue-500/60"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black text-white">
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

                    <p className="mt-3 text-sm font-medium text-slate-400">
                      {lead.email || "No email"} · {lead.phone || "No phone"}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
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

                    <p className="mt-5 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                      {lead.biggest_tax_concern || "No concern summary provided."}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3">
                    <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      {formatDate(lead.created_at)}
                    </p>

                    <Link
                      href={`/mission-control/assessments/${lead.id}`}
                      className="rounded-2xl bg-blue-600 px-6 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                    >
                      Open Assessment
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}