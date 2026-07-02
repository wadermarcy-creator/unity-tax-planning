"use client";

import { UnityBadge } from "@/components/ui/UnityUI";

type StageBadgeProps = {
  stage: string;
};

function getStageTone(stage: string) {
  const normalized = stage.toLowerCase();

  if (normalized.includes("new")) return "blue";
  if (normalized.includes("qualified")) return "yellow";
  if (normalized.includes("meeting")) return "yellow";
  if (normalized.includes("proposal")) return "violet";
  if (normalized.includes("won")) return "emerald";
  if (normalized.includes("hazel")) return "slate";
  if (normalized.includes("archived") || normalized.includes("completed")) {
    return "slate";
  }

  return "slate";
}

export default function StageBadge({ stage }: StageBadgeProps) {
  return <UnityBadge tone={getStageTone(stage)}>{stage}</UnityBadge>;
}
