"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clipboard,
  ClipboardList,
  Download,
  Flame,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
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

type BriefOpportunity = {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  stage: string;
  score: number;
  projectedRevenue: number;
  createdAt?: string;
  recommendation: string;
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

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getLeadName(lead: LeadRecord) {
  return (
    lead.full_name ||
    lead.name ||
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    lead.email ||
    "Unnamed Prospect"
  );
}

function getLeadEmail(lead: LeadRecord) {
  return lead.email || lead.email_address || lead.contact_email || "";
}

function getLeadPhone(lead: LeadRecord) {
  return lead.phone || lead.phone_number || lead.mobile || lead.cell || "";
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
  if (stage === "New Assessment") {
    return score >= 80
      ? "Review today. This prospect is likely worth moving forward."
      : "Review and decide whether this prospect is a fit.";
  }

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
    email: getLeadEmail(lead),
    phone: getLeadPhone(lead),
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

function getMailToLink(opportunity: BriefOpportunity) {
  const subject = encodeURIComponent("Unity Tax Planning Follow-Up");
  const body = encodeURIComponent(
    `Hi ${opportunity.name},\n\nI reviewed your tax planning assessment and noticed a few areas that may be worth discussing. Would you be open to scheduling a strategy conversation?\n\nBest,\nWade`,
  );

  return opportunity.email ? `mailto:${opportunity.email}?subject=${subject}&body=${body}` : "/mission-control/client-copilot";
}

function createBriefText(opportunity: BriefOpportunity) {
  return [
    `Prospect: ${opportunity.name}`,
    `Occupation: ${opportunity.occupation}`,
    `Stage: ${opportunity.stage}`,
    `Priority Score: ${opportunity.score}/100`,
    `Projected Annual Revenue: ${formatCurrency(opportunity.projectedRevenue)}`,
    `Recommended Action: ${opportunity.recommendation}`,
  ].join("\n");
}

function csvEscape(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function exportCsv(filename: string, rows: BriefOpportunity[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Occupation",
    "Stage",
    "Priority Score",
    "Projected Annual Revenue",
    "Submitted",
    "Recommended Action",
  ];

  const body = rows.map((row) =>
    [
      row.name,
      row.email,
      row.phone,
      row.occupation,
      row.stage,
      row.score,
      row.projectedRevenue,
      row.createdAt || "",
      row.recommendation,
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [headers.map(csvEscape).join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function FocusCard({
  opportunity,
  onCopyBrief,
}: {
  opportunity: BriefOpportunity;
  onCopyBrief: (opportunity: BriefOpportunity) => void;
}) {
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

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[19rem] lg:grid-cols-1 xl:grid-cols-2">
          <UnityButton href="/mission-control/client-copilot">
            Open Copilot <ArrowRight className="h-4 w-4" />
          </UnityButton>

          <UnityButton href="/mission-control/assessments" variant="secondary">
            Review Assessment
          </UnityButton>

          <UnityButton onClick={() => onCopyBrief(opportunity)} variant="secondary">
            <Clipboard className="h-4 w-4" />
            Copy Brief
          </UnityButton>

          <UnityButton href={getMailToLink(opportunity)} variant="ai">
            <Mail className="h-4 w-4" />
            Email
          </UnityButton>
        </div>
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

  const qualifiedOpportunities = useMemo(
    () => activeOpportunities.filter((opportunity) => opportunity.stage === "Qualified"),
    [activeOpportunities],
  );

  const pipelineRevenue = useMemo(
    () => activeOpportunities.reduce((sum, opportunity) => sum + opportunity.projectedRevenue, 0),
    [activeOpportunities],
  );

  const expectedRevenue = Math.round(pipelineRevenue * 0.58);
  const archivedCount = opportunities.length - activeOpportunities.length;
  const priorityScore = topFocus?.score || 0;
  const nextAction = topFocus
    ? `Start with ${topFocus.name}. ${topFocus.recommendation}`
    : "Create assessment volume and campaign activity to seed the pipeline.";

  async function copyText(text: string, successTitle: string, successDescription: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success({
        title: successTitle,
        description: successDescription,
      });
    } catch (error) {
      console.error(error);
      toast.error({
        title: "Copy Failed",
        description: "The text could not be copied to your clipboard.",
      });
    }
  }

  function handleCopyBrief(opportunity: BriefOpportunity) {
    copyText(
      createBriefText(opportunity),
      "Brief Copied",
      `${opportunity.name}'s executive brief is ready to paste.`,
    );
  }

  function handleCopyExecutiveSummary() {
    const summary = [
      "Unity Tax Mission Control Morning Brief",
      `Active Opportunities: ${activeOpportunities.length}`,
      `Priority Leads: ${priorityOpportunities.length}`,
      `Priority Score: ${priorityScore}/100`,
      `Projected Annual Revenue: ${formatCurrency(pipelineRevenue)}`,
      `Expected Close Estimate: ${formatCurrency(expectedRevenue)}`,
      `Recommended Action: ${nextAction}`,
    ].join("\n");

    copyText(summary, "Executive Summary Copied", "Mission Control summary is ready to paste.");
  }

  function handleExportActive() {
    exportCsv("unity-tax-active-opportunities.csv", activeOpportunities);
    toast.success({
      title: "Export Ready",
      description: "Active opportunities CSV has been downloaded.",
    });
  }

  return (
    <div className="min-h-screen">
      <Header title="Mission Control" subtitle="Your daily operating brief for proactive tax planning." />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <UnityPageHero
          eyebrow="Morning Brief"
          title="Good morning, Wade."
          description="Mission Control has reviewed your opportunity pipeline and surfaced the highest-value actions to focus on today."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <UnityButton variant="secondary" onClick={handleCopyExecutiveSummary}>
                <Clipboard className="h-4 w-4" />
                Copy Brief
              </UnityButton>

              <UnityButton variant="secondary" onClick={handleExportActive}>
                <Download className="h-4 w-4" />
                Export CSV
              </UnityButton>

              <UnityButton variant="secondary" onClick={loadBrief}>
                <RefreshCw className="h-4 w-4" />
                Refresh Brief
              </UnityButton>
            </div>
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
            label="Priority Score"
            value={`${priorityScore}/100`}
            detail={topFocus ? `${topFocus.name} is today's focus` : "No active focus yet"}
            tone={getScoreTone(priorityScore)}
            icon={<Star className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Projected Annual Revenue"
            value={formatCurrency(pipelineRevenue)}
            detail="Revenue currently in motion"
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
                eyebrow="AI Executive Recommendation"
                title="Start with the highest-value action"
                description="This is the one move most likely to create revenue momentum today."
                action={
                  <UnityBadge tone="emerald">
                    <Flame className="mr-1 h-3 w-3" />
                    Launch Focus
                  </UnityBadge>
                }
              />

              <div className="mt-6">
                <UnityAIInsight title="Mission Control Recommendation">
                  {topFocus ? (
                    <>
                      Start with <strong>{topFocus.name}</strong>. This opportunity has a priority score of{" "}
                      <strong>{topFocus.score}/100</strong> and a projected annual value of{" "}
                      <strong>{formatCurrency(topFocus.projectedRevenue)}</strong>. The next best action is:{" "}
                      <strong>{topFocus.recommendation}</strong>
                    </>
                  ) : (
                    <>
                      Your active pipeline is clear. Focus on assessment volume, campaign publishing, and follow-up systems
                      to create new opportunities.
                    </>
                  )}
                </UnityAIInsight>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Today's Focus"
                title="Highest-priority opportunity"
                description="Start here first. This is the most valuable active opportunity based on lead score and projected annual revenue."
                action={<UnityBadge tone={getScoreTone(priorityScore)}>Priority {priorityScore}/100</UnityBadge>}
              />

              <div className="mt-6">
                {isLoading ? (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                    Building morning brief...
                  </p>
                ) : topFocus ? (
                  <FocusCard opportunity={topFocus} onCopyBrief={handleCopyBrief} />
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
                action={<UnityBadge tone="blue">{priorityOpportunities.length} Priority</UnityBadge>}
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

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <UnityButton onClick={() => handleCopyBrief(opportunity)} variant="secondary">
                            <Clipboard className="h-4 w-4" />
                            Copy
                          </UnityButton>

                          <UnityButton href="/mission-control/client-copilot" variant="secondary">
                            Open Copilot
                          </UnityButton>
                        </div>
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
                eyebrow="Operating Snapshot"
                title="Stage pressure"
                description="Quickly see where work is building up."
              />

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                        Qualified
                      </p>
                      <p className="mt-2 text-sm text-slate-400">Ready for advisor review.</p>
                    </div>
                    <p className="text-3xl font-black text-white">{qualifiedOpportunities.length}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                        Meetings Scheduled
                      </p>
                      <p className="mt-2 text-sm text-slate-400">Prep these before the call.</p>
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
                      <p className="mt-2 text-sm text-slate-400">Follow-up risk lives here.</p>
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
                      <p className="mt-2 text-sm text-slate-400">Revenue currently in motion.</p>
                    </div>
                    <p className="text-3xl font-black text-white">{formatCurrency(pipelineRevenue)}</p>
                  </div>
                </div>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="One-Click Actions"
                title="Move faster"
                description="Jump into the highest-value launch workflows without dead-end routes."
              />

              <div className="mt-6 grid gap-3">
                <UnityButton href="/mission-control/pipeline">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Open Pipeline
                </UnityButton>

                <UnityButton href="/mission-control/assessments" variant="secondary">
                  <Users className="h-4 w-4" />
                  Review Assessments
                </UnityButton>

                <UnityButton href="/mission-control/client-copilot" variant="secondary">
                  <Target className="h-4 w-4" />
                  Open Client Copilot
                </UnityButton>

                <UnityButton href="/mission-control/reports" variant="secondary">
                  <BarChart3 className="h-4 w-4" />
                  Open Reports
                </UnityButton>

                <UnityButton href="/mission-control/marketing/campaign-factory" variant="ai">
                  <Sparkles className="h-4 w-4" />
                  Open Campaign Factory
                </UnityButton>
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Launch Readiness"
                title="Daily checklist"
                description="Keep the operating system tight before sending paid traffic."
              />

              <div className="mt-6 space-y-3">
                {[
                  "Review top opportunity",
                  "Confirm scheduled meetings have briefs",
                  "Follow up on proposal-stage leads",
                  "Publish or test one campaign asset",
                  "Export reports before end of day",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <p className="text-sm font-bold text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </UnityCard>

            <UnityCard>
              <UnityCardHeader
                eyebrow="Contact Queue"
                title="Fast outreach"
                description="Use safe launch actions for the top opportunity."
              />

              <div className="mt-6 grid gap-3">
                <UnityButton
                  href={topFocus?.email ? getMailToLink(topFocus) : "/mission-control/client-copilot"}
                  variant="secondary"
                >
                  <Mail className="h-4 w-4" />
                  Email Top Prospect
                </UnityButton>

                <UnityButton
                  href={topFocus?.phone ? `tel:${topFocus.phone}` : "/mission-control/client-copilot"}
                  variant="secondary"
                >
                  <Phone className="h-4 w-4" />
                  Call Top Prospect
                </UnityButton>
              </div>
            </UnityCard>
          </div>
        </div>
      </div>
    </div>
  );
}
