"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRound,
  Users,
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
];

function formatCurrency(value: number) {
  if (!value) return "Unknown";

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
    year: "numeric",
  }).format(new Date(value));
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

function getLeadEmail(lead: LeadRecord) {
  return lead.email || lead.email_address || "No email";
}

function getLeadPhone(lead: LeadRecord) {
  return lead.phone || lead.phone_number || "No phone";
}

function getLeadOccupation(lead: LeadRecord) {
  return (
    lead.occupation ||
    lead.profession ||
    lead.job_title ||
    lead.industry ||
    "Occupation not provided"
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

  if (stage === "Qualified") {
    return "Schedule a strategy conversation and prepare advisor talking points.";
  }

  if (stage === "Meeting Scheduled") {
    return "Generate the AI meeting brief before the call.";
  }

  if (stage === "Proposal Sent") {
    return "Follow up with a clear next step and address likely objections.";
  }

  if (stage === "Won") {
    return "Start onboarding and prepare the Hazel handoff.";
  }

  if (stage === "Sent to Hazel") {
    return "Track plan progress and implementation tasks.";
  }

  return "Review next best action.";
}

function mapLead(lead: LeadRecord): CopilotLead {
  const score = calculateLeadScore(lead);
  const income = getLeadIncome(lead);
  const stage = assignStage(lead, score);

  return {
    id: String(lead.id),
    name: getLeadName(lead),
    email: getLeadEmail(lead),
    phone: getLeadPhone(lead),
    occupation: getLeadOccupation(lead),
    stage,
    score,
    income,
    projectedRevenue: getProjectedRevenue(score, income),
    createdAt: lead.created_at || lead.submitted_at || lead.inserted_at,
    recommendation: getRecommendation(stage, score),
    opportunities: getOpportunities(lead),
  };
}

function LeadMiniCard({ lead }: { lead: CopilotLead }) {
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

          <p className="mt-3 text-sm font-bold text-slate-400">
            {lead.occupation}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
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
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Income
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {lead.income ? formatCurrency(lead.income) : "Unknown"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Projected Revenue
            </p>
            <p className="mt-2 text-xl font-black text-emerald-300">
              {formatCurrency(lead.projectedRevenue)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
        <UnityAIInsight title="Recommended Action">
          {lead.recommendation}
        </UnityAIInsight>

        <UnityButton
          href={`/mission-control/client-copilot/opportunities/${lead.id}`}
        >
          Open Workspace <ArrowRight className="h-4 w-4" />
        </UnityButton>
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
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  variant?: "primary" | "secondary" | "ai" | "success";
}) {
  return (
    <UnityCard className="p-5">
      <div className="flex gap-4">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 text-blue-300">
          {icon}
        </div>
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
        description: "Could not load assessment submissions.",
      });
      return;
    }

    const mapped = (data || [])
      .map((lead) => mapLead(lead as LeadRecord))
      .filter((lead) => lead.stage !== "Completed / Archived")
      .sort((a, b) => b.score - a.score);

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

  const priorityLeads = useMemo(
    () => leads.filter((lead) => lead.score >= 80),
    [leads],
  );

  const meetingReady = useMemo(
    () => leads.filter((lead) => lead.stage === "Meeting Scheduled"),
    [leads],
  );

  const proposalSent = useMemo(
    () => leads.filter((lead) => lead.stage === "Proposal Sent"),
    [leads],
  );

  const projectedRevenue = useMemo(
    () => leads.reduce((sum, lead) => sum + lead.projectedRevenue, 0),
    [leads],
  );

  const topLead = leads[0];

  return (
    <div className="min-h-screen">
      <Header
        title="Client Copilot"
        subtitle="Prioritize prospects, prepare meetings, and move opportunities forward."
      />

      <div className="px-6 py-8 lg:px-10">
        <UnityPageHero
          eyebrow="Client Copilot"
          title="Advisor opportunity command center."
          description="Turn submitted assessments into prioritized opportunities. Client Copilot helps you identify the strongest prospects, prepare better meetings, and move qualified leads toward engagement."
          action={
            <UnityButton variant="secondary" onClick={() => loadLeads(true)}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </UnityButton>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="Active Opportunities"
            value={String(leads.length)}
            detail="Not archived"
            tone="blue"
            icon={<ClipboardList className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Priority Leads"
            value={String(priorityLeads.length)}
            detail="Score 80+"
            tone="violet"
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
            label="Meetings Ready"
            value={String(meetingReady.length)}
            detail="Needs prep brief"
            tone="yellow"
            icon={<CalendarDays className="h-6 w-6" />}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <UnityCard>
              <UnityCardHeader
                eyebrow="Highest Priority"
                title="Start here"
                description="This is the opportunity most worth reviewing first based on score and projected annual revenue."
              />

              <div className="mt-6">
                {isLoading ? (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                    Loading opportunities...
                  </p>
                ) : topLead ? (
                  <LeadMiniCard lead={topLead} />
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
                description="Open each workspace to generate meeting prep, review opportunities, and frame the proposal."
              />

              <div className="mt-6 space-y-5">
                {isLoading ? (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                    Loading priority queue...
                  </p>
                ) : leads.length === 0 ? (
                  <UnityEmptyState
                    title="No leads in queue"
                    description="Once prospects complete the assessment, they'll appear here."
                  />
                ) : (
                  leads.slice(0, 10).map((lead) => (
                    <LeadMiniCard key={lead.id} lead={lead} />
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
                      Start with <strong>{topLead.name}</strong>. This prospect
                      has a score of <strong>{topLead.score}/100</strong> and a
                      projected annual value of{" "}
                      <strong>{formatCurrency(topLead.projectedRevenue)}</strong>.
                      Open the workspace and generate the AI meeting brief before
                      any outreach.
                    </>
                  ) : (
                    <>
                      Your opportunity queue is clear. Focus on campaign
                      performance, landing-page traffic, and new assessment
                      generation.
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

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                        Meeting Prep Needed
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Generate AI brief before the call.
                      </p>
                    </div>
                    <p className="text-3xl font-black text-white">
                      {meetingReady.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
                        Proposal Follow-Up
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Follow-up risk lives here.
                      </p>
                    </div>
                    <p className="text-3xl font-black text-white">
                      {proposalSent.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                        Priority Queue
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Prospects worth reviewing first.
                      </p>
                    </div>
                    <p className="text-3xl font-black text-white">
                      {priorityLeads.length}
                    </p>
                  </div>
                </div>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Launch Workflow"
                title="Advisor actions"
                description="Jump into the most important workflows."
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
                  icon={<TrendingUp className="h-5 w-5" />}
                  title="Revenue Intelligence"
                  description="See which sources and campaigns create pipeline value."
                  href="/mission-control/revenue"
                  variant="secondary"
                />

                <ActionCard
                  icon={<FileText className="h-5 w-5" />}
                  title="Assessments"
                  description="Review raw assessment submissions and intake details."
                  href="/mission-control/assessments"
                  variant="ai"
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
                  "Household income",
                  "Business ownership",
                  "Rental real estate",
                  "Retirement account complexity",
                  "Capital gains / equity compensation",
                  "Charitable and estate planning signals",
                ].map((signal) => (
                  <div
                    key={signal}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <p className="text-sm font-bold text-slate-300">{signal}</p>
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
