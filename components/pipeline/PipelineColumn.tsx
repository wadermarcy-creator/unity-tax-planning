"use client";

import {
  UnityCard,
  UnityEmptyState,
} from "@/components/ui/UnityUI";
import PipelineCard, { type PipelineLead } from "./PipelineCard";

type PipelineColumnProps = {
  title: string;
  description: string;
  leads: PipelineLead[];
  onStageChange: (leadId: string, nextStage: string) => void;
  updatingLeadId?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelineColumn({
  title,
  description,
  leads,
  onStageChange,
  updatingLeadId,
}: PipelineColumnProps) {
  const projectedRevenue = leads.reduce(
    (sum, lead) => sum + lead.projectedRevenue,
    0,
  );

  return (
    <UnityCard className="min-w-0 p-3">
      <div className="mb-3 min-h-[105px]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-black leading-tight text-white">
              {title}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
              {description}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-black text-slate-300">
            {leads.length}
          </span>
        </div>

        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
          {formatCurrency(projectedRevenue)}
        </p>
      </div>

      <div className="space-y-3">
        {leads.length === 0 ? (
          <UnityEmptyState
            title="Empty"
            description="No active opportunities."
          />
        ) : (
          leads.map((lead) => (
            <PipelineCard
              key={lead.id}
              lead={lead}
              onStageChange={onStageChange}
              isUpdating={updatingLeadId === lead.id}
            />
          ))
        )}
      </div>
    </UnityCard>
  );
}
