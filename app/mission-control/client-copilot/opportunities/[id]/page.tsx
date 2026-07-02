"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import LeadScoreCard from "@/components/client-copilot/LeadScoreCard";
import MeetingPrepCard from "@/components/client-copilot/MeetingPrepCard";
import OpportunitySummaryCard from "@/components/client-copilot/OpportunitySummaryCard";
import AdvisorNotesCard from "@/components/client-copilot/AdvisorNotesCard";
import NextActionsCard from "@/components/client-copilot/NextActionsCard";
import ProposalPreviewCard from "@/components/client-copilot/ProposalPreviewCard";
import { supabase } from "@/lib/supabase";

type LeadRecord = Record<string, any>;

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

export default function ClientCopilotOpportunityPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadLead() {
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
      return;
    }

    setLead(data as LeadRecord);
    setIsLoading(false);
  }

  useEffect(() => {
    loadLead();
  }, [id]);

  const score = useMemo(() => calculateLeadScore(lead), [lead]);
  const income = useMemo(() => getLeadIncome(lead), [lead]);
  const projectedRevenue = useMemo(
    () => getProjectedRevenue(score, income),
    [score, income],
  );
  const closeProbability = useMemo(
    () => getCloseProbability(score),
    [score],
  );
  const summary = useMemo(() => getOpportunitySummary(lead), [lead]);
  const opportunities = useMemo(() => getOpportunities(lead), [lead]);

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
          <Link
            href="/mission-control/client-copilot"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Client Copilot
          </Link>
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
        <div className="mb-8">
          <Link
            href="/mission-control/client-copilot"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Client Copilot
          </Link>
        </div>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-violet-300">
                  <UserRound className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                    Opportunity Workspace
                  </p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
                    {getLeadName(lead)}
                  </h1>
                </div>
              </div>

              <p className="mt-5 text-lg font-bold text-slate-300">
                {getLeadOccupation(lead)}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
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
                  Submitted {getLeadCreatedAt(lead)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-violet-200">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em]">
                    Copilot Mode
                  </p>
                  <p className="text-xl font-black">Meeting Prep</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <LeadScoreCard
              score={score}
              projectedRevenue={projectedRevenue}
              closeProbability={closeProbability}
            />

            <NextActionsCard />
          </div>

          <div className="space-y-6">
            <OpportunitySummaryCard
              summary={summary}
              opportunities={opportunities}
            />

            <MeetingPrepCard lead={lead} score={score} projectedRevenue={projectedRevenue} />

            <ProposalPreviewCard
              prospectName={getLeadName(lead)}
              projectedRevenue={projectedRevenue}
              opportunities={opportunities}
            />

            <AdvisorNotesCard initialNotes={lead.admin_notes || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
