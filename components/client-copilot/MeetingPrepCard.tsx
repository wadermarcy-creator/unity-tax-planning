"use client";

import { CheckCircle2, ClipboardCheck, FileText, Sparkles } from "lucide-react";

type MeetingPrepCardProps = {
  checklist?: string[];
};

const defaultChecklist = [
  "Review prior year's tax return",
  "Discuss income sources and future changes",
  "Review investment and retirement accounts",
  "Identify business ownership or rental properties",
  "Confirm estate planning documents",
  "Discuss current CPA relationship",
];

export default function MeetingPrepCard({
  checklist = defaultChecklist,
}: MeetingPrepCardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-blue-300" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Meeting Prep
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            First Meeting Checklist
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {checklist.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
            <p className="font-medium text-slate-200">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-violet-300" />
          <div>
            <p className="font-black text-white">Coming Soon: AI Meeting Brief</p>
            <p className="mt-2 text-sm leading-6 text-violet-100/80">
              Client Copilot will automatically summarize the prospect, identify
              likely tax planning opportunities, generate talking points, and
              prepare a customized agenda before every meeting.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-500"
      >
        <FileText className="h-4 w-4" />
        Prepare Meeting
      </button>
    </section>
  );
}
