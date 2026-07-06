"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  Download,
  FileSpreadsheet,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import {
  UnityAIInsight,
  UnityButton,
  UnityCard,
  UnityCardHeader,
  UnityEmptyState,
  UnityMetricCard,
  UnityPageHero,
  useToast,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";

type LeadRecord = Record<string, any>;

type RevenueLead = {
  id: string;
  name: string;
  stage: string;
  score: number;
  projectedRevenue: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  landingPage: string;
  referrer: string;
  createdAt?: string;
};

type GroupedMetric = {
  key: string;
  leads: number;
  qualified: number;
  won: number;
  projectedRevenue: number;
  expectedRevenue: number;
  averageScore: number;
};


type DonutSegment = {
  label: string;
  value: number;
  stroke: string;
};

const ANNUAL_REVENUE_GOAL = 1000000;
const DONUT_STROKES = ["#60a5fa", "#34d399", "#a78bfa", "#fbbf24", "#fb7185", "#94a3b8"];

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getPercent(value: number, total: number) {
  if (total <= 0) return 0;
  return clampPercent((value / total) * 100);
}

function compactMetric(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildDonutSegments(
  rows: GroupedMetric[],
  valueKey: "projectedRevenue" | "expectedRevenue" | "leads" = "expectedRevenue",
) {
  const topRows = rows.filter((row) => row[valueKey] > 0).slice(0, 5);
  const remaining = rows
    .filter((row) => row[valueKey] > 0)
    .slice(5)
    .reduce((sum, row) => sum + row[valueKey], 0);

  const segments = topRows.map((row, index) => ({
    label: row.key,
    value: row[valueKey],
    stroke: DONUT_STROKES[index % DONUT_STROKES.length],
  }));

  if (remaining > 0) {
    segments.push({
      label: "Other",
      value: remaining,
      stroke: DONUT_STROKES[5],
    });
  }

  return segments;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "No date captured";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date captured";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getLeadName(lead: LeadRecord) {
  return (
    lead.full_name ||
    lead.name ||
    lead.first_name ||
    lead.email ||
    "Unnamed Prospect"
  );
}

function getLeadIncome(lead: LeadRecord) {
  const possibleValues = [
    lead.income,
    lead.annual_income,
    lead.household_income,
    lead.estimated_income,
  ];

  for (const value of possibleValues) {
    const parsed = Number(String(value || "").replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return 0;
}

function calculateLeadScore(lead: LeadRecord) {
  let score = 35;
  const income = getLeadIncome(lead);
  const text = JSON.stringify(lead).toLowerCase();

  if (income >= 500000) score += 25;
  else if (income >= 300000) score += 20;
  else if (income >= 200000) score += 14;
  else if (income >= 100000) score += 8;

  if (text.includes("business") || text.includes("owner")) score += 12;
  if (text.includes("rental") || text.includes("real estate")) score += 10;
  if (
    text.includes("stock") ||
    text.includes("rsu") ||
    text.includes("capital gain")
  ) {
    score += 8;
  }
  if (text.includes("retire") || text.includes("ira") || text.includes("401")) {
    score += 8;
  }
  if (text.includes("charity") || text.includes("donor") || text.includes("daf")) {
    score += 5;
  }
  if (text.includes("estate") || text.includes("trust")) score += 5;

  return Math.min(score, 100);
}

function getProjectedRevenue(score: number, income: number) {
  if (score >= 90) return income >= 500000 ? 9500 : 7500;
  if (score >= 80) return 6500;
  if (score >= 70) return 4500;
  return 2500;
}

function getStoredStage(lead: LeadRecord) {
  return (
    lead.pipeline_stage ||
    lead.stage ||
    lead.status ||
    lead.lead_status ||
    ""
  );
}

function assignStage(lead: LeadRecord, score: number) {
  const storedStage = String(getStoredStage(lead)).toLowerCase();

  if (storedStage.includes("completed") || storedStage.includes("archived")) {
    return "Completed / Archived";
  }
  if (storedStage.includes("hazel")) return "Sent to Hazel";
  if (storedStage.includes("won") || storedStage.includes("client")) return "Won";
  if (storedStage.includes("proposal")) return "Proposal Sent";
  if (storedStage.includes("meeting") || storedStage.includes("scheduled")) {
    return "Meeting Scheduled";
  }
  if (storedStage.includes("qualified")) return "Qualified";
  if (storedStage.includes("new")) return "New Assessment";

  if (score >= 80) return "Qualified";

  return "New Assessment";
}

function cleanAttributionValue(value: unknown, fallback: string) {
  const stringValue = String(value || "").trim();
  return stringValue.length > 0 ? stringValue : fallback;
}

function mapLead(lead: LeadRecord): RevenueLead {
  const score = calculateLeadScore(lead);
  const income = getLeadIncome(lead);

  return {
    id: String(lead.id),
    name: getLeadName(lead),
    stage: assignStage(lead, score),
    score,
    projectedRevenue: getProjectedRevenue(score, income),
    utmSource: cleanAttributionValue(lead.utm_source || lead.source, "Direct / Unknown"),
    utmMedium: cleanAttributionValue(lead.utm_medium || lead.medium, "Unknown"),
    utmCampaign: cleanAttributionValue(
      lead.utm_campaign || lead.campaign || lead.campaign_name,
      "Unattributed",
    ),
    utmTerm: cleanAttributionValue(lead.utm_term, "No keyword captured"),
    utmContent: cleanAttributionValue(lead.utm_content, "No ad/content captured"),
    landingPage: cleanAttributionValue(lead.landing_page, "Unknown landing page"),
    referrer: cleanAttributionValue(lead.referrer, "No referrer"),
    createdAt: lead.created_at || lead.submitted_at || lead.inserted_at,
  };
}

function isWon(lead: RevenueLead) {
  return lead.stage === "Won" || lead.stage === "Sent to Hazel";
}

function expectedMultiplier(stage: string) {
  if (stage === "Won") return 1;
  if (stage === "Sent to Hazel") return 1;
  if (stage === "Proposal Sent") return 0.65;
  if (stage === "Meeting Scheduled") return 0.45;
  if (stage === "Qualified") return 0.3;
  return 0.15;
}

function groupBy(leads: RevenueLead[], getKey: (lead: RevenueLead) => string) {
  const map = new Map<string, RevenueLead[]>();

  for (const lead of leads) {
    const key = getKey(lead);
    const current = map.get(key) || [];
    current.push(lead);
    map.set(key, current);
  }

  return Array.from(map.entries())
    .map(([key, groupedLeads]) => {
      const projectedRevenue = groupedLeads.reduce(
        (sum, lead) => sum + lead.projectedRevenue,
        0,
      );
      const expectedRevenue = groupedLeads.reduce(
        (sum, lead) => sum + lead.projectedRevenue * expectedMultiplier(lead.stage),
        0,
      );
      const averageScore =
        groupedLeads.length > 0
          ? groupedLeads.reduce((sum, lead) => sum + lead.score, 0) /
            groupedLeads.length
          : 0;

      return {
        key,
        leads: groupedLeads.length,
        qualified: groupedLeads.filter((lead) => lead.score >= 80).length,
        won: groupedLeads.filter(isWon).length,
        projectedRevenue,
        expectedRevenue,
        averageScore,
      };
    })
    .sort((a, b) => b.expectedRevenue - a.expectedRevenue);
}

function csvEscape(value: unknown) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return false;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);

  return true;
}


function ProgressRing({
  label,
  value,
  percent,
  description,
  footer,
}: {
  label: string;
  value: string;
  percent: number;
  description: string;
  footer: string;
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const safePercent = clampPercent(percent);
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(30, 41, 59, 0.95)"
              strokeWidth="13"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#revenueRingGradient)"
              strokeLinecap="round"
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient id="revenueRingGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="55%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{safePercent}%</span>
            <span className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-500">
              Complete
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
            {description}
          </p>
          <p className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-400">
            {footer}
          </p>
        </div>
      </div>
    </div>
  );
}

function DonutChartCard({
  title,
  description,
  centerLabel,
  centerValue,
  segments,
}: {
  title: string;
  description: string;
  centerLabel: string;
  centerValue: string;
  segments: DonutSegment[];
}) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let runningOffset = 0;

  return (
    <UnityCard>
      <UnityCardHeader eyebrow="Revenue Mix" title={title} description={description} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-center">
        <div className="relative mx-auto h-60 w-60">
          <svg viewBox="0 0 140 140" className="h-60 w-60 -rotate-90">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(30, 41, 59, 0.95)"
              strokeWidth="18"
            />
            {total > 0 &&
              segments.map((segment) => {
                const dash = (segment.value / total) * circumference;
                const dashOffset = -runningOffset;
                runningOffset += dash;

                return (
                  <circle
                    key={segment.label}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={segment.stroke}
                    strokeLinecap="round"
                    strokeWidth="18"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={dashOffset}
                  />
                );
              })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[0.64rem] font-black uppercase tracking-[0.2em] text-slate-500">
              {centerLabel}
            </p>
            <p className="mt-2 text-3xl font-black text-white">{centerValue}</p>
          </div>
        </div>

        <div className="space-y-3">
          {total === 0 ? (
            <UnityEmptyState
              title="No chart data yet"
              description="Revenue mix will populate once tagged assessments are created."
            />
          ) : (
            segments.map((segment) => (
              <div
                key={segment.label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: segment.stroke }}
                    />
                    <p className="truncate text-sm font-black text-white">{segment.label}</p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-slate-300">
                    {getPercent(segment.value, total)}%
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${getPercent(segment.value, total)}%`,
                      backgroundColor: segment.stroke,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UnityCard>
  );
}

function RankedRevenueBars({ rows }: { rows: GroupedMetric[] }) {
  const topRows = rows.slice(0, 5);
  const maxValue = topRows.reduce(
    (max, row) => Math.max(max, row.expectedRevenue),
    0,
  );

  return (
    <UnityCard>
      <UnityCardHeader
        eyebrow="Circle Graph Companion"
        title="Top revenue opportunities"
        description="A ranked view is easier than a pie chart when you need to decide where the next ad dollar should go."
      />

      <div className="mt-6 space-y-4">
        {topRows.length === 0 ? (
          <UnityEmptyState
            title="No ranked revenue yet"
            description="Campaign revenue rankings will appear once leads are tagged with attribution data."
          />
        ) : (
          topRows.map((row, index) => {
            const width = maxValue > 0 ? getPercent(row.expectedRevenue, maxValue) : 0;

            return (
              <div key={row.key} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {index + 1}. {row.key}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {row.leads} lead{row.leads === 1 ? "" : "s"} • {row.qualified} qualified
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-emerald-300">
                    {formatCurrency(row.expectedRevenue)}
                  </p>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-violet-400"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </UnityCard>
  );
}

function MetricTable({
  title,
  description,
  rows,
  label,
  exportRows,
}: {
  title: string;
  description: string;
  rows: GroupedMetric[];
  label: string;
  exportRows: () => void;
}) {
  return (
    <UnityCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <UnityCardHeader
          eyebrow={label}
          title={title}
          description={description}
        />

        <UnityButton variant="secondary" onClick={exportRows}>
          <Download className="h-4 w-4" />
          Export
        </UnityButton>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="hidden grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr_1fr_1fr] gap-4 bg-slate-900 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500 md:grid">
          <span>Name</span>
          <span>Leads</span>
          <span>Qualified</span>
          <span>Won</span>
          <span>Expected</span>
          <span>Projected</span>
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <UnityEmptyState
              title="No attribution data yet"
              description="New assessment submissions with tracking data will appear here."
            />
          </div>
        ) : (
          <div>
            {rows.slice(0, 8).map((row) => (
              <div key={row.key}>
                <div className="hidden grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr_1fr_1fr] gap-4 border-t border-slate-800 px-5 py-4 text-sm md:grid">
                  <div className="min-w-0">
                    <p className="truncate font-black text-white">{row.key}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Avg score {Math.round(row.averageScore)}/100
                    </p>
                  </div>
                  <p className="font-bold text-slate-300">{row.leads}</p>
                  <p className="font-bold text-blue-300">{row.qualified}</p>
                  <p className="font-bold text-emerald-300">{row.won}</p>
                  <p className="font-black text-white">
                    {formatCurrency(row.expectedRevenue)}
                  </p>
                  <p className="font-black text-slate-300">
                    {formatCurrency(row.projectedRevenue)}
                  </p>
                </div>

                <div className="border-t border-slate-800 p-5 md:hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{row.key}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        Avg score {Math.round(row.averageScore)}/100
                      </p>
                    </div>

                    <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-200">
                      {row.leads} leads
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Expected
                      </p>
                      <p className="mt-2 font-black text-white">
                        {formatCurrency(row.expectedRevenue)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Projected
                      </p>
                      <p className="mt-2 font-black text-slate-300">
                        {formatCurrency(row.projectedRevenue)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Qualified
                      </p>
                      <p className="mt-2 font-black text-blue-300">
                        {row.qualified}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Won
                      </p>
                      <p className="mt-2 font-black text-emerald-300">{row.won}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UnityCard>
  );
}

export default function RevenueIntelligencePage() {
  const toast = useToast();
  const [leads, setLeads] = useState<RevenueLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionQueue, setActionQueue] = useState<RevenueLead[]>([]);

  async function loadRevenueData() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(250);

    if (error) {
      console.error(error);
      setLeads([]);
      setIsLoading(false);
      toast.error({
        title: "Revenue Data Failed",
        description: "Could not load attribution and pipeline data.",
      });
      return;
    }

    setLeads((data || []).map((lead) => mapLead(lead as LeadRecord)));
    setIsLoading(false);
  }

  useEffect(() => {
    loadRevenueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeLeads = useMemo(
    () => leads.filter((lead) => lead.stage !== "Completed / Archived"),
    [leads],
  );

  const projectedRevenue = activeLeads.reduce(
    (sum, lead) => sum + lead.projectedRevenue,
    0,
  );

  const expectedRevenue = activeLeads.reduce(
    (sum, lead) => sum + lead.projectedRevenue * expectedMultiplier(lead.stage),
    0,
  );

  const wonRevenue = activeLeads
    .filter(isWon)
    .reduce((sum, lead) => sum + lead.projectedRevenue, 0);

  const qualifiedLeads = activeLeads.filter((lead) => lead.score >= 80).length;
  const averagePriorityScore =
    activeLeads.length > 0
      ? Math.round(
          activeLeads.reduce((sum, lead) => sum + lead.score, 0) /
            activeLeads.length,
        )
      : 0;

  const stageCoverage =
    projectedRevenue > 0 ? Math.round((expectedRevenue / projectedRevenue) * 100) : 0;

  const priorityScore = Math.min(
    100,
    Math.round(averagePriorityScore * 0.7 + stageCoverage * 0.3),
  );

  const campaignRows = useMemo(
    () => groupBy(activeLeads, (lead) => lead.utmCampaign),
    [activeLeads],
  );

  const sourceRows = useMemo(
    () => groupBy(activeLeads, (lead) => lead.utmSource),
    [activeLeads],
  );

  const landingPageRows = useMemo(
    () => groupBy(activeLeads, (lead) => lead.landingPage),
    [activeLeads],
  );

  const keywordRows = useMemo(
    () => groupBy(activeLeads, (lead) => lead.utmTerm),
    [activeLeads],
  );

  const topCampaign = campaignRows[0];
  const topSource = sourceRows[0];
  const topLandingPage = landingPageRows[0];
  const topLead = useMemo(
    () => [...activeLeads].sort((a, b) => b.score - a.score)[0],
    [activeLeads],
  );

  const stageRows = useMemo(
    () => groupBy(activeLeads, (lead) => lead.stage),
    [activeLeads],
  );

  const revenueGoalProgress = getPercent(projectedRevenue, ANNUAL_REVENUE_GOAL);
  const expectedGoalProgress = getPercent(expectedRevenue, ANNUAL_REVENUE_GOAL);
  const qualifiedLeadPercent = getPercent(qualifiedLeads, activeLeads.length);
  const stageDonutSegments = buildDonutSegments(stageRows, "expectedRevenue");

  const executiveRecommendation = topCampaign
    ? `Double down on ${topCampaign.key}. It is currently producing ${topCampaign.leads} lead${
        topCampaign.leads === 1 ? "" : "s"
      } and ${formatCurrency(
        topCampaign.expectedRevenue,
      )} in stage-weighted expected annual revenue. Next move: review the highest-priority lead, confirm attribution, and create one follow-up campaign around the same audience.`
    : "Revenue intelligence is waiting on assessment and attribution data. Once traffic starts flowing, this page will show the highest-value campaigns, sources, landing pages, and keywords.";

  const leadExportRows = activeLeads.map((lead) => ({
    name: lead.name,
    stage: lead.stage,
    score: lead.score,
    projected_annual_revenue: lead.projectedRevenue,
    expected_annual_revenue: Math.round(
      lead.projectedRevenue * expectedMultiplier(lead.stage),
    ),
    source: lead.utmSource,
    medium: lead.utmMedium,
    campaign: lead.utmCampaign,
    keyword: lead.utmTerm,
    content: lead.utmContent,
    landing_page: lead.landingPage,
    referrer: lead.referrer,
    created_at: lead.createdAt || "",
  }));

  function groupedExportRows(rows: GroupedMetric[]) {
    return rows.map((row) => ({
      name: row.key,
      leads: row.leads,
      qualified: row.qualified,
      won: row.won,
      average_score: Math.round(row.averageScore),
      expected_annual_revenue: Math.round(row.expectedRevenue),
      projected_annual_revenue: Math.round(row.projectedRevenue),
    }));
  }

  async function copyExecutiveBrief() {
    const brief = [
      "Unity Tax Revenue Intelligence Brief",
      `Priority Score: ${priorityScore}/100`,
      `Projected Annual Revenue: ${formatCurrency(projectedRevenue)}`,
      `Expected Revenue: ${formatCurrency(expectedRevenue)}`,
      `Qualified Leads: ${qualifiedLeads}`,
      `Recommendation: ${executiveRecommendation}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(brief);
      toast.success({
        title: "Brief Copied",
        description: "Revenue intelligence summary copied to clipboard.",
      });
    } catch (error) {
      console.error(error);
      toast.error({
        title: "Copy Failed",
        description: "Could not copy the revenue brief.",
      });
    }
  }

  function exportRevenueCsv() {
    const didExport = downloadCsv("unity-tax-revenue-intelligence.csv", leadExportRows);

    if (!didExport) {
      toast.error({
        title: "Nothing To Export",
        description: "There are no active leads in the revenue view yet.",
      });
      return;
    }

    toast.success({
      title: "Revenue CSV Exported",
      description: "Lead-level revenue data has been downloaded.",
    });
  }

  function exportGroupedCsv(filename: string, rows: GroupedMetric[]) {
    const didExport = downloadCsv(filename, groupedExportRows(rows));

    if (!didExport) {
      toast.error({
        title: "Nothing To Export",
        description: "There is no grouped revenue data available yet.",
      });
      return;
    }

    toast.success({
      title: "CSV Exported",
      description: "Revenue performance data has been downloaded.",
    });
  }

  function addLeadToQueue(lead?: RevenueLead) {
    if (!lead) {
      toast.error({
        title: "No Lead Selected",
        description: "A priority lead will appear here once assessment data is available.",
      });
      return;
    }

    setActionQueue((current) => {
      if (current.some((queuedLead) => queuedLead.id === lead.id)) return current;
      return [lead, ...current].slice(0, 5);
    });

    toast.success({
      title: "Added To Revenue Queue",
      description: `${lead.name} is queued for follow-up review.`,
    });
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Revenue Intelligence"
        subtitle="See which campaigns, landing pages, and sources are creating pipeline value."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <UnityPageHero
          eyebrow="Revenue Intelligence"
          title="Know where your money is coming from."
          description="Track assessment submissions through attribution, pipeline stage, projected value, and expected revenue so you can make better advertising decisions."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <UnityButton variant="secondary" onClick={copyExecutiveBrief}>
                <ClipboardList className="h-4 w-4" />
                Copy Brief
              </UnityButton>

              <UnityButton variant="secondary" onClick={exportRevenueCsv}>
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </UnityButton>

              <UnityButton variant="secondary" onClick={loadRevenueData}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </UnityButton>
            </div>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="Projected Annual Revenue"
            value={formatCurrency(projectedRevenue)}
            detail="Active pipeline forecast"
            tone="emerald"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Expected Revenue"
            value={formatCurrency(expectedRevenue)}
            detail="Stage-weighted estimate"
            tone="blue"
            icon={<TrendingUp className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Priority Score"
            value={`${priorityScore}/100`}
            detail="Lead quality plus stage progress"
            tone="yellow"
            icon={<Target className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Won / Hazel Revenue"
            value={formatCurrency(wonRevenue)}
            detail="Converted or handed off"
            tone="violet"
            icon={<Trophy className="h-6 w-6" />}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <UnityCard>
            <UnityCardHeader
              eyebrow="Visual Revenue Dashboard"
              title="Progress toward the $1M annual revenue target"
              description="Use these rings as the quick executive read before deciding which campaign, source, or lead deserves attention."
            />

            <div className="mt-6 grid gap-4">
              <ProgressRing
                label="Goal Progress"
                value={formatCurrency(projectedRevenue)}
                percent={revenueGoalProgress}
                description={`Projected annual revenue against the ${formatCurrency(
                  ANNUAL_REVENUE_GOAL,
                )} launch target.`}
                footer={`${formatCurrency(
                  Math.max(ANNUAL_REVENUE_GOAL - projectedRevenue, 0),
                )} remaining to goal`}
              />

              <ProgressRing
                label="Stage-Weighted Progress"
                value={formatCurrency(expectedRevenue)}
                percent={expectedGoalProgress}
                description="Expected revenue after applying stage probability to the active pipeline."
                footer={`${stageCoverage}% of projected revenue is weighted into the current pipeline`}
              />

              <ProgressRing
                label="Qualified Lead Ratio"
                value={`${qualifiedLeads}/${activeLeads.length}`}
                percent={qualifiedLeadPercent}
                description="Share of active assessments scoring high enough to justify fast follow-up."
                footer={`${averagePriorityScore}/100 average priority score`}
              />
            </div>
          </UnityCard>

          <DonutChartCard
            title="Expected revenue by pipeline stage"
            description="A donut view of where the stage-weighted revenue currently sits across the active pipeline."
            centerLabel="Expected"
            centerValue={formatCurrency(expectedRevenue)}
            segments={stageDonutSegments}
          />
        </div>

        <div className="mt-8">
          <RankedRevenueBars rows={campaignRows} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <UnityAIInsight title="AI Executive Recommendation">
            {executiveRecommendation}
          </UnityAIInsight>

          <UnityCard>
            <UnityCardHeader
              eyebrow="Best Revenue Opportunity"
              title={topLead ? topLead.name : "No priority lead yet"}
              description={
                topLead
                  ? `${topLead.stage} • ${topLead.score}/100 priority score • ${formatCurrency(
                      topLead.projectedRevenue,
                    )} projected annual revenue`
                  : "New assessments will appear here once revenue data is available."
              }
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => addLeadToQueue(topLead)}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left transition hover:bg-emerald-500/15"
              >
                <p className="text-sm font-black text-emerald-200">Queue Review</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                  Add the top prospect to your revenue follow-up queue.
                </p>
              </button>

              <Link
                href="/mission-control/assessments"
                className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-left transition hover:bg-blue-500/15"
              >
                <p className="flex items-center gap-2 text-sm font-black text-blue-200">
                  Open Assessments
                  <ArrowRight className="h-4 w-4" />
                </p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                  Review the underlying assessment and contact details.
                </p>
              </Link>
            </div>
          </UnityCard>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <UnityCard>
            <UnityCardHeader
              eyebrow="Top Campaign"
              title={topCampaign ? topCampaign.key : "No campaign data"}
              description={
                topCampaign
                  ? `${topCampaign.leads} lead${
                      topCampaign.leads === 1 ? "" : "s"
                    } • ${formatCurrency(topCampaign.expectedRevenue)} expected`
                  : "Campaign attribution will appear after tagged traffic submits assessments."
              }
            />
          </UnityCard>

          <UnityCard>
            <UnityCardHeader
              eyebrow="Top Source"
              title={topSource ? topSource.key : "No source data"}
              description={
                topSource
                  ? `${topSource.leads} lead${
                      topSource.leads === 1 ? "" : "s"
                    } • ${formatCurrency(topSource.expectedRevenue)} expected`
                  : "Source attribution will appear once UTM source is captured."
              }
            />
          </UnityCard>

          <UnityCard>
            <UnityCardHeader
              eyebrow="Top Landing Page"
              title={topLandingPage ? topLandingPage.key : "No landing page data"}
              description={
                topLandingPage
                  ? `${topLandingPage.leads} lead${
                      topLandingPage.leads === 1 ? "" : "s"
                    } • ${formatCurrency(topLandingPage.expectedRevenue)} expected`
                  : "Landing page attribution will appear after published pages receive traffic."
              }
            />
          </UnityCard>
        </div>

        {isLoading ? (
          <UnityCard className="mt-8">
            <p className="text-sm font-bold text-slate-400">
              Loading revenue intelligence...
            </p>
          </UnityCard>
        ) : (
          <div className="mt-8 grid gap-6">
            <MetricTable
              label="Campaign Performance"
              title="Top campaigns"
              description="Grouped by UTM campaign or saved campaign name."
              rows={campaignRows}
              exportRows={() =>
                exportGroupedCsv("unity-tax-revenue-by-campaign.csv", campaignRows)
              }
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <MetricTable
                label="Source Performance"
                title="Top sources"
                description="Grouped by UTM source."
                rows={sourceRows}
                exportRows={() =>
                  exportGroupedCsv("unity-tax-revenue-by-source.csv", sourceRows)
                }
              />

              <MetricTable
                label="Landing Page Performance"
                title="Top landing pages"
                description="Grouped by captured landing page."
                rows={landingPageRows}
                exportRows={() =>
                  exportGroupedCsv(
                    "unity-tax-revenue-by-landing-page.csv",
                    landingPageRows,
                  )
                }
              />
            </div>

            <MetricTable
              label="Keyword Performance"
              title="Top keywords"
              description="Grouped by UTM term. Google Ads keyword data should pass through utm_term or ValueTrack."
              rows={keywordRows}
              exportRows={() =>
                exportGroupedCsv("unity-tax-revenue-by-keyword.csv", keywordRows)
              }
            />

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <UnityCard>
                <UnityCardHeader
                  eyebrow="Revenue Action Queue"
                  title="Follow-up priorities"
                  description="One-click queue for the prospects that deserve manual review before ad spend scales."
                />

                <div className="mt-6 grid gap-3">
                  {actionQueue.length === 0 ? (
                    <UnityEmptyState
                      title="No queued revenue reviews yet"
                      description="Use Queue Review on the top revenue opportunity to build a short action list."
                    />
                  ) : (
                    actionQueue.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate font-black text-white">{lead.name}</p>
                            <p className="mt-1 text-xs font-bold text-slate-500">
                              {lead.stage} • Submitted {formatDate(lead.createdAt)}
                            </p>
                          </div>
                          <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-200">
                            {lead.score}/100
                          </div>
                        </div>
                        <p className="mt-3 text-sm font-black text-emerald-300">
                          {formatCurrency(lead.projectedRevenue)} projected annual revenue
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </UnityCard>

              <UnityCard>
                <UnityCardHeader
                  eyebrow="Next Upgrade"
                  title="True ROI tracking"
                  description="This page is currently using projected and expected revenue. The next layer is adding campaign spend so Mission Control can calculate cost per lead, cost per qualified lead, cost per client, and return on ad spend."
                />

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <MousePointerClick className="h-6 w-6 text-blue-300" />
                    <p className="mt-4 font-black text-white">
                      Click-to-lead attribution
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Capture UTM, GCLID, source, keyword, and landing page.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <BarChart3 className="h-6 w-6 text-violet-300" />
                    <p className="mt-4 font-black text-white">
                      Spend-to-revenue reporting
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Add campaign spend to calculate ROI and CAC.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <Sparkles className="h-6 w-6 text-emerald-300" />
                    <p className="mt-4 font-black text-white">
                      AI budget recommendations
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Increase winners, pause losers, and create new campaigns.
                    </p>
                  </div>
                </div>
              </UnityCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
