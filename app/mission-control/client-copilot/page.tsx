"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Mail,
  Phone,
  Sparkles,
  Star,
  Target,
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
} from "@/components/ui/UnityUI";
import { supabase } from "@/lib/supabase";

type LeadRecord = Record<string, any>;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
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

function getLeadOccupation(lead: LeadRecord) {
  return (
    lead.occupation ||
    lead.profession ||
    lead.job_title ||
    lead.industry ||
    "Occupation not provided"
  );
}

function getLeadCreatedAt(lead: LeadRecord) {
  const value = lead.created_at || lead.submitted_at || lead.inserted_at;
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function calculateLeadScore(lead: LeadRecord) {
  let score = 35;

  const income = getLeadIncome(lead);

  if (income >= 500000) score += 25;
  else if (income >= 300000) score += 20;
  else if (income >= 200000) score += 14;
  else if (income >= 100000) score += 8;

  const text = JSON.stringify(lead).toLowerCase();

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

function getScoreLabel(score: number) {
  if (score >= 90) return "Priority";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Qualified";
  return "Review";
}

function getScoreTone(score: number): "emerald" | "blue" | "yellow" | "slate" {
  if (score >= 90) return "emerald";
  if (score >= 80) return "blue";
  if (score >= 70) return "yellow";
  return "slate";
}

function PriorityLeadCard({ lead }: { lead: LeadRecord }) {
  const score = calculateLeadScore(lead);
  const income = getLeadIncome(lead);
  const projectedRevenue = getProjectedRevenue(score, income);

  return (
    <UnityCard>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black text-white">
              {getLeadName(lead)}
            </h3>

            <UnityBadge tone={getScoreTone(score)}>
              {getScoreLabel(score)} · {score}/100
            </UnityBadge>
          </div>

          <p className="mt-3 text-sm font-bold text-slate-400">
            {getLeadOccupation(lead)}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {getLeadEmail(lead)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {getLeadPhone(lead)}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {getLeadCreatedAt(lead)}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Income
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {income ? formatCurrency(income) : "Unknown"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Projected Revenue
            </p>
            <p className="mt-2 text-xl font-black text-emerald-300">
              {formatCurrency(projectedRevenue)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <UnityAIInsight title="Client Copilot Recommendation">
          Review this prospect first if you have time today. Prepare talking
          points around income, retirement, investment, and tax complexity.
        </UnityAIInsight>

        <UnityButton
          href={`/mission-control/client-copilot/opportunities/${lead.id}`}
        >
          Open Lead <ArrowRight className="h-4 w-4" />
        </UnityButton>
      </div>
    </UnityCard>
  );
}

export default function ClientCopilotPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadLeads() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      console.error(error);
      setLeads([]);
      setIsLoading(false);
      return;
    }

    setLeads((data || []) as LeadRecord[]);
    setIsLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const rankedLeads = useMemo(() => {
    return [...leads].sort(
      (a, b) => calculateLeadScore(b) - calculateLeadScore(a),
    );
  }, [leads]);

  const priorityLeads = rankedLeads.filter(
    (lead) => calculateLeadScore(lead) >= 80,
  );

  const projectedRevenue = rankedLeads.reduce((sum, lead) => {
    return (
      sum + getProjectedRevenue(calculateLeadScore(lead), getLeadIncome(lead))
    );
  }, 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Client Copilot"
        subtitle="Prioritize prospects, prepare meetings, and move opportunities forward."
      />

      <div className="px-6 py-8 lg:px-10">
        <UnityPageHero
          eyebrow="Client Copilot"
          title="Today's Opportunity Command Center"
          description="Turn submitted assessments into prioritized opportunities. Client Copilot helps you identify the highest-value prospects, prepare better meetings, and move qualified opportunities forward."
          action={
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-violet-200">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em]">
                    Copilot Mode
                  </p>
                  <p className="text-xl font-black">Pipeline Review</p>
                </div>
              </div>
            </div>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="New Assessments"
            value={String(leads.length)}
            detail="Latest 25 loaded"
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
            detail="Rule-based estimate"
            tone="emerald"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />
          <UnityMetricCard
            label="Next Best Action"
            value="Review"
            detail="Start with highest score"
            tone="yellow"
            icon={<Target className="h-6 w-6" />}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <UnityCard>
            <UnityCardHeader
              eyebrow="Suggested Actions"
              title="What to do next"
              description="Focus on the activities that move opportunities toward a signed engagement."
            />

            <div className="mt-6 space-y-3">
              {[
                [
                  "Review top priority lead",
                  "Open the highest-scoring assessment first.",
                ],
                [
                  "Prepare meeting brief",
                  "Identify likely planning opportunities before the call.",
                ],
                [
                  "Send follow-up",
                  "Move warm prospects forward while interest is high.",
                ],
                [
                  "Request documents",
                  "Collect tax return, paystubs, investment statements, and entity documents.",
                ],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                    <div>
                      <p className="font-black text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </UnityCard>

          <UnityCard>
            <UnityCardHeader
              eyebrow="Pipeline Intelligence"
              title="Scoring model"
              description="Client Copilot currently uses rule-based scoring. AI scoring can be layered in later."
            />

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Current Signals
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Income, occupation, business ownership, real estate,
                  investment, retirement, charitable, and estate complexity.
                </p>
              </div>

              <UnityAIInsight title="Next Upgrade">
                AI Meeting Prep already generates prospect-specific summaries,
                planning opportunities, questions, document requests, and
                follow-up emails inside each Opportunity Workspace.
              </UnityAIInsight>
            </div>
          </UnityCard>
        </div>

        <UnityCard className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <UnityCardHeader
              eyebrow="Priority Leads"
              title="Highest-value opportunities"
              description="Open the strongest opportunities first and prepare them inside Client Copilot."
            />

            <UnityButton variant="secondary" onClick={loadLeads}>
              Refresh
            </UnityButton>
          </div>

          <div className="mt-6 space-y-5">
            {isLoading ? (
              <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">
                Loading opportunities...
              </p>
            ) : rankedLeads.length === 0 ? (
              <UnityEmptyState
                title="No assessments found yet"
                description="New submitted assessments will appear here automatically."
              />
            ) : (
              rankedLeads
                .slice(0, 8)
                .map((lead) => <PriorityLeadCard key={lead.id} lead={lead} />)
            )}
          </div>
        </UnityCard>
      </div>
    </div>
  );
}
