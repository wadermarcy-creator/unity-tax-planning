"use client";

import { CalendarDays, CheckCircle2, FileText, Sparkles } from "lucide-react";

type ProposalPreviewCardProps = {
  prospectName?: string;
  projectedRevenue?: number;
  opportunities?: string[];
};

function formatCurrency(value?: number) {
  if (!value) return "TBD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProposalPreviewCard({
  prospectName = "Prospect",
  projectedRevenue,
  opportunities = [],
}: ProposalPreviewCardProps) {
  const focusAreas =
    opportunities.length > 0
      ? opportunities.slice(0, 6)
      : [
          "Tax return review",
          "Retirement tax planning",
          "Investment tax efficiency",
          "CPA coordination",
        ];

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-emerald-300" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Proposal Preview
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Engagement Summary
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
          Recommended Service
        </p>
        <p className="mt-3 text-2xl font-black text-white">
          Comprehensive Tax Planning Review
        </p>
        <p className="mt-3 text-sm leading-7 text-emerald-100/80">
          A proactive review designed to identify planning opportunities,
          coordinate with the prospect&apos;s CPA, and organize next steps before
          implementation.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Prospect
          </p>
          <p className="mt-2 text-xl font-black text-white">{prospectName}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Estimated Annual Fee
          </p>
          <p className="mt-2 text-xl font-black text-emerald-300">
            {formatCurrency(projectedRevenue)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
          Planning Focus Areas
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {focusAreas.map((item) => (
            <div key={item} className="flex gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
              <p className="text-sm leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-300" />
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
            Suggested Timeline
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {[
            ["Week 1", "Collect documents and clarify planning objectives."],
            ["Week 2", "Review tax return, accounts, and planning opportunities."],
            ["Week 3", "Coordinate with CPA and finalize recommended strategy areas."],
            ["Week 4", "Present findings and implementation roadmap."],
          ].map(([period, detail]) => (
            <div key={period} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="font-black text-white">{period}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-5 w-5 shrink-0 text-violet-300" />
          <div>
            <p className="font-black text-white">Future AI Upgrade</p>
            <p className="mt-2 text-sm leading-6 text-violet-100/80">
              Proposal Builder will generate a client-facing engagement summary,
              recommended scope, fee positioning, and follow-up email. Hazel can
              still handle the full technical tax plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
