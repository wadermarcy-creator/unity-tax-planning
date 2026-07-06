"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clipboard,
  ClipboardList,
  Download,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  UserRoundCheck,
  Zap,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import {
  UnityAIInsight,
  UnityBadge,
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

type CopilotLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  stage: string;
  score: number;
  income: number;
  projectedRevenue: number;
  createdAt?: string;
  recommendation: string;
  opportunities: string[];
};

const ACTIVE_STAGES = [
  "New Assessment",
  "Qualified",
  "Meeting Scheduled",
  "Proposal Sent",
  "Won",
  "Sent to Hazel",
] as const;

function formatCurrency(value: number, fallback = "$0") {
  if (!value) return fallback;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getLeadName(lead: LeadRecord) {
  const firstName = lead.first_name || lead.firstName;
  const lastName = lead.last_name || lead.lastName;
  const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return (
    lead.full_name ||
    lead.fullName ||
    lead.name ||
    combinedName ||
    lead.email ||
    "Unnamed Prospect"
  );
}

function getLeadEmail(lead: LeadRecord) {
  return lead.email || lead.email_address || lead.emailAddress || "No email";
}

function getLeadPhone(lead: LeadRecord) {
  return lead.phone || lead.phone_number || lead.phoneNumber || "No phone";
}

function getLeadOccupation(lead: LeadRecord) {
  return (
    lead.occupation ||
    lead.profession ||
    lead.job_title ||
    lead.jobTitle ||
    lead.industry ||
    "Occupation not provided"
  );
}

function parseMoneyLikeValue(value: unknown) {
  const raw = String(value || "").toLowerCase().trim();
  if (!raw) return 0;

  const firstNumber = raw.match(/[0-9][0-9,]*(?:\.[0-9]+)?/);
  if (!firstNumber) return 0;

  const parsed = Number(firstNumber[0].replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;

  if (raw.includes("million") || raw.includes("mm")) return parsed * 1_000_000;
  if (raw.includes("k")) return parsed * 1_000;

  return parsed;
}

function getLeadIncome(lead: LeadRecord) {
  const possibleValues = [
    lead.income,
    lead.annual_income,
    lead.annualIncome,
    lead.household_income,
    lead.householdIncome,
    lead.estimated_income,
    lead.estimatedIncome,
  ];

  for (const value of possibleValues) {
    const parsed = parseMoneyLikeValue(value);
    if (parsed > 0) return parsed;
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
  if (text.includes("stock") || text.includes("rsu") || text.includes("capital gain")) score += 8;
  if (text.includes("retire") || text.includes("ira") || text.includes("401")) score += 8;
  if (text.includes("charity") || text.includes("donor") || text.includes("daf")) score += 5;
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
  return lead.pipeline_stage || lead.pipelineStage || lead.stage || lead.status || lead.lead_status || lead.leadStatus || "";
}

function assignStage(lead: LeadRecord, score: number) {
  const storedStage = String(getStoredStage(lead)).toLowerCase();

  if (storedStage.includes("completed") || storedStage.includes("archived")) return "Completed / Archived";
  if (storedStage.includes("hazel")) return "Sent to Hazel";
  if (storedStage.includes("won") || storedStage.includes("client")) return "Won";
  if (storedStage.includes("proposal")) return "Proposal Sent";
  if (storedStage.includes("meeting") || storedStage.includes("scheduled")) return "Meeting Scheduled";
  if (storedStage.includes("qualified")) return "Qualified";
  if (storedStage.includes("new")) return "New Assessment";

  if (score >= 80) return "Qualified";

  return "New Assessment";
}

function getStageTone(stage: string): "blue" | "violet" | "emerald" | "yellow" | "slate" {
  if (stage === "New Assessment") return "blue";
  if (stage === "Qualified") return "yellow";
  if (stage === "Meeting Scheduled") return "violet";
  if (stage === "Proposal Sent") return "violet";
  if (stage === "Won") return "emerald";
  return "slate";
}

function getScoreTone(score: number): "emerald" | "blue" | "yellow" | "slate" {
  if (score >= 90) return "emerald";
  if (score >= 80) return "blue";
  if (score >= 70) return "yellow";
  return "slate";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Priority";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Qualified";
  return "Review";
}

function getOpportunities(lead: LeadRecord) {
  const text = JSON.stringify(lead).toLowerCase();
  const income = getLeadIncome(lead);
  const opportunities = new Set<string>();

  opportunities.add("Tax return review");
  opportunities.add("Investment tax efficiency");
  opportunities.add("Retirement contribution strategy");

  if (income >= 200000) {
    opportunities.add("Roth conversion analysis");
    opportunities.add("Backdoor Roth review");
  }

  if (text.includes("business") || text.includes("owner")) {
    opportunities.add("Business deduction review");
    opportunities.add("Entity and compensation planning");
  }

  if (text.includes("rental") || text.includes("real estate")) {
    opportunities.add("Rental depreciation review");
    opportunities.add("Cost segregation discussion");
  }

  if (text.includes("charity") || text.includes("donor") || text.includes("daf")) {
    opportunities.add("Charitable giving optimization");
    opportunities.add("Donor-advised fund review");
  }

  if (text.includes("estate") || text.includes("trust")) {
    opportunities.add("Estate and trust coordination");
  }

  return Array.from(opportunities).slice(0, 6);
}

function getRecommendation(stage: string, score: number) {
  if (stage === "New Assessment") {
    return score >= 80
      ? "Review today and move this prospect forward if the assessment confirms fit."
      : "Review the assessment and decide whether this prospect is qualified.";
  }

  if (stage === "Qualified") return "Schedule a strategy conversation and prepare advisor talking points.";
  if (stage === "Meeting Scheduled") return "Generate the AI meeting brief before the call.";
  if (stage === "Proposal Sent") return "Follow up with a clear next step and address likely objections.";
  if (stage === "Won") return "Start onboarding and prepare the Hazel handoff.";
  if (stage === "Sent to Hazel") return "Track plan progress and implementation tasks.";

  return "Review next best action.";
}

function mapLead(lead: LeadRecord): CopilotLead {
  const score = calculateLeadScore(lead);
  const income = getLeadIncome(lead);
  const stage = assignStage(lead, score);

  return {
    id: String(lead.id || lead.uuid || lead.email || crypto.randomUUID()),
    name: getLeadName(lead),
    email: getLeadEmail(lead),
    phone: getLeadPhone(lead),
    occupation: getLeadOccupation(lead),
    stage,
    score,
    income,
    projectedRevenue: getProjectedRevenue(score, income),
    createdAt: lead.created_at || lead.createdAt || lead.submitted_at || lead.submittedAt || lead.inserted_at || lead.insertedAt,
    recommendation: getRecommendation(stage, score),
    opportunities: getOpportunities(lead),
  };
}

function escapeCsvValue(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return false;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

function buildLeadBrief(lead: CopilotLead) {
  return [
    `Client Copilot Brief: ${lead.name}`,
    `Stage: ${lead.stage}`,
    `Priority Score: ${lead.score}/100 (${getScoreLabel(lead.score)})`,
    `Projected Annual Revenue: ${formatCurrency(lead.projectedRevenue)}`,
    `Income: ${formatCurrency(lead.income, "Unknown")}`,
    `Occupation: ${lead.occupation}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Recommended Action: ${lead.recommendation}`,
    `Opportunity Signals: ${lead.opportunities.join(", ")}`,
  ].join("\n");
}

function leadToCsvRow(lead: CopilotLead) {
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    occupation: lead.occupation,
    stage: lead.stage,
    priority_score: lead.score,
    income: lead.income,
    projected_annual_revenue: lead.projectedRevenue,
    recommended_action: lead.recommendation,
    opportunities: lead.opportunities.join("; "),
    created_at: lead.createdAt || "",
  };
}

function StagePill({ stage, count }: { stage: string; count: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-4">
        <UnityBadge tone={getStageTone(stage)}>{stage}</UnityBadge>
        <p className="text-2xl font-black text-white">{count}</p>
      </div>
    </div>
  );
}

function CompactAction({ href, disabled, children }: { href?: string; disabled?: boolean; children: ReactNode }) {
  if (disabled || !href) {
    return (
      <span className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl border border-slate-800 px-3 py-2 text-xs font-black text-slate-600">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border border-slate-800 px-3 py-2 text-xs font-black text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
    >
      {children}
    </a>
  );
}

function LeadMiniCard({ lead, onCopyBrief }: { lead: CopilotLead; onCopyBrief: (lead: CopilotLead) => void }) {
  const hasEmail = lead.email !== "No email";
  const hasPhone = lead.phone !== "No phone";

  return (
    <UnityCard className="p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-black text-white">{lead.name}</h3>
            <UnityBadge tone={getScoreTone(lead.score)}>
              {getScoreLabel(lead.score)} · {lead.score}/100
            </UnityBadge>
            <UnityBadge tone={getStageTone(lead.stage)}>{lead.stage}</UnityBadge>
          </div>

          <p className="mt-3 text-sm font-bold text-slate-400">{lead.occupation}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 break-all">
              <Mail className="h-4 w-4 shrink-0" />
              {lead.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {lead.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatDate(lead.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[330px]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Income</p>
            <p className="mt-2 text-xl font-black text-white">{formatCurrency(lead.income, "Unknown")}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Projected Revenue</p>
            <p className="mt-2 text-xl font-black text-emerald-200">{formatCurrency(lead.projectedRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
        <UnityAIInsight title="AI Executive Recommendation">{lead.recommendation}</UnityAIInsight>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <button
            type="button"
            onClick={() => onCopyBrief(lead)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
          >
            <Clipboard className="h-4 w-4" />
            Copy Brief
          </button>
          <UnityButton href="/mission-control/assessments" variant="secondary">
            Review Assessment <ArrowRight className="h-4 w-4" />
          </UnityButton>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {lead.opportunities.slice(0, 4).map((opportunity) => (
          <span
            key={opportunity}
            className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300"
          >
            {opportunity}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
        <CompactAction href={hasEmail ? `mailto:${lead.email}` : undefined} disabled={!hasEmail}>
          Email
        </CompactAction>
        <CompactAction href={hasPhone ? `tel:${lead.phone}` : undefined} disabled={!hasPhone}>
          Call
        </CompactAction>
        <CompactAction href="/mission-control/pipeline">Open Pipeline</CompactAction>
      </div>
    </UnityCard>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
  variant = "secondary",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  variant?: "primary" | "secondary" | "ai" | "success";
}) {
  return (
    <UnityCard className="p-5">
      <div className="flex gap-4">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 text-blue-300">{icon}</div>
        <div>
          <p className="font-black text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>

      <UnityButton href={href} variant={variant} className="mt-5 w-full">
        Open <ArrowRight className="h-4 w-4" />
      </UnityButton>
    </UnityCard>
  );
}

export default function ClientCopilotPage() {
  const toast = useToast();
  const [leads, setLeads] = useState<CopilotLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadLeads(showToast = false) {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setLeads([]);
      setIsLoading(false);
      toast.error({
        title: "Client Copilot Failed",
        description: "Could not load assessment submissions. Check the tax_leads table and permissions.",
      });
      return;
    }

    const mapped = (data || [])
      .map((lead) => mapLead(lead as LeadRecord))
      .filter((lead) => lead.stage !== "Completed / Archived")
      .sort((a, b) => b.score - a.score || b.projectedRevenue - a.projectedRevenue);

    setLeads(mapped);
    setIsLoading(false);

    if (showToast) {
      toast.success({
        title: "Client Copilot Refreshed",
        description: `${mapped.length} active opportunities loaded.`,
      });
    }
  }

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const priorityLeads = useMemo(() => leads.filter((lead) => lead.score >= 80), [leads]);

  const meetingReady = useMemo(() => leads.filter((lead) => lead.stage === "Meeting Scheduled"), [leads]);

  const proposalSent = useMemo(() => leads.filter((lead) => lead.stage === "Proposal Sent"), [leads]);

  const projectedRevenue = useMemo(() => leads.reduce((sum, lead) => sum + lead.projectedRevenue, 0), [leads]);

  const stageCounts = useMemo(
    () =>
      ACTIVE_STAGES.map((stage) => ({
        stage,
        count: leads.filter((lead) => lead.stage === stage).length,
      })),
    [leads],
  );

  const topLead = leads[0];

  async function copyText(text: string, successTitle: string, successDescription: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success({ title: successTitle, description: successDescription });
    } catch (error) {
      console.error(error);
      toast.error({ title: "Copy Failed", description: "Your browser blocked clipboard access." });
    }
  }

  function copyLeadBrief(lead: CopilotLead) {
    copyText(buildLeadBrief(lead), "Brief Copied", `${lead.name}'s Client Copilot brief is ready to paste.`);
  }

  function copyExecutiveSummary() {
    const summary = topLead
      ? [
          "Client Copilot Executive Summary",
          `Active Opportunities: ${leads.length}`,
          `Priority Leads: ${priorityLeads.length}`,
          `Projected Annual Revenue: ${formatCurrency(projectedRevenue)}`,
          `Recommended Focus: Start with ${topLead.name}. Score ${topLead.score}/100. Projected annual revenue ${formatCurrency(topLead.projectedRevenue)}.`,
          `Next Action: ${topLead.recommendation}`,
        ].join("\n")
      : "Client Copilot Executive Summary\nNo active opportunities are currently in the queue.";

    copyText(summary, "Executive Summary Copied", "Client Copilot summary is ready to paste.");
  }

  function exportQueue() {
    const exported = downloadCsv("unity-tax-client-copilot.csv", leads.map(leadToCsvRow));

    if (!exported) {
      toast.error({ title: "Nothing to Export", description: "There are no active opportunities in Client Copilot yet." });
      return;
    }

    toast.success({ title: "Export Started", description: "Client Copilot queue is downloading as a CSV." });
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Client Copilot"
        subtitle="Prioritize prospects, prepare meetings, and move opportunities forward."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <UnityPageHero
          eyebrow="Client Copilot"
          title="Advisor opportunity command center."
          description="Turn submitted assessments into prioritized opportunities. Client Copilot helps you identify the strongest prospects, prepare better meetings, and move qualified leads toward engagement."
          action={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <UnityButton variant="secondary" onClick={copyExecutiveSummary}>
                <Clipboard className="h-4 w-4" />
                Copy Summary
              </UnityButton>
              <UnityButton variant="secondary" onClick={exportQueue}>
                <Download className="h-4 w-4" />
                Export CSV
              </UnityButton>
              <UnityButton variant="secondary" onClick={() => loadLeads(true)}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </UnityButton>
            </div>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="Active Opportunities"
            value={isLoading ? "—" : String(leads.length)}
            detail="Not archived"
            tone="blue"
            icon={<ClipboardList className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Priority Leads"
            value={isLoading ? "—" : String(priorityLeads.length)}
            detail="Score 80+"
            tone="violet"
            icon={<Star className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Projected Revenue"
            value={isLoading ? "—" : formatCurrency(projectedRevenue)}
            detail="Estimated annual value"
            tone="emerald"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Meetings Ready"
            value={isLoading ? "—" : String(meetingReady.length)}
            detail="Needs prep brief"
            tone="yellow"
            icon={<CalendarDays className="h-6 w-6" />}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <UnityCard>
              <UnityCardHeader
                eyebrow="AI Executive Recommendation"
                title="Start here"
                description="This is the opportunity most worth reviewing first based on score, fit signals, and projected annual revenue."
              />

              <div className="mt-6">
                {isLoading ? (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                    Loading opportunities...
                  </p>
                ) : topLead ? (
                  <LeadMiniCard lead={topLead} onCopyBrief={copyLeadBrief} />
                ) : (
                  <UnityEmptyState
                    title="No active opportunities"
                    description="New submitted assessments will appear here automatically."
                  />
                )}
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Priority Queue"
                title="Best opportunities to review"
                description="Review each prospect, copy the advisor brief, and move the opportunity forward in Pipeline."
              />

              <div className="mt-6 space-y-5">
                {isLoading ? (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                    Loading priority queue...
                  </p>
                ) : leads.length === 0 ? (
                  <UnityEmptyState
                    title="No leads in queue"
                    description="Once prospects complete the assessment, they will appear here."
                  />
                ) : (
                  leads.slice(0, 10).map((lead) => (
                    <LeadMiniCard key={lead.id} lead={lead} onCopyBrief={copyLeadBrief} />
                  ))
                )}
              </div>
            </UnityCard>
          </div>

          <div className="space-y-6">
            <UnityCard>
              <UnityCardHeader
                eyebrow="Advisor Guidance"
                title="What matters right now"
                description="Client Copilot helps you focus on the highest-value action instead of digging through raw submissions."
              />

              <div className="mt-6">
                <UnityAIInsight title="Recommended Focus">
                  {topLead ? (
                    <>
                      Start with <strong>{topLead.name}</strong>. This prospect has a priority score of{" "}
                      <strong>{topLead.score}/100</strong> and projected annual revenue of{" "}
                      <strong>{formatCurrency(topLead.projectedRevenue)}</strong>. Copy the brief, review the assessment, and move the next action forward in Pipeline.
                    </>
                  ) : (
                    <>
                      Your opportunity queue is clear. Focus on campaign performance, landing-page traffic, and new assessment generation.
                    </>
                  )}
                </UnityAIInsight>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Stage Pressure"
                title="Where attention is needed"
                description="These counts show where follow-up risk or prep work is building up."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {stageCounts.map(({ stage, count }) => (
                  <StagePill key={stage} stage={stage} count={count} />
                ))}
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Launch Workflow"
                title="One-click advisor actions"
                description="Every action routes to a working launch page so Client Copilot does not create dead ends."
              />

              <div className="mt-6 grid gap-4">
                <ActionCard
                  icon={<Target className="h-5 w-5" />}
                  title="Open Pipeline"
                  description="Move opportunities by stage and archive completed items."
                  href="/mission-control/pipeline"
                  variant="primary"
                />

                <ActionCard
                  icon={<FileText className="h-5 w-5" />}
                  title="Open Assessments"
                  description="Review raw assessment submissions and intake details."
                  href="/mission-control/assessments"
                  variant="ai"
                />

                <ActionCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  title="Revenue Intelligence"
                  description="See which sources and campaigns create pipeline value."
                  href="/mission-control/revenue"
                  variant="secondary"
                />
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Opportunity Signals"
                title="What Copilot is scoring"
                description="Current scoring is rule-based and launch-ready. AI scoring can be layered in later."
              />

              <div className="mt-6 grid gap-3">
                {[
                  { label: "Household income", icon: <CircleDollarSign className="h-5 w-5 text-emerald-300" /> },
                  { label: "Business ownership", icon: <ShieldCheck className="h-5 w-5 text-emerald-300" /> },
                  { label: "Rental real estate", icon: <CheckCircle2 className="h-5 w-5 text-emerald-300" /> },
                  { label: "Retirement account complexity", icon: <UserRoundCheck className="h-5 w-5 text-emerald-300" /> },
                  { label: "Capital gains / equity compensation", icon: <TrendingUp className="h-5 w-5 text-emerald-300" /> },
                  { label: "Charitable and estate planning signals", icon: <Zap className="h-5 w-5 text-emerald-300" /> },
                ].map((signal) => (
                  <div key={signal.label} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    {signal.icon}
                    <p className="text-sm font-bold text-slate-300">{signal.label}</p>
                  </div>
                ))}
              </div>
            </UnityCard>
          </div>
        </div>
      </div>
    </div>
  );
}
