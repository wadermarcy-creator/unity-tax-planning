"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/mission-control/Header";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  household_income: string | null;
  investable_assets: string | null;
  lead_score: number | null;
  status: string | null;
  biggest_tax_concern: string | null;
  business_owner?: boolean | null;
  retiring_soon?: boolean | null;
  charitable_giving?: boolean | null;
  current_advisor?: boolean | null;
  current_cpa?: boolean | null;
  upcoming_sale?: boolean | null;
};

type Opportunity = {
  title: string;
  category: string;
  confidence: number;
  estimatedSavings: string;
  reason: string;
  documents: string[];
  questions: string[];
};

function getFullName(lead: Lead) {
  return `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed";
}

function getOpportunities(lead: Lead): Opportunity[] {
  const opportunities: Opportunity[] = [];

  if (lead.business_owner) {
    opportunities.push({
      title: "Retirement Plan Design",
      category: "Business Planning",
      confidence: 94,
      estimatedSavings: "High",
      reason:
        "Business owners with meaningful income may benefit from reviewing SEP IRA, Solo 401(k), cash balance, or defined benefit plan options.",
      documents: [
        "Business tax return",
        "Payroll details",
        "Owner compensation",
        "Current retirement plan documents",
      ],
      questions: [
        "How many employees do you have?",
        "What is your annual business cash flow?",
        "Do you already sponsor a retirement plan?",
      ],
    });

    opportunities.push({
      title: "Entity Structure Review",
      category: "Business Planning",
      confidence: 88,
      estimatedSavings: "Moderate to High",
      reason:
        "Business ownership can create opportunities around entity selection, S corporation compensation, QBI, payroll, and deduction strategy.",
      documents: ["Entity documents", "Business tax return", "Profit and loss statement"],
      questions: [
        "How is the business currently taxed?",
        "Are you taking W-2 wages?",
        "Has your CPA reviewed reasonable compensation?",
      ],
    });
  }

  if (lead.upcoming_sale) {
    opportunities.push({
      title: "Pre-Sale Tax Strategy",
      category: "Liquidity Event",
      confidence: 92,
      estimatedSavings: "High",
      reason:
        "Upcoming sales often require planning before the transaction closes. Timing, structure, charitable planning, and installment strategies may matter.",
      documents: ["Sale estimate", "Basis information", "Entity documents", "CPA projections"],
      questions: [
        "When is the expected sale?",
        "What is your estimated basis?",
        "Is the buyer identified?",
      ],
    });
  }

  if (lead.retiring_soon) {
    opportunities.push({
      title: "Roth Conversion Planning",
      category: "Retirement Planning",
      confidence: 86,
      estimatedSavings: "Long-term",
      reason:
        "Retirement transition years may create lower-income windows where Roth conversions should be evaluated before RMDs begin.",
      documents: ["IRA balances", "Tax return", "Social Security estimate", "Pension details"],
      questions: [
        "When do you plan to retire?",
        "When do RMDs begin?",
        "Do you expect taxable income to fall temporarily?",
      ],
    });
  }

  if (lead.charitable_giving) {
    opportunities.push({
      title: "Charitable Giving Strategy",
      category: "Charitable Planning",
      confidence: 82,
      estimatedSavings: "Moderate",
      reason:
        "Charitable families may benefit from reviewing donor-advised funds, appreciated asset gifts, bunching, and qualified charitable distributions.",
      documents: ["Giving history", "Brokerage statement", "Tax return"],
      questions: [
        "How much do you give annually?",
        "Do you own appreciated securities?",
        "Are you over age 70½?",
      ],
    });
  }

  if ((lead.investable_assets || "").includes("$1M") || (lead.investable_assets || "").includes("$5M")) {
    opportunities.push({
      title: "Investment Tax Efficiency Review",
      category: "Investment Tax",
      confidence: 80,
      estimatedSavings: "Moderate",
      reason:
        "Large taxable or investable assets may create planning opportunities around asset location, tax-loss harvesting, dividend exposure, and capital gains.",
      documents: ["Brokerage statements", "Realized gain/loss report", "Tax return"],
      questions: [
        "How much is held in taxable accounts?",
        "Do you have concentrated positions?",
        "Are there large unrealized gains?",
      ],
    });
  }

  if (opportunities.length === 0) {
    opportunities.push({
      title: "General Tax Planning Review",
      category: "Core Planning",
      confidence: 58,
      estimatedSavings: "Review Needed",
      reason:
        "The assessment should be reviewed for income timing, deductions, investment tax efficiency, and CPA coordination opportunities.",
      documents: ["Tax return", "Income estimate", "Investment statements"],
      questions: [
        "What prompted the assessment?",
        "What tax issue feels most urgent?",
        "Who prepares your tax return?",
      ],
    });
  }

  return opportunities.sort((a, b) => b.confidence - a.confidence);
}

function buildStrategyText(lead: Lead, selectedOpportunities: Opportunity[]) {
  const name = getFullName(lead);

  return `UNITY TAX STRATEGY OUTLINE

Prepared For:
${name}

Planning Profile:
- Household Income: ${lead.household_income || "Not provided"}
- Investable Assets: ${lead.investable_assets || "Not provided"}
- Mission Control Score: ${lead.lead_score ?? 0}
- Current Status: ${lead.status || "new"}

Executive Summary:
Based on the Unity Tax Opportunity Assessment™, ${name} may have several planning areas worth reviewing. This outline is preliminary and should be confirmed through a deeper document review, CPA coordination, and a formal planning engagement.

Selected Planning Opportunities:

${selectedOpportunities
  .map(
    (opportunity, index) => `${index + 1}. ${opportunity.title}
Category: ${opportunity.category}
Confidence: ${opportunity.confidence}%
Estimated Savings Potential: ${opportunity.estimatedSavings}

Why This May Matter:
${opportunity.reason}

Questions to Ask:
${opportunity.questions.map((question) => `- ${question}`).join("\n")}

Documents to Request:
${opportunity.documents.map((document) => `- ${document}`).join("\n")}
`,
  )
  .join("\n")}

Recommended Next Steps:
1. Confirm the prospect's primary goal and timeline.
2. Request the documents listed above.
3. Review the prior-year tax return and current-year income estimate.
4. Coordinate with the prospect's CPA or tax professional where appropriate.
5. Determine whether a formal tax strategy engagement is appropriate.

Important Notice:
This strategy outline is preliminary and for internal planning discussion only. It is not tax, legal, accounting, investment, or financial advice. No tax savings or outcome is guaranteed.`;
}

export default function StrategyBuilderPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadLeads() {
      const { data, error } = await supabase
        .from("tax_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        setLeads(data as Lead[]);

        if (data.length > 0) {
          setSelectedLeadId(data[0].id);
        }
      }

      setIsLoading(false);
    }

    loadLeads();
  }, []);

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;

  const opportunities = useMemo(
    () => (selectedLead ? getOpportunities(selectedLead) : []),
    [selectedLead],
  );

  useEffect(() => {
    setSelectedTitles(opportunities.slice(0, 3).map((item) => item.title));
  }, [selectedLeadId, opportunities]);

  const selectedOpportunities = opportunities.filter((opportunity) =>
    selectedTitles.includes(opportunity.title),
  );

  const strategyText = selectedLead
    ? buildStrategyText(selectedLead, selectedOpportunities)
    : "";

  function toggleOpportunity(title: string) {
    setSelectedTitles((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  async function copyStrategy() {
    await navigator.clipboard.writeText(strategyText);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Strategy Builder"
        subtitle="Turn opportunity analysis into a clean planning outline."
      />

      <div className="px-6 py-8 lg:px-10">
        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            Loading strategy builder...
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            No assessments available yet.
          </div>
        ) : (
          <>
            <section className="mb-8 rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-7 shadow-2xl shadow-blue-950/20">
              <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr] xl:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                    Unity Tax Strategy Builder™
                  </p>

                  <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                    Build a strategy outline from assessment data.
                  </h1>

                  <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-300">
                    Select a prospect, choose relevant opportunities, and
                    generate a structured planning outline you can refine for a
                    discovery call, proposal, or client-facing report.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                    Select Prospect
                  </label>

                  <select
                    value={selectedLeadId}
                    onChange={(event) => setSelectedLeadId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 font-black text-white outline-none focus:border-blue-400"
                  >
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {getFullName(lead)} · Score {lead.lead_score ?? 0}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {selectedLead && (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="space-y-6">
                  <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                      Prospect
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                      {getFullName(selectedLead)}
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Score
                        </p>
                        <p className="mt-2 font-black text-white">
                          {selectedLead.lead_score ?? 0}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Income
                        </p>
                        <p className="mt-2 text-sm font-black text-white">
                          {selectedLead.household_income || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Assets
                        </p>
                        <p className="mt-2 text-sm font-black text-white">
                          {selectedLead.investable_assets || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`/mission-control/assessments/${selectedLead.id}`}
                        className="inline-block rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                      >
                        Open Assessment
                      </Link>
                    </div>
                  </article>

                  <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                      Select Opportunities
                    </p>

                    <div className="mt-5 space-y-3">
                      {opportunities.map((opportunity) => {
                        const isSelected = selectedTitles.includes(
                          opportunity.title,
                        );

                        return (
                          <button
                            key={opportunity.title}
                            type="button"
                            onClick={() => toggleOpportunity(opportunity.title)}
                            className={`w-full rounded-2xl border p-5 text-left transition ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-slate-800 bg-slate-900 hover:border-blue-500"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                  {opportunity.category}
                                </p>

                                <h3 className="mt-2 text-lg font-black text-white">
                                  {opportunity.title}
                                </h3>

                                <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                                  {opportunity.reason}
                                </p>
                              </div>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                  isSelected
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {isSelected ? "Selected" : "Add"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </article>
                </section>

                <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                        Strategy Outline
                      </p>

                      <h2 className="mt-3 text-2xl font-black text-white">
                        Draft planning summary
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={copyStrategy}
                      className="rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                    >
                      {copied ? "Copied!" : "Copy Strategy"}
                    </button>
                  </div>

                  <div className="max-h-[800px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm font-medium leading-7 text-slate-300">
                    {strategyText}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}