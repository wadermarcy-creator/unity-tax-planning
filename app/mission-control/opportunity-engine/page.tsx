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
      documents: ["Business tax return", "Payroll details", "Owner compensation", "Current retirement plan documents"],
      questions: ["How many employees do you have?", "What is your annual business cash flow?", "Do you already sponsor a retirement plan?"],
    });

    opportunities.push({
      title: "Entity Structure Review",
      category: "Business Planning",
      confidence: 88,
      estimatedSavings: "Moderate to High",
      reason:
        "Business ownership can create opportunities around entity selection, S corporation compensation, QBI, payroll, and deduction strategy.",
      documents: ["Entity documents", "Business tax return", "Profit and loss statement"],
      questions: ["How is the business currently taxed?", "Are you taking W-2 wages?", "Has your CPA reviewed reasonable compensation?"],
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
      questions: ["When is the expected sale?", "What is your estimated basis?", "Is the buyer identified?"],
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
      questions: ["When do you plan to retire?", "When do RMDs begin?", "Do you expect taxable income to fall temporarily?"],
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
      questions: ["How much do you give annually?", "Do you own appreciated securities?", "Are you over age 70½?"],
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
      questions: ["How much is held in taxable accounts?", "Do you have concentrated positions?", "Are there large unrealized gains?"],
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
      questions: ["What prompted the assessment?", "What tax issue feels most urgent?", "Who prepares your tax return?"],
    });
  }

  return opportunities.sort((a, b) => b.confidence - a.confidence);
}

export default function OpportunityEnginePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      const { data, error } = await supabase
        .from("tax_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        setLeads(data as Lead[]);
        if (data.length > 0) setSelectedLeadId(data[0].id);
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

  const averageConfidence =
    opportunities.length > 0
      ? Math.round(
          opportunities.reduce((total, item) => total + item.confidence, 0) /
            opportunities.length,
        )
      : 0;

  return (
    <div className="min-h-screen">
      <Header
        title="Opportunity Engine"
        subtitle="Identify likely tax planning opportunities from assessment data."
      />

      <div className="px-6 py-8 lg:px-10">
        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            Loading opportunity engine...
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-400">
            No assessments available yet.
          </div>
        ) : (
          <>
            <section className="mb-8 rounded-[2rem] border border-violet-500/30 bg-violet-500/10 p-7 shadow-2xl shadow-violet-950/20">
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr] xl:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-300">
                    AI Tax Opportunity Engine™
                  </p>

                  <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                    Turn assessment data into strategy ideas.
                  </h1>

                  <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-300">
                    This first version uses your prospect&apos;s assessment profile to surface likely planning areas, questions to ask, and documents to request.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                    Select Assessment
                  </label>

                  <select
                    value={selectedLeadId}
                    onChange={(event) => setSelectedLeadId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 font-black text-white outline-none focus:border-violet-400"
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
              <>
                <section className="mb-8 grid gap-5 md:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                      Prospect
                    </p>
                    <p className="mt-4 text-2xl font-black text-white">
                      {getFullName(selectedLead)}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-400">
                      {selectedLead.email || "No email"}
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-300">
                      Opportunities
                    </p>
                    <p className="mt-4 text-4xl font-black text-white">
                      {opportunities.length}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-400">
                      Suggested planning areas
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
                      Confidence
                    </p>
                    <p className="mt-4 text-4xl font-black text-white">
                      {averageConfidence}%
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-400">
                      Average opportunity confidence
                    </p>
                  </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-2">
                  {opportunities.map((opportunity) => (
                    <article
                      key={opportunity.title}
                      className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                            {opportunity.category}
                          </p>

                          <h2 className="mt-3 text-2xl font-black text-white">
                            {opportunity.title}
                          </h2>
                        </div>

                        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-black text-emerald-300">
                          {opportunity.confidence}% Confidence
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Estimated Savings
                        </p>
                        <p className="mt-2 text-lg font-black text-white">
                          {opportunity.estimatedSavings}
                        </p>
                      </div>

                      <p className="mt-5 text-sm font-medium leading-7 text-slate-400">
                        {opportunity.reason}
                      </p>

                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                            Questions to Ask
                          </p>

                          <div className="space-y-2">
                            {opportunity.questions.map((question) => (
                              <p
                                key={question}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm font-bold leading-6 text-slate-300"
                              >
                                {question}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                            Documents Needed
                          </p>

                          <div className="space-y-2">
                            {opportunity.documents.map((document) => (
                              <p
                                key={document}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm font-bold leading-6 text-slate-300"
                              >
                                {document}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/mission-control/assessments/${selectedLead.id}`}
                          className="rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                        >
                          Open Assessment
                        </Link>

                        <button
                          type="button"
                          className="rounded-2xl border border-slate-700 px-5 py-4 text-sm font-black text-slate-300 hover:border-violet-500 hover:text-white"
                        >
                          Add to Strategy Plan
                        </button>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}