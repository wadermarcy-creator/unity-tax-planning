"use client";

import { CircleDollarSign, Target, TrendingUp, Users } from "lucide-react";
import { UnityMetricCard } from "@/components/ui/UnityUI";

type PipelineStatsProps = {
  totalLeads: number;
  qualifiedLeads: number;
  projectedRevenue: number;
  averageScore: number;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelineStats({
  totalLeads,
  qualifiedLeads,
  projectedRevenue,
  averageScore,
}: PipelineStatsProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <UnityMetricCard
        label="Total Opportunities"
        value={String(totalLeads)}
        detail="Active pipeline records"
        tone="blue"
        icon={<Users className="h-6 w-6" />}
      />

      <UnityMetricCard
        label="Qualified"
        value={String(qualifiedLeads)}
        detail="Score 80 or higher"
        tone="violet"
        icon={<Target className="h-6 w-6" />}
      />

      <UnityMetricCard
        label="Projected Revenue"
        value={money(projectedRevenue)}
        detail="Estimated annual value"
        tone="emerald"
        icon={<CircleDollarSign className="h-6 w-6" />}
      />

      <UnityMetricCard
        label="Average Score"
        value={`${Math.round(averageScore)}/100`}
        detail="Pipeline quality indicator"
        tone="yellow"
        icon={<TrendingUp className="h-6 w-6" />}
      />
    </section>
  );
}
