"use client";

import { CheckCircle2, ClipboardCheck, FileText, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

type MeetingBrief = {
  summary: string;
  likelyOpportunities: string[];
  questionsToAsk: string[];
  documentsToRequest: string[];
  talkingPoints: string[];
  potentialObjections: string[];
  followUpEmailDraft?: {
    subject?: string;
    body?: string;
  };
};

type MeetingPrepCardProps = {
  lead?: Record<string, unknown>;
  score?: number;
  projectedRevenue?: number;
};

const defaultChecklist = [
  "Review prior year's tax return",
  "Discuss income sources and future changes",
  "Review investment and retirement accounts",
  "Identify business ownership or rental properties",
  "Confirm estate planning documents",
  "Discuss current CPA relationship",
];

function BriefList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
            <p className="text-sm leading-6 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MeetingPrepCard({
  lead,
  score,
  projectedRevenue,
}: MeetingPrepCardProps) {
  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [message, setMessage] = useState("");

  async function prepareMeeting() {
    if (!lead) {
      setMessage("Lead data is missing.");
      return;
    }

    setIsPreparing(true);
    setMessage("");

    try {
      const response = await fetch("/api/mission-control/client-copilot/meeting-prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead,
          score,
          projectedRevenue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Meeting prep failed.");
        setIsPreparing(false);
        return;
      }

      setBrief(result as MeetingBrief);
      setMessage("AI meeting brief prepared.");
    } catch (error) {
      console.error(error);
      setMessage("Unexpected meeting prep error.");
    }

    setIsPreparing(false);
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-blue-300" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Meeting Prep
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            AI Advisor Brief
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-violet-300" />
          <div>
            <p className="font-black text-white">Prepare Meeting with AI</p>
            <p className="mt-2 text-sm leading-6 text-violet-100/80">
              Client Copilot will analyze this assessment and create a meeting
              summary, planning opportunities, questions, document requests,
              talking points, objections, and a follow-up email draft.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prepareMeeting}
        disabled={isPreparing}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        <FileText className="h-4 w-4" />
        {isPreparing ? "Preparing Meeting..." : "Prepare Meeting"}
      </button>

      {message && (
        <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
          {message}
        </p>
      )}

      {!brief && (
        <div className="mt-6 space-y-3">
          {defaultChecklist.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
              <p className="font-medium text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      )}

      {brief && (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
              Executive Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-violet-100/90">
              {brief.summary}
            </p>
          </div>

          <BriefList title="Likely Planning Opportunities" items={brief.likelyOpportunities} />
          <BriefList title="Questions To Ask" items={brief.questionsToAsk} />
          <BriefList title="Documents To Request" items={brief.documentsToRequest} />
          <BriefList title="Advisor Talking Points" items={brief.talkingPoints} />
          <BriefList title="Potential Objections" items={brief.potentialObjections} />

          {brief.followUpEmailDraft && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-300" />
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                  Follow-Up Email Draft
                </p>
              </div>

              <p className="mt-4 font-black text-white">
                {brief.followUpEmailDraft.subject}
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {brief.followUpEmailDraft.body}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
