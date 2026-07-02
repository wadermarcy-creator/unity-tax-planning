"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import Header from "@/components/mission-control/Header";
import PipelineColumn from "@/components/pipeline/PipelineColumn";
import PipelineStats from "@/components/pipeline/PipelineStats";
import type { PipelineLead } from "@/components/pipeline/PipelineCard";
import {
  UnityAIInsight,
  UnityButton,
  UnityPageHero,
} from "@/components/ui/UnityUI";
import { supabase } from "@/lib/supabase";

type LeadRecord = Record<string, any>;

const VISIBLE_STAGES = [
  { title: "New Assessment", description: "Recently submitted assessments." },
  { title: "Qualified", description: "Strong prospects." },
  { title: "Meeting Scheduled", description: "Ready for prep." },
  { title: "Proposal Sent", description: "Waiting on decision." },
  { title: "Won", description: "Converted clients." },
  { title: "Sent to Hazel", description: "Planning handoff." },
];

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
  return lead.email || lead.email_address || "";
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

function getRecommendation(stage: string, score: number) {
  if (stage === "New Assessment") {
    return score >= 80 ? "Review today and move forward." : "Review and qualify.";
  }
  if (stage === "Qualified") return "Schedule strategy conversation.";
  if (stage === "Meeting Scheduled") return "Prepare AI meeting brief.";
  if (stage === "Proposal Sent") return "Follow up with next step.";
  if (stage === "Won") return "Start onboarding.";
  if (stage === "Sent to Hazel") return "Track planning handoff.";
  if (stage === "Completed / Archived") return "Completed and hidden from the active pipeline.";
  return "Review next step.";
}

function mapLeadToPipelineLead(lead: LeadRecord): PipelineLead {
  const score = calculateLeadScore(lead);
  const income = getLeadIncome(lead);
  const stage = assignStage(lead, score);

  return {
    id: String(lead.id),
    name: getLeadName(lead),
    email: getLeadEmail(lead),
    occupation: getLeadOccupation(lead),
    stage,
    score,
    projectedRevenue: getProjectedRevenue(score, income),
    createdAt: lead.created_at || lead.submitted_at || lead.inserted_at,
    recommendation: getRecommendation(stage, score),
  };
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState("");
  const [pipelineMessage, setPipelineMessage] = useState("");

  async function loadPipeline() {
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
      return;
    }

    const mapped = (data || [])
      .map((lead) => mapLeadToPipelineLead(lead as LeadRecord))
      .sort((a, b) => b.score - a.score);

    setLeads(mapped);
    setIsLoading(false);
  }

  useEffect(() => {
    loadPipeline();
  }, []);

  async function updateLeadStage(leadId: string, nextStage: string) {
    setUpdatingLeadId(leadId);
    setPipelineMessage("");

    const previousLeads = leads;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              stage: nextStage,
              recommendation: getRecommendation(nextStage, lead.score),
            }
          : lead,
      ),
    );

    const { error } = await supabase
      .from("tax_leads")
      .update({ pipeline_stage: nextStage })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setLeads(previousLeads);
      setPipelineMessage(
        "Could not save stage. Make sure tax_leads has pipeline_stage.",
      );
    } else if (nextStage === "Completed / Archived") {
      setPipelineMessage("Opportunity archived and removed from the active board.");
    } else {
      setPipelineMessage("Pipeline stage saved.");
    }

    setUpdatingLeadId("");
  }

  const activeLeads = useMemo(
    () => leads.filter((lead) => lead.stage !== "Completed / Archived"),
    [leads],
  );

  const archivedCount = leads.length - activeLeads.length;

  const stats = useMemo(() => {
    const totalLeads = activeLeads.length;
    const qualifiedLeads = activeLeads.filter((lead) => lead.score >= 80).length;
    const projectedRevenue = activeLeads.reduce(
      (sum, lead) => sum + lead.projectedRevenue,
      0,
    );
    const averageScore =
      totalLeads > 0
        ? activeLeads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads
        : 0;

    return { totalLeads, qualifiedLeads, projectedRevenue, averageScore };
  }, [activeLeads]);

  function getLeadsForStage(stage: string) {
    return activeLeads.filter((lead) => lead.stage === stage);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Pipeline"
        subtitle="Track opportunities from assessment to Hazel handoff."
      />

      <div className="px-3 py-5 lg:px-5">
        <UnityPageHero
          eyebrow="Mission Control Pipeline"
          title="Advisor Revenue Command Center"
          description="View all active opportunities across every stage at once. Move prospects forward, prepare meetings, and archive completed opportunities when they leave the active pipeline."
          action={
            <UnityButton variant="secondary" onClick={loadPipeline}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </UnityButton>
          }
        />

        <div className="mt-5">
          <PipelineStats
            totalLeads={stats.totalLeads}
            qualifiedLeads={stats.qualifiedLeads}
            projectedRevenue={stats.projectedRevenue}
            averageScore={stats.averageScore}
          />
        </div>

        <div className="mt-5">
          <UnityAIInsight title="Pipeline Copilot Recommendation">
            Use the dropdown on each card to move opportunities forward. When an
            opportunity is finished, move it to Completed / Archived and it will
            disappear from the active board. Archived count: {archivedCount}.
          </UnityAIInsight>
        </div>

        {pipelineMessage && (
          <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs font-bold text-slate-300">
            {pipelineMessage}
          </p>
        )}

        {isLoading ? (
          <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm font-bold text-slate-400">
            Loading pipeline...
          </p>
        ) : (
          <div
            className="mt-5 grid gap-2"
            style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
          >
            {VISIBLE_STAGES.map((stage) => (
              <PipelineColumn
                key={stage.title}
                title={stage.title}
                description={stage.description}
                leads={getLeadsForStage(stage.title)}
                onStageChange={updateLeadStage}
                updatingLeadId={updatingLeadId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
