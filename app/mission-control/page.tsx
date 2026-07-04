"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CalendarDays, CircleDollarSign, ClipboardList, Flame, RefreshCw, Sparkles, Star, Target, TrendingUp } from "lucide-react";
import Header from "@/components/mission-control/Header";
import { UnityAIInsight, UnityBadge, UnityButton, UnityCard, UnityCardHeader, UnityEmptyState, UnityMetricCard, UnityPageHero, useToast } from "@/components/ui";
import { supabase } from "@/lib/supabase";

type LeadRecord = Record<string, any>;

type BriefOpportunity = {
  id: string;
  name: string;
  occupation: string;
  stage: string;
  score: number;
  projectedRevenue: number;
  createdAt?: string;
  recommendation: string;
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

function getLeadName(lead: LeadRecord) {
  return lead.full_name || lead.name || lead.first_name || lead.email || "Unnamed Prospect";
}

function getLeadOccupation(lead: LeadRecord) {
  return lead.occupation || lead.profession || lead.job_title || lead.industry || "Occupation not provided";
}

function getLeadIncome(lead: LeadRecord) {
  const possibleValues = [lead.income, lead.annual_income, lead.household_income, lead.estimated_income];

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
  return lead.pipeline_stage || lead.stage || lead.status || lead.lead_status || "";
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

function getRecommendation(stage: string, score: number) {
  if (stage === "New Assessment") return score >= 80 ? "Review today. This prospect is likely worth moving forward." : "Review and decide whether this prospect is a fit.";
  if (stage === "Qualified") return "Schedule the strategy conversation and prepare outreach.";
  if (stage === "Meeting Scheduled") return "Generate the AI meeting brief before the call.";
  if (stage === "Proposal Sent") return "Follow up with a clear next step and address likely objections.";
  if (stage === "Won") return "Begin onboarding and prepare Hazel handoff.";
  if (stage === "Sent to Hazel") return "Track planning progress and implementation tasks.";
  return "Review next best action.";
}

function mapLeadToBriefOpportunity(lead: LeadRecord): BriefOpportunity {
  const score = calculateLeadScore(lead);
  const income = getLeadIncome(lead);
  const stage = assignStage(lead, score);

  return {
    id: String(lead.id),
    name: getLeadName(lead),
    occupation: getLeadOccupation(lead),
    stage,
    score,
    projectedRevenue: getProjectedRevenue(score, income),
    createdAt: lead.created_at || lead.submitted_at || lead.inserted_at,
    recommendation: getRecommendation(stage, score),
  };
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

function FocusCard({ opportunity }: { opportunity: BriefOpportunity }) {
  return (
    <UnityCard>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black text-white">{opportunity.name}</h3>
            <UnityBadge tone={getScoreTone(opportunity.score)}>{opportunity.score}/100</UnityBadge>
            <UnityBadge tone={getStageTone(opportunity.stage)}>{opportunity.stage}</UnityBadge>
          </div>

          <p className="mt-3 text-sm font-bold text-slate-400">{opportunity.occupation}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Submitted {formatDate(opportunity.createdAt)}
            </span>

            <span className="inline-flex items-center gap-2 text-emerald-300">
              <CircleDollarSign className="h-4 w-4" />
              {formatCurrency(opportunity.projectedRevenue)} projected
            </span>
          </div>
        </div>

        <UnityButton href={`/mission-control/client-copilot/opportunities/${opportunity.id}`}>
          Open Workspace <ArrowRight className="h-4 w-4" />
        </UnityButton>
      </div>

      <div className="mt-6">
        <UnityAIInsight title="Recommended Action">{opportunity.recommendation}</UnityAIInsight>
      </div>
    </UnityCard>
  );
}

export default function MissionControlMorningBriefPage() {
  const toast = useToast();
  const [opportunities, setOpportunities] = useState<BriefOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadBrief() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setOpportunities([]);
      setIsLoading(false);
      toast.error({
        title: "Morning Brief Failed",
        description: "Could not load Mission Control data.",
      });
      return;
    }

    const mapped = (data || [])
      .map((lead) => mapLeadToBriefOpportunity(lead as LeadRecord))
      .sort((a, b) => b.score - a.score);

    setOpportunities(mapped);
    setIsLoading(false);
  }

  useEffect(() => {
    loadBrief();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeOpportunities = useMemo(
    () => opportunities.filter((opportunity) => opportunity.stage !== "Completed / Archived"),
    [opportunities],
  );

  const topFocus = activeOpportunities[0];

  const priorityOpportunities = useMemo(
    () => activeOpportunities.filter((opportunity) => opportunity.score >= 80).slice(0, 5),
    [activeOpportunities],
  );

  const proposalOpportunities = useMemo(
    () => activeOpportunities.filter((opportunity) => opportunity.stage === "Proposal Sent"),
    [activeOpportunities],
  );

  const meetingOpportunities = useMemo(
    () => activeOpportunities.filter((opportunity) => opportunity.stage === "Meeting Scheduled"),
    [activeOpportunities],
  );

  const pipelineRevenue = useMemo(
    () => activeOpportunities.reduce((sum, opportunity) => sum + opportunity.projectedRevenue, 0),
    [activeOpportunities],
  );

  const expectedRevenue = Math.round(pipelineRevenue * 0.58);
  const archivedCount = opportunities.length - activeOpportunities.length;

  return (
    <div className="min-h-screen">
      <Header title="Mission Control" subtitle="Your daily operating brief for proactive tax planning." />

      <div className="px-6 py-8 lg:px-10">
        <UnityPageHero
          eyebrow="Morning Brief"
          title="Good morning, Wade."
          description="Mission Control has reviewed your opportunity pipeline and surfaced the highest-value actions to focus on today."
          action={
            <UnityButton variant="secondary" onClick={loadBrief}>
              <RefreshCw className="h-4 w-4" />
              Refresh Brief
            </UnityButton>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="Active Opportunities"
            value={String(activeOpportunities.length)}
            detail={`${archivedCount} archived`}
            tone="blue"
            icon={<ClipboardList className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Priority Leads"
            value={String(priorityOpportunities.length)}
            detail="Score 80+"
            tone="violet"
            icon={<Star className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Pipeline Forecast"
            value={formatCurrency(pipelineRevenue)}
            detail="Projected annual revenue"
            tone="emerald"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Expected Close"
            value={formatCurrency(expectedRevenue)}
            detail="Model estimate"
            tone="yellow"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <UnityCard>
              <UnityCardHeader
                eyebrow="Today's Focus"
                title="Highest-priority opportunity"
                description="Start here first. This is the most valuable active opportunity based on lead score and projected annual revenue."
                action={
                  <UnityBadge tone="emerald">
                    <Flame className="mr-1 h-3 w-3" />
                    Focus
                  </UnityBadge>
                }
              />

              <div className="mt-6">
                {isLoading ? (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                    Building morning brief...
                  </p>
                ) : topFocus ? (
                  <FocusCard opportunity={topFocus} />
                ) : (
                  <UnityEmptyState
                    title="No active opportunities"
                    description="Your active pipeline is clear. New assessments will appear here automatically."
                  />
                )}
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Priority Opportunities"
                title="Top prospects to review"
                description="These are the prospects most likely to deserve advisor attention today."
              />

              <div className="mt-6 space-y-4">
                {priorityOpportunities.length === 0 ? (
                  <UnityEmptyState
                    title="No priority leads yet"
                    description="Priority opportunities appear when a lead scores 80 or higher."
                  />
                ) : (
                  priorityOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-black text-white">{opportunity.name}</p>
                            <UnityBadge tone={getScoreTone(opportunity.score)}>{opportunity.score}/100</UnityBadge>
                            <UnityBadge tone={getStageTone(opportunity.stage)}>{opportunity.stage}</UnityBadge>
                          </div>

                          <p className="mt-2 text-sm text-slate-400">{opportunity.recommendation}</p>
                        </div>

                        <UnityButton
                          href={`/mission-control/client-copilot/opportunities/${opportunity.id}`}
                          variant="secondary"
                        >
                          Open
                        </UnityButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </UnityCard>
          </div>

          <div className="space-y-6">
            <UnityCard>
              <UnityCardHeader
                eyebrow="Executive Recommendation"
                title="What matters today"
                description="A simple operating summary based on the current state of your pipeline."
              />

              <div className="mt-6">
                <UnityAIInsight title="Mission Control Recommendation">
                  {topFocus ? (
                    <>
                      Start with <strong>{topFocus.name}</strong>. This opportunity
                      has the highest current priority score and a projected annual
                      value of <strong>{formatCurrency(topFocus.projectedRevenue)}</strong>.
                      After that, review proposal-stage opportunities and prepare
                      meeting briefs for scheduled calls.
                    </>
                  ) : (
                    <>
                      Your active pipeline is clear. Focus on campaign generation,
                      assessment volume, and follow-up systems to create new opportunities.
                    </>
                  )}
                </UnityAIInsight>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Operating Snapshot"
                title="Stage pressure"
                description="Quickly see where work is building up."
              />

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                        Meetings Scheduled
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Prep these before the call.
                      </p>
                    </div>
                    <p className="text-3xl font-black text-white">{meetingOpportunities.length}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
                        Proposals Sent
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Follow-up risk lives here.
                      </p>
                    </div>
                    <p className="text-3xl font-black text-white">{proposalOpportunities.length}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                        Active Forecast
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Revenue currently in motion.
                      </p>
                    </div>
                    <p className="text-3xl font-black text-white">{formatCurrency(pipelineRevenue)}</p>
                  </div>
                </div>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Quick Actions"
                title="Move faster"
                description="Jump into the highest-value workflows."
              />

              <div className="mt-6 grid gap-3">
                <UnityButton href="/mission-control/pipeline">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Open Pipeline
                </UnityButton>

                <UnityButton href="/mission-control/client-copilot" variant="secondary">
                  <Target className="h-4 w-4" />
                  Open Client Copilot
                </UnityButton>

                <UnityButton href="/mission-control/marketing/campaign-factory" variant="ai">
                  <Sparkles className="h-4 w-4" />
                  Open Campaign Factory
                </UnityButton>
              </div>
            </UnityCard>
          </div>
        </div>
      </div>
    </div>
  );
}
