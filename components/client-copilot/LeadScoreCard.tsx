"use client";

import { CircleDollarSign, Star, TrendingUp } from "lucide-react";

type LeadScoreCardProps = {
  score: number;
  projectedRevenue: number;
  closeProbability: number;
};

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";
  if (score >= 80) return "text-blue-300 border-blue-500/30 bg-blue-500/10";
  if (score >= 70) return "text-yellow-300 border-yellow-500/30 bg-yellow-500/10";
  return "text-red-300 border-red-500/30 bg-red-500/10";
}

export default function LeadScoreCard({score,projectedRevenue,closeProbability}: LeadScoreCardProps) {
  const tone = scoreColor(score);
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">Lead Score</p>
      <div className={`mt-6 rounded-[2rem] border p-6 ${tone}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-black">{score}</p>
            <p className="mt-1 text-sm font-bold">out of 100</p>
          </div>
          <Star className="h-10 w-10"/>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-5 w-5 text-emerald-300"/>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Projected Annual Revenue</p>
              <p className="mt-1 text-2xl font-black text-white">${projectedRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-blue-300"/>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Probability of Closing</p>
              <p className="mt-1 text-2xl font-black text-white">{closeProbability}%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
