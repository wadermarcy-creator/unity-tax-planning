"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  Target,
  UserRound,
} from "lucide-react";
import { useParams } from "next/navigation";
import Header from "@/components/mission-control/Header";
import LeadScoreCard from "@/components/client-copilot/LeadScoreCard";
import MeetingPrepCard from "@/components/client-copilot/MeetingPrepCard";
import OpportunitySummaryCard from "@/components/client-copilot/OpportunitySummaryCard";
import AdvisorNotesCard from "@/components/client-copilot/AdvisorNotesCard";
import NextActionsCard from "@/components/client-copilot/NextActionsCard";
import ProposalPreviewCard from "@/components/client-copilot/ProposalPreviewCard";
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

const PIPELINE_STAGES = [
  "New Assessment",
  "Qualified",
  "Meeting Scheduled",
  "Proposal Sent",
  "Won",
  "Sent to Hazel",
  "Completed / Archived",
];

function formatCurrency(value: number) {
  if (!value) return "Unknown";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getLeadName(lead: LeadRecord | null) {
  if (!lead) return "Loading Prospect";
  return (
    lead.full_name ||
    lead.name ||
    lead.first_name ||
    lead.email ||
    "Unnamed Prospect"
  );
}

function getLeadEmail(lead: LeadRecord | null) {
  if (!lead) return "No email";
  return lead.email || lead.email_address || "No email";
}

function getLeadPhone(lead: LeadRecord | null) {
  if (!lead) return "No phone";
  return lead.phone || lead.phone_number || "No phone";
}

function getLeadOccupation(lead: LeadRecord | null) {
  if (!lead) return "Occupation not provided";
  return (
    lead.occupation ||
    lead.profession ||
    lead.job_title ||
    lead.industry ||
    "Occupation not provided"
  );
}

function getLeadCreatedAt(lead: LeadRecord | null) {
  if (!lead) return "Unknown date";

  const value = lead.created_at || lead.submitted_at || lead.inserted_at;
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getLeadIncome(lead: LeadRecord | null) {
  if (!lead) return 0;

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

function calculateLeadScore(lead: LeadRecord | null) {
  if (!lead) return 0;

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

function getCloseProbability(score: number) {
  if (score >= 90) return 82;
  if (score >= 80) return 68;
  if (score >= 70) return 54;
  return 35;
}

function getStoredStage(lead: LeadRecord | null) {
  if (!lead) return "New Assessment";
  return (
    lead.pipeline_stage ||
    lead.stage ||
    lead.status ||
    lead.lead_status ||
    "New Assessment"
  );
}

function normalizeStage(stage: string, score: number) {
  const normalized = String(stage || "").toLowerCase();

  if (normalized.includes("completed") || normalized.includes("archived")) return "Completed / Archived";
  if (normalized.includes("hazel")) return "Sent to Hazel";
  if (normalized.includes("won") || normalized.includes("client")) return "Won";
  if (normalized.includes("proposal")) return "Proposal Sent";
  if (normalized.includes("meeting") || normalized.includes("scheduled")) return "Meeting Scheduled";
  if (normalized.includes("qualified")) return "Qualified";
  if (normalized.includes("new")) return "New Assessment";

  return score >= 80 ? "Qualified" : "New Assessment";
}

function getScoreTone(score: number): "emerald" | "blue" | "yellow" | "slate" {
  if (score >= 90) return "emerald";
  if (score >= 80) return "blue";
  if (score >= 70) return "yellow";
  return "slate";
}

function getStageTone(stage: string): "blue" | "violet" | "emerald" | "yellow" | "slate" {
  if (stage === "New Assessment") return "blue";
  if (stage === "Qualified") return "yellow";
  if (stage === "Meeting Scheduled") return "violet";
  if (stage === "Proposal Sent") return "violet";
  if (stage === "Won") return "emerald";
  return "slate";
}

function getOpportunitySummary(lead: LeadRecord | null) {
  if (!lead) return undefined;

  const occupation = getLeadOccupation(lead);
  const income = getLeadIncome(lead);
  const text = JSON.stringify(lead).toLowerCase();

  const signals: string[] = [];

  if (income >= 300000) signals.push("high household income");
  if (text.includes("business") || text.includes("owner")) signals.push("business ownership");
  if (text.includes("rental") || text.includes("real estate")) signals.push("real estate or rental activity");
  if (text.includes("retire") || text.includes("ira") || text.includes("401")) signals.push("retirement planning complexity");
  if (text.includes("estate") || text.includes("trust")) signals.push("estate planning needs");

  const signalText =
    signals.length > 0
      ? signals.join(", ")
      : "potential tax planning complexity";

  return `${getLeadName(lead)} appears to be a planning opportunity based on ${signalText}. Before the first meeting, review the assessment answers carefully and prepare questions around income, investment accounts, retirement planning, estate planning, and current CPA coordination. Occupation: ${occupation}.`;
}

function getOpportunities(lead: LeadRecord | null) {
  if (!lead) {
    return [
      "Tax planning review",
      "Retirement planning review",
      "Investment tax efficiency",
    ];
  }

  const text = JSON.stringify(lead).toLowerCase();
  const opportunities = new Set<string>();

  opportunities.add("Tax return review");
  opportunities.add("Investment tax efficiency");
  opportunities.add("Retirement contribution strategy");

  if (getLeadIncome(lead) >= 200000) {
    opportunities.add("Roth conversion analysis");
    opportunities.add("Backdoor Roth review");
  }

  if (text.includes("business") || text.includes("owner")) {
    opportunities.add("Business deduction review");
    opportunities.add("Entity and compensation planning");
  }

  if (text.includes("rental") || text.includes("real estate")) {
    opportunities.add("Rental property depreciation review");
    opportunities.add("Cost segregation discussion");
  }

  if (text.includes("charity") || text.includes("donor") || text.includes("daf")) {
    opportunities.add("Charitable giving optimization");
    opportunities.add("Donor-advised fund review");
  }

  if (text.includes("estate") || text.includes("trust")) {
    opportunities.add("Estate and trust coordination");
  }

  return Array.from(opportunities).slice(0, 8);
}

function StrategyCard({ title, description, priority }: { title: string; description: string; priority: number }) {
  const tone = priority <= 2 ? "emerald" : priority <= 4 ? "blue" : "slate";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <UnityBadge tone={tone}>#{priority}</UnityBadge>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  tone = "blue",
}: {
  title: string;
  description: string;
  tone?: "blue" | "violet" | "emerald" | "yellow" | "slate";
}) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-blue-400 shadow-lg shadow-blue-500/30" />
      <div className="absolute bottom-[-1.25rem] left-[5px] top-5 w-px bg-slate-800" />
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black text-white">{title}</p>
          <UnityBadge tone={tone}>{tone}</UnityBadge>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default function ClientCopilotOpportunityPage() {
  const toast = useToast();
  const params = useParams();
  const id = String(params.id || "");
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingStage, setIsSavingStage] = useState(false);

  async function loadLead(showToast = false) {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLead(null);
      setIsLoading(false);
      toast.error({
        title: "Opportunity Not Loaded",
        description: "Could not load this prospect workspace.",
      });
      return;
    }

    setLead(data as LeadRecord);
    setIsLoading(false);

    if (showToast) {
      toast.success({
        title: "Workspace Refreshed",
        description: `${getLeadName(data as LeadRecord)} is up to date.`,
      });
    }
  }

  useEffect(() => {
    loadLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const score = useMemo(() => calculateLeadScore(lead), [lead]);
  const income = useMemo(() => getLeadIncome(lead), [lead]);
  const projectedRevenue = useMemo(
    () => getProjectedRevenue(score, income),
    [score, income],
  );
  const closeProbability = useMemo(() => getCloseProbability(score), [score]);
  const summary = useMemo(() => getOpportunitySummary(lead), [lead]);
  const opportunities = useMemo(() => getOpportunities(lead), [lead]);
  const stage = useMemo(
    () => normalizeStage(String(getStoredStage(lead)), score),
    [lead, score],
  );

  async function updateStage(nextStage: string) {
    if (!lead) return;

    setIsSavingStage(true);
    const previousLead = lead;

    setLead({
      ...lead,
      pipeline_stage: nextStage,
    });

    const { error } = await supabase
      .from("tax_leads")
      .update({ pipeline_stage: nextStage })
      .eq("id", id);

    if (error) {
      console.error(error);
      setLead(previousLead);
      toast.error({
        title: "Stage Not Saved",
        description: "Could not update the opportunity stage.",
      });
    } else {
      toast.success({
        title: nextStage === "Sent to Hazel" ? "Sent to Hazel" : "Stage Updated",
        description: `${getLeadName(lead)} moved to ${nextStage}.`,
      });
    }

    setIsSavingStage(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Client Copilot"
          subtitle="Loading opportunity workspace..."
        />
        <div className="p-10 text-slate-400">Loading opportunity...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen">
        <Header
          title="Opportunity Not Found"
          subtitle="This opportunity could not be loaded."
        />

        <div className="p-10">
          <UnityButton href="/mission-control/client-copilot" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Client Copilot
          </UnityButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Client Copilot"
        subtitle="Advisor command center for this opportunity."
      />

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <UnityButton
            href="/mission-control/client-copilot"
            variant="ghost"
            className="px-0 py-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Client Copilot
          </UnityButton>

          <UnityButton variant="secondary" onClick={() => loadLead(true)}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </UnityButton>
        </div>

        <UnityPageHero
          eyebrow="Opportunity Workspace"
          title={getLeadName(lead)}
          description={`${getLeadOccupation(
            lead,
          )} · Submitted ${getLeadCreatedAt(
            lead,
          )}. Use this workspace to score, prepare, position, and move the prospect toward engagement.`}
          action={
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-violet-200">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em]">
                    Copilot Mode
                  </p>
                  <p className="text-xl font-black">Advisor Cockpit</p>
                </div>
              </div>
            </div>
          }
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="Lead Score"
            value={`${score}/100`}
            detail={score >= 80 ? "Priority opportunity" : "Needs review"}
            tone={getScoreTone(score)}
            icon={<Star className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Projected Revenue"
            value={formatCurrency(projectedRevenue)}
            detail="Estimated annual value"
            tone="emerald"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Close Probability"
            value={`${closeProbability}%`}
            detail="Rule-based estimate"
            tone="blue"
            icon={<Target className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Current Stage"
            value={stage}
            detail="Pipeline status"
            tone={getStageTone(stage)}
            icon={<ClipboardCheck className="h-6 w-6" />}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <UnityCard>
              <UnityCardHeader
                eyebrow="Executive Summary"
                title="What this advisor should know"
                description="A launch-ready overview of the prospect, current stage, expected value, and recommended next action."
              />

              <div className="mt-6">
                <UnityAIInsight title="Client Copilot Guidance">
                  {summary}
                </UnityAIInsight>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Strategy Signals"
                title="Likely planning opportunities"
                description="These are not recommendations yet. They are areas to review, model, and coordinate with the client's tax professional."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {opportunities.length === 0 ? (
                  <UnityEmptyState
                    title="No opportunities detected"
                    description="Additional assessment detail may be needed."
                  />
                ) : (
                  opportunities.map((opportunity, index) => (
                    <StrategyCard
                      key={opportunity}
                      title={opportunity}
                      description="Review during discovery and determine whether this belongs in the engagement scope."
                      priority={index + 1}
                    />
                  ))
                )}
              </div>
            </UnityCard>

            <OpportunitySummaryCard
              summary={summary}
              opportunities={opportunities}
            />

            <MeetingPrepCard
              lead={lead}
              score={score}
              projectedRevenue={projectedRevenue}
            />

            <ProposalPreviewCard
              prospectName={getLeadName(lead)}
              projectedRevenue={projectedRevenue}
              opportunities={opportunities}
            />

            <AdvisorNotesCard initialNotes={lead.admin_notes || ""} />
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <UnityCard>
              <UnityCardHeader
                eyebrow="Quick Actions"
                title="Move the opportunity"
                description="Update status, prepare the meeting, and hand off to Hazel."
              />

              <label className="mt-6 block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Pipeline Stage
                </span>

                <select
                  value={stage}
                  disabled={isSavingStage}
                  onChange={(event) => updateStage(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-black text-white outline-none focus:border-blue-500 disabled:opacity-60"
                >
                  {PIPELINE_STAGES.map((pipelineStage) => (
                    <option key={pipelineStage} value={pipelineStage}>
                      {pipelineStage}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 grid gap-3">
                <UnityButton
                  variant="success"
                  onClick={() => updateStage("Sent to Hazel")}
                  disabled={isSavingStage}
                >
                  <Send className="h-4 w-4" />
                  Send to Hazel
                </UnityButton>

                <UnityButton
                  variant="secondary"
                  onClick={() => updateStage("Proposal Sent")}
                  disabled={isSavingStage}
                >
                  <FileText className="h-4 w-4" />
                  Mark Proposal Sent
                </UnityButton>

                <UnityButton
                  href="/mission-control/pipeline"
                  variant="secondary"
                >
                  Open Pipeline <ArrowRight className="h-4 w-4" />
                </UnityButton>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Prospect Profile"
                title="Contact details"
                description="Core intake information for quick reference."
              />

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <UserRound className="mt-1 h-5 w-5 text-blue-300" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Occupation
                    </p>
                    <p className="mt-1 font-bold text-white">
                      {getLeadOccupation(lead)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <Mail className="mt-1 h-5 w-5 text-blue-300" />
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Email
                    </p>
                    <p className="mt-1 truncate font-bold text-white">
                      {getLeadEmail(lead)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <Phone className="mt-1 h-5 w-5 text-blue-300" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Phone
                    </p>
                    <p className="mt-1 font-bold text-white">
                      {getLeadPhone(lead)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <CalendarDays className="mt-1 h-5 w-5 text-blue-300" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Submitted
                    </p>
                    <p className="mt-1 font-bold text-white">
                      {getLeadCreatedAt(lead)}
                    </p>
                  </div>
                </div>
              </div>
            </UnityCard>

            <LeadScoreCard
              score={score}
              projectedRevenue={projectedRevenue}
              closeProbability={closeProbability}
            />

            <NextActionsCard />

            <UnityCard>
              <UnityCardHeader
                eyebrow="Activity Timeline"
                title="Opportunity progress"
                description="Simple launch-ready timeline for advisor context."
              />

              <div className="mt-6 space-y-5">
                <TimelineItem
                  title="Assessment Submitted"
                  description={`${getLeadName(lead)} completed the tax opportunity assessment.`}
                  tone="blue"
                />
                <TimelineItem
                  title={`Stage: ${stage}`}
                  description="Current pipeline status based on advisor workflow."
                  tone={getStageTone(stage)}
                />
                <TimelineItem
                  title="Next Best Action"
                  description={
                    stage === "Meeting Scheduled"
                      ? "Generate the AI meeting brief before the call."
                      : stage === "Proposal Sent"
                        ? "Follow up with a clear next step."
                        : "Review the assessment and determine the next step."
                  }
                  tone="violet"
                />
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Document Checklist"
                title="Request next"
                description="Common documents to collect before strategy work."
              />

              <div className="mt-6 grid gap-3">
                {[
                  "Most recent tax return",
                  "Current paystub or income summary",
                  "Investment account statements",
                  "Retirement account statements",
                  "Business or rental entity details",
                  "Estate documents if applicable",
                ].map((document) => (
                  <div
                    key={document}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <p className="text-sm font-bold text-slate-300">
                      {document}
                    </p>
                  </div>
                ))}
              </div>
            </UnityCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
