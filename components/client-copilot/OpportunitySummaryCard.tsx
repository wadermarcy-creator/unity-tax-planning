"use client";

import { Brain, Lightbulb, Target } from "lucide-react";

type OpportunitySummaryCardProps = {
  summary?: string;
  opportunities?: string[];
};

const defaultSummary =
  "Based on the assessment, this prospect appears to be a strong candidate for proactive tax planning. Review income sources, investment accounts, retirement assets, business interests, and estate planning before the initial meeting.";

const defaultOpportunities = [
  "Roth conversion analysis",
  "Tax-loss harvesting",
  "Business deduction review",
  "Rental property strategy",
  "Charitable giving optimization",
  "Estate and trust coordination",
];

export default function OpportunitySummaryCard({
  summary = defaultSummary,
  opportunities = defaultOpportunities,
}: OpportunitySummaryCardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-violet-300" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
            Client Copilot Summary
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Opportunity Overview
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <p className="leading-7 text-violet-100/90">{summary}</p>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-300" />
          <p className="font-black text-white">Likely Planning Opportunities</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {opportunities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <Target className="h-4 w-4 text-emerald-300" />
              <span className="text-slate-200 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Future AI versions will tailor this summary and opportunity list to each
        assessment automatically.
      </p>
    </section>
  );
}
