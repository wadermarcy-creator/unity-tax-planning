"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  ClipboardList,
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

function MetricTable({
  title,
  description,
  rows,
  label,
}: {
  title: string;
  description: string;
  rows: GroupedMetric[];
  label: string;
}) {
  return (
    <UnityCard>
      <UnityCardHeader
        eyebrow={label}
        title={title}
        description={description}
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr_1fr_1fr] gap-4 bg-slate-900 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
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
          rows.slice(0, 8).map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr_1fr_1fr] gap-4 border-t border-slate-800 px-5 py-4 text-sm"
            >
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
          ))
        )}
      </div>
    </UnityCard>
  );
}

export default function RevenueIntelligencePage() {
  const toast = useToast();
  const [leads, setLeads] = useState<RevenueLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen">
      <Header
        title="Revenue Intelligence"
        subtitle="See which campaigns, landing pages, and sources are creating pipeline value."
      />

      <div className="px-6 py-8 lg:px-10">
        <UnityPageHero
          eyebrow="Revenue Intelligence"
          title="Know where your money is coming from."
          description="Track assessment submissions through attribution, pipeline stage, projected value, and expected revenue so you can make better advertising decisions."
          action={
            <UnityButton variant="secondary" onClick={loadRevenueData}>
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </UnityButton>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <UnityMetricCard
            label="Pipeline Forecast"
            value={formatCurrency(projectedRevenue)}
            detail="Projected annual revenue"
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
            label="Won / Hazel Revenue"
            value={formatCurrency(wonRevenue)}
            detail="Converted or handed off"
            tone="violet"
            icon={<Trophy className="h-6 w-6" />}
          />

          <UnityMetricCard
            label="Qualified Leads"
            value={String(qualifiedLeads)}
            detail="Score 80+"
            tone="yellow"
            icon={<Target className="h-6 w-6" />}
          />
        </div>

        <div className="mt-8">
          <UnityAIInsight title="Revenue Intelligence Recommendation">
            {topCampaign ? (
              <>
                Your strongest current campaign is{" "}
                <strong>{topCampaign.key}</strong> with{" "}
                <strong>{topCampaign.leads}</strong> leads and{" "}
                <strong>{formatCurrency(topCampaign.expectedRevenue)}</strong>{" "}
                in expected annual revenue. Once Google Ads spend is connected,
                this page can calculate true ROI and budget recommendations.
              </>
            ) : (
              <>
                Attribution data will appear here as new assessments are
                submitted. Once traffic starts flowing, this page will show which
                campaigns and landing pages create the most valuable pipeline.
              </>
            )}
          </UnityAIInsight>
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
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <MetricTable
                label="Source Performance"
                title="Top sources"
                description="Grouped by UTM source."
                rows={sourceRows}
              />

              <MetricTable
                label="Landing Page Performance"
                title="Top landing pages"
                description="Grouped by captured landing page."
                rows={landingPageRows}
              />
            </div>

            <MetricTable
              label="Keyword Performance"
              title="Top keywords"
              description="Grouped by UTM term. Google Ads keyword data should pass through utm_term or ValueTrack."
              rows={keywordRows}
            />

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
        )}
      </div>
    </div>
  );
}
