"use client";

import { ArrowRight, CalendarDays, CircleDollarSign, Star } from "lucide-react";
import {
  UnityButton,
  UnityCard,
} from "@/components/ui/UnityUI";

export type PipelineLead = {
  id: string;
  name: string;
  email?: string;
  occupation?: string;
  stage: string;
  score: number;
  projectedRevenue: number;
  createdAt?: string;
  recommendation?: string;
};

const PIPELINE_STAGES = [
  "New Assessment",
  "Qualified",
  "Meeting Scheduled",
  "Proposal Sent",
  "Won",
  "Sent to Hazel",
  "Completed / Archived",
];

type PipelineCardProps = {
  lead: PipelineLead;
  onStageChange: (leadId: string, nextStage: string) => void;
  isUpdating?: boolean;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getScoreTone(score: number) {
  if (score >= 90) return "text-emerald-300";
  if (score >= 80) return "text-blue-300";
  if (score >= 70) return "text-yellow-300";
  return "text-slate-400";
}

export default function PipelineCard({
  lead,
  onStageChange,
  isUpdating = false,
}: PipelineCardProps) {
  return (
    <UnityCard className="rounded-2xl p-3">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-black text-white">{lead.name}</h3>
        <p className="mt-1 truncate text-[11px] font-bold text-slate-500">
          {lead.occupation || "Occupation not provided"}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-2">
          <div className="flex items-center gap-1">
            <Star className={`h-3 w-3 ${getScoreTone(lead.score)}`} />
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
              Score
            </p>
          </div>
          <p className={`mt-1 text-lg font-black ${getScoreTone(lead.score)}`}>
            {lead.score}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-2">
          <div className="flex items-center gap-1">
            <CircleDollarSign className="h-3 w-3 text-emerald-300" />
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
              Rev
            </p>
          </div>
          <p className="mt-1 truncate text-lg font-black text-white">
            {formatCurrency(lead.projectedRevenue)}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-500">
        <CalendarDays className="h-3 w-3" />
        {formatDate(lead.createdAt)}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Move Stage</span>
        <select
          value={lead.stage}
          disabled={isUpdating}
          onChange={(event) => onStageChange(lead.id, event.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-2 text-[11px] font-black text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-3 line-clamp-2 rounded-xl border border-violet-500/20 bg-violet-500/10 p-2 text-[11px] leading-4 text-violet-100/80">
        {lead.recommendation ||
          "Review this opportunity and determine the next best action."}
      </p>

      <UnityButton
        href={`/mission-control/client-copilot/opportunities/${lead.id}`}
        variant="secondary"
        className="mt-3 w-full rounded-xl px-2 py-2 text-[11px]"
      >
        Open <ArrowRight className="h-3 w-3" />
      </UnityButton>
    </UnityCard>
  );
}
