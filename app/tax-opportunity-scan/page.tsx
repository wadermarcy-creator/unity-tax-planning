"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { captureAttribution } from "@/lib/attribution";
import DisclosureFooter from "@/components/DisclosureFooter";

type QualificationAnswers = {
  profile: string;
  income: string;
  assets: string;
  concern: string;
  team: string;
};

export default function TaxOpportunityScanPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showAssessment, setShowAssessment] = useState(false);
  const [qualificationAnswers, setQualificationAnswers] =
    useState<QualificationAnswers>({
      profile: "",
      income: "",
      assets: "",
      concern: "",
      team: "",
    });

  useEffect(() => {
    captureAttribution();
  }, []);

  function calculateQualificationRating() {
    let score = 0;

    if (qualificationAnswers.profile === "Business owner") score += 30;
    if (qualificationAnswers.profile === "Real estate investor") score += 20;
    if (qualificationAnswers.profile === "High-income W-2 professional")
      score += 15;
    if (qualificationAnswers.profile === "Retired or approaching retirement")
      score += 15;

    if (qualificationAnswers.income === "$250k - $500k") score += 15;
    if (qualificationAnswers.income === "$500k - $1M") score += 25;
    if (qualificationAnswers.income === "$1M+") score += 35;

    if (qualificationAnswers.assets === "$500k - $1M") score += 10;
    if (qualificationAnswers.assets === "$1M - $5M") score += 25;
    if (qualificationAnswers.assets === "$5M+") score += 35;

    if (qualificationAnswers.concern === "Selling a business or asset")
      score += 25;
    if (qualificationAnswers.concern === "Business tax planning") score += 25;
    if (qualificationAnswers.concern === "Retirement tax strategy") score += 20;
    if (qualificationAnswers.concern === "Capital gains") score += 20;
    if (qualificationAnswers.concern === "Estate or legacy planning")
      score += 15;

    if (qualificationAnswers.team === "CPA and financial advisor") score += 10;
    if (qualificationAnswers.team === "CPA only") score += 8;

    return score;
  }

  function getQualificationLabel() {
    const score = calculateQualificationRating();

    if (score >= 90) return "Very High Planning Potential";
    if (score >= 65) return "High Planning Potential";
    if (score >= 40) return "Moderate Planning Potential";
    return "Early Planning Review";
  }

  function getSuggestedOpportunities() {
    const opportunities: string[] = [];

    if (qualificationAnswers.profile === "Business owner") {
      opportunities.push("Business tax strategy");
      opportunities.push("Retirement plan design");
      opportunities.push("Entity structure review");
    }

    if (qualificationAnswers.profile === "Real estate investor") {
      opportunities.push("Real estate tax planning");
      opportunities.push("Capital gains planning");
    }

    if (qualificationAnswers.concern === "Retirement tax strategy") {
      opportunities.push("Roth conversion planning");
      opportunities.push("RMD and income sequencing");
    }

    if (qualificationAnswers.concern === "Capital gains") {
      opportunities.push("Capital gains planning");
      opportunities.push("Charitable strategies");
    }

    if (qualificationAnswers.concern === "Selling a business or asset") {
      opportunities.push("Liquidity event planning");
      opportunities.push("Pre-sale tax strategy");
    }

    if (qualificationAnswers.concern === "Estate or legacy planning") {
      opportunities.push("Estate coordination");
      opportunities.push("Charitable and legacy planning");
    }

    if (opportunities.length === 0) {
      opportunities.push("Income tax planning");
      opportunities.push("Investment tax efficiency");
      opportunities.push("Long-term planning coordination");
    }

    return Array.from(new Set(opportunities)).slice(0, 5);
  }

  const qualificationComplete =
    qualificationAnswers.profile &&
    qualificationAnswers.income &&
    qualificationAnswers.assets &&
    qualificationAnswers.concern &&
    qualificationAnswers.team;

  function calculateLeadScore(formData: FormData) {
    let score = calculateQualificationRating();

    const householdIncome = formData.get("household_income");
    const investableAssets = formData.get("investable_assets");
    const retirementAssets = formData.get("retirement_assets");
    const urgency = formData.get("urgency");
    const desiredService = formData.get("desired_service");

    if (householdIncome === "$250k - $500k") score += 10;
    if (householdIncome === "$500k - $1M") score += 20;
    if (householdIncome === "$1M+") score += 30;

    if (investableAssets === "$500k - $1M") score += 10;
    if (investableAssets === "$1M - $5M") score += 25;
    if (investableAssets === "$5M+") score += 40;

    if (retirementAssets === "$500k - $1M") score += 5;
    if (retirementAssets === "$1M - $3M") score += 15;
    if (retirementAssets === "$3M+") score += 25;

    if (formData.get("business_owner") === "on") score += 25;
    if (formData.get("retiring_soon") === "on") score += 20;
    if (formData.get("charitable_giving") === "on") score += 15;
    if (formData.get("upcoming_sale") === "on") score += 25;
    if (formData.get("taxable_investments") === "on") score += 10;
    if (formData.get("large_retirement_accounts") === "on") score += 15;
    if (formData.get("estate_planning") === "on") score += 10;

    if (formData.get("current_advisor") !== "on") score += 10;
    if (formData.get("current_cpa") === "on") score += 5;

    if (urgency === "Within 30 days") score += 15;
    if (urgency === "Within 3 months") score += 10;
    if (urgency === "This year") score += 5;

    if (desiredService === "Comprehensive Tax Strategy Review") score += 15;

    if (desiredService === "Advanced Planning or Family Office Coordination") {
      score += 25;
    }

    return score;
  }

  function calculateLeadGrade(score: number) {
    if (score >= 130) return "A+ Assessment";
    if (score >= 100) return "A Assessment";
    if (score >= 70) return "B Assessment";
    if (score >= 40) return "C Assessment";
    return "Nurture";
  }

  function getCheckedTopics(formData: FormData) {
    const topics: string[] = [];

    if (formData.get("business_owner") === "on") {
      topics.push("Business ownership");
    }

    if (formData.get("retiring_soon") === "on") {
      topics.push("Retiring within five years");
    }

    if (formData.get("charitable_giving") === "on") {
      topics.push("Charitable giving");
    }

    if (formData.get("upcoming_sale") === "on") {
      topics.push("Upcoming business, real estate, or stock sale");
    }

    if (formData.get("taxable_investments") === "on") {
      topics.push("Taxable investments");
    }

    if (formData.get("large_retirement_accounts") === "on") {
      topics.push("Large retirement accounts");
    }

    if (formData.get("estate_planning") === "on") {
      topics.push("Estate and legacy planning");
    }

    if (formData.get("stock_compensation") === "on") {
      topics.push("Stock options or equity compensation");
    }

    return topics;
  }

  function buildConcernSummary(formData: FormData) {
    const topics = getCheckedTopics(formData);

    const primaryConcern = String(
      formData.get("biggest_tax_concern") || "Not provided",
    );

    const planningGoal = String(
      formData.get("planning_goal") || "Not provided",
    );

    const retirementAssets = String(
      formData.get("retirement_assets") || "Not provided",
    );

    const desiredService = String(
      formData.get("desired_service") || "Not provided",
    );

    const urgency = String(formData.get("urgency") || "Not provided");

    const referralSource = String(
      formData.get("referral_source") || "Not provided",
    );

    return [
      "UNITY TAX OPPORTUNITY ASSESSMENT™",
      `QUALIFICATION PROFILE: ${qualificationAnswers.profile || "Not provided"}`,
      `QUALIFICATION INCOME: ${qualificationAnswers.income || "Not provided"}`,
      `QUALIFICATION ASSETS: ${qualificationAnswers.assets || "Not provided"}`,
      `QUALIFICATION CONCERN: ${qualificationAnswers.concern || "Not provided"}`,
      `QUALIFICATION TEAM: ${qualificationAnswers.team || "Not provided"}`,
      `PLANNING OPPORTUNITY RATING: ${getQualificationLabel()}`,
      `SUGGESTED AREAS: ${getSuggestedOpportunities().join(", ")}`,
      `PRIMARY CONCERN: ${primaryConcern}`,
      `PLANNING GOAL: ${planningGoal}`,
      `PLANNING TOPICS: ${
        topics.length > 0 ? topics.join(", ") : "None selected"
      }`,
      `RETIREMENT ASSETS: ${retirementAssets}`,
      `SERVICE INTEREST: ${desiredService}`,
      `URGENCY: ${urgency}`,
      `REFERRAL SOURCE: ${referralSource}`,
    ].join("\n\n");
  }

  async function insertTaxLeadForLaunch(payloads: Record<string, unknown>[]) {
    let lastError: unknown = null;

    for (const payload of payloads) {
      const { error } = await supabase.from("tax_leads").insert([payload]);

      if (!error) {
        return null;
      }

      lastError = error;
      console.warn("Lead insert attempt failed. Trying launch-safe fallback.", error);
    }

    return lastError;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const leadScore = calculateLeadScore(formData);
    const leadGrade = calculateLeadGrade(leadScore);
    const concernSummary = buildConcernSummary(formData);

    const fullLaunchPayload: Record<string, unknown> = {
      first_name: String(formData.get("first_name") || ""),
      last_name: String(formData.get("last_name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      household_income: String(formData.get("household_income") || ""),
      investable_assets: String(formData.get("investable_assets") || ""),

      business_owner: formData.get("business_owner") === "on",
      retiring_soon: formData.get("retiring_soon") === "on",
      charitable_giving: formData.get("charitable_giving") === "on",
      current_advisor: formData.get("current_advisor") === "on",
      current_cpa: formData.get("current_cpa") === "on",
      upcoming_sale: formData.get("upcoming_sale") === "on",

      biggest_tax_concern: concernSummary,
      lead_score: leadScore,
      lead_grade: leadGrade,
      status: "new",
    };

    const corePayload: Record<string, unknown> = {
      first_name: fullLaunchPayload.first_name,
      last_name: fullLaunchPayload.last_name,
      email: fullLaunchPayload.email,
      phone: fullLaunchPayload.phone,
      household_income: fullLaunchPayload.household_income,
      investable_assets: fullLaunchPayload.investable_assets,
      biggest_tax_concern: concernSummary,
      lead_score: leadScore,
      lead_grade: leadGrade,
      status: "new",
    };

    const minimumPayload: Record<string, unknown> = {
      first_name: fullLaunchPayload.first_name,
      last_name: fullLaunchPayload.last_name,
      email: fullLaunchPayload.email,
      phone: fullLaunchPayload.phone,
      biggest_tax_concern: concernSummary,
      status: "new",
    };

    const error = await insertTaxLeadForLaunch([
      fullLaunchPayload,
      corePayload,
      minimumPayload,
    ]);

    if (error) {
      console.error(error);
      setMessage(
        "Something went wrong while submitting your assessment. Please try again.",
      );
      setIsSubmitting(false);
      return;
    }

    form.reset();
    router.push("/thank-you");
  }

  const inputClasses =
    "w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const checkboxClasses =
    "flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition hover:border-blue-500 hover:bg-blue-50";

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="bg-slate-950 px-4 pb-20 pt-16 text-white sm:px-6 md:pb-28 md:pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.26em] text-blue-300 sm:text-base">
              Unity Tax Opportunity Assessment™
            </p>

            <h1 className="mb-7 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Let&apos;s find out what deserves a closer look.
            </h1>

            <p className="mb-8 max-w-2xl text-xl font-medium leading-9 text-slate-300">
              Start with a short qualification review. If your situation appears
              to have meaningful planning potential, continue to the full Unity
              Tax Opportunity Assessment™.
            </p>

            <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-7 shadow-2xl shadow-blue-950/30">
              <p className="mb-5 text-xl font-black text-white">
                What happens next
              </p>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    1
                  </div>

                  <div>
                    <p className="font-black text-white">
                      Qualification review
                    </p>
                    <p className="mt-1 leading-7 text-slate-300">
                      Answer five quick questions to estimate whether proactive
                      planning may be worth exploring.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    2
                  </div>

                  <div>
                    <p className="font-black text-white">
                      Planning opportunity rating
                    </p>
                    <p className="mt-1 leading-7 text-slate-300">
                      Receive a preliminary rating and suggested areas that may
                      deserve a deeper look.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    3
                  </div>

                  <div>
                    <p className="font-black text-white">Full assessment</p>
                    <p className="mt-1 leading-7 text-slate-300">
                      If appropriate, complete the full assessment so we can
                      better understand your income, assets, goals, and timing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    4
                  </div>

                  <div>
                    <p className="font-black text-white">Next-step review</p>
                    <p className="mt-1 leading-7 text-slate-300">
                      If there is a fit, we discuss scope, timing, documents,
                      and pricing before any paid engagement begins.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm font-medium leading-7 text-slate-500">
              Do not enter Social Security numbers, account numbers, full tax
              returns, login information, or other sensitive documents on this
              page.
            </p>
          </div>

          {!showAssessment ? (
            <section className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
              <div className="mb-10">
                <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                  Step One
                </p>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Could an assessment be worth your time?
                </h2>

                <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
                  Answer five quick questions first. This helps filter out
                  situations where a full tax planning engagement may not be the
                  best fit yet.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="profile"
                    className="mb-2 block text-sm font-black"
                  >
                    Which best describes you?
                  </label>

                  <select
                    id="profile"
                    value={qualificationAnswers.profile}
                    onChange={(event) =>
                      setQualificationAnswers((current) => ({
                        ...current,
                        profile: event.target.value,
                      }))
                    }
                    className={inputClasses}
                  >
                    <option value="">Select one</option>
                    <option>Business owner</option>
                    <option>High-income W-2 professional</option>
                    <option>Real estate investor</option>
                    <option>Retired or approaching retirement</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="income"
                    className="mb-2 block text-sm font-black"
                  >
                    Approximate household income
                  </label>

                  <select
                    id="income"
                    value={qualificationAnswers.income}
                    onChange={(event) =>
                      setQualificationAnswers((current) => ({
                        ...current,
                        income: event.target.value,
                      }))
                    }
                    className={inputClasses}
                  >
                    <option value="">Select one</option>
                    <option>Under $150k</option>
                    <option>$150k - $250k</option>
                    <option>$250k - $500k</option>
                    <option>$500k - $1M</option>
                    <option>$1M+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="assets"
                    className="mb-2 block text-sm font-black"
                  >
                    Approximate investable assets
                  </label>

                  <select
                    id="assets"
                    value={qualificationAnswers.assets}
                    onChange={(event) =>
                      setQualificationAnswers((current) => ({
                        ...current,
                        assets: event.target.value,
                      }))
                    }
                    className={inputClasses}
                  >
                    <option value="">Select one</option>
                    <option>Under $250k</option>
                    <option>$250k - $500k</option>
                    <option>$500k - $1M</option>
                    <option>$1M - $5M</option>
                    <option>$5M+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="concern"
                    className="mb-2 block text-sm font-black"
                  >
                    Biggest planning concern
                  </label>

                  <select
                    id="concern"
                    value={qualificationAnswers.concern}
                    onChange={(event) =>
                      setQualificationAnswers((current) => ({
                        ...current,
                        concern: event.target.value,
                      }))
                    }
                    className={inputClasses}
                  >
                    <option value="">Select one</option>
                    <option>Paying too much in taxes</option>
                    <option>Business tax planning</option>
                    <option>Selling a business or asset</option>
                    <option>Retirement tax strategy</option>
                    <option>Capital gains</option>
                    <option>Estate or legacy planning</option>
                    <option>I am not sure yet</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="team"
                    className="mb-2 block text-sm font-black"
                  >
                    Do you currently work with a CPA or financial advisor?
                  </label>

                  <select
                    id="team"
                    value={qualificationAnswers.team}
                    onChange={(event) =>
                      setQualificationAnswers((current) => ({
                        ...current,
                        team: event.target.value,
                      }))
                    }
                    className={inputClasses}
                  >
                    <option value="">Select one</option>
                    <option>CPA and financial advisor</option>
                    <option>CPA only</option>
                    <option>Financial advisor only</option>
                    <option>Neither</option>
                  </select>
                </div>
              </div>

              {qualificationComplete && (
                <div className="mt-8 rounded-[2rem] border-2 border-blue-500 bg-slate-950 p-7 text-white shadow-xl shadow-blue-950/20">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                    Preliminary Result
                  </p>

                  <h3 className="mt-3 text-3xl font-black">
                    {getQualificationLabel()}
                  </h3>

                  <p className="mt-4 text-base font-medium leading-7 text-slate-300">
                    Based on your answers, there may be several areas where
                    proactive tax planning is worth reviewing.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {getSuggestedOpportunities().map((opportunity) => (
                      <div
                        key={opportunity}
                        className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm font-black text-white"
                      >
                        <span className="mr-2 text-blue-300">✓</span>
                        {opportunity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!qualificationComplete}
                onClick={() => setShowAssessment(true)}
                className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-5 text-lg font-black text-white shadow-xl transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Continue to Full Assessment
              </button>

              <p className="mt-5 text-center text-sm font-medium leading-6 text-slate-500">
                This preliminary rating is educational only and does not create
                a client relationship or guarantee that planning opportunities
                exist.
              </p>
            </section>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-8 lg:p-10"
            >
              <div className="mb-10">
                <button
                  type="button"
                  onClick={() => setShowAssessment(false)}
                  className="mb-6 rounded-full border-2 border-slate-300 px-5 py-3 text-sm font-black text-slate-700 hover:border-blue-500 hover:text-blue-600"
                >
                  ← Back to qualification
                </button>

                <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                  Full Assessment
                </p>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Tell us about your situation.
                </h2>

                <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
                  There are no perfect answers. Estimates and approximate ranges
                  are fine for this initial assessment.
                </p>
              </div>

              <section className="mb-10 border-b-2 border-slate-200 pb-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                      About You
                    </p>
                    <h3 className="text-2xl font-black">
                      Contact information
                    </h3>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="mb-2 block text-sm font-black"
                    >
                      First name
                    </label>

                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      autoComplete="given-name"
                      className={inputClasses}
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="mb-2 block text-sm font-black"
                    >
                      Last name
                    </label>

                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      autoComplete="family-name"
                      className={inputClasses}
                      placeholder="Last name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-black"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClasses}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-black"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={inputClasses}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>
              </section>

              <section className="mb-10 border-b-2 border-slate-200 pb-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                      Financial Picture
                    </p>
                    <h3 className="text-2xl font-black">
                      Approximate financial ranges
                    </h3>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="household_income"
                      className="mb-2 block text-sm font-black"
                    >
                      Annual household income
                    </label>

                    <select
                      id="household_income"
                      name="household_income"
                      required
                      defaultValue={qualificationAnswers.income}
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select an income range
                      </option>
                      <option>Under $150k</option>
                      <option>$150k - $250k</option>
                      <option>$250k - $500k</option>
                      <option>$500k - $1M</option>
                      <option>$1M+</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="investable_assets"
                      className="mb-2 block text-sm font-black"
                    >
                      Investable assets
                    </label>

                    <select
                      id="investable_assets"
                      name="investable_assets"
                      required
                      defaultValue={qualificationAnswers.assets}
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select an asset range
                      </option>
                      <option>Under $250k</option>
                      <option>$250k - $500k</option>
                      <option>$500k - $1M</option>
                      <option>$1M - $5M</option>
                      <option>$5M+</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="retirement_assets"
                      className="mb-2 block text-sm font-black"
                    >
                      IRA and retirement-plan assets
                    </label>

                    <select
                      id="retirement_assets"
                      name="retirement_assets"
                      defaultValue=""
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select a retirement-asset range
                      </option>
                      <option>Under $250k</option>
                      <option>$250k - $500k</option>
                      <option>$500k - $1M</option>
                      <option>$1M - $3M</option>
                      <option>$3M+</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="planning_goal"
                      className="mb-2 block text-sm font-black"
                    >
                      Primary planning goal
                    </label>

                    <select
                      id="planning_goal"
                      name="planning_goal"
                      required
                      defaultValue=""
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select your primary goal
                      </option>
                      <option>Reduce lifetime taxes</option>
                      <option>Prepare for retirement</option>
                      <option>Improve business tax planning</option>
                      <option>Plan for a large sale or capital gain</option>
                      <option>Improve investment tax efficiency</option>
                      <option>Give to charity more efficiently</option>
                      <option>
                        Coordinate tax, estate, and financial planning
                      </option>
                      <option>I am not sure yet</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="mb-10 border-b-2 border-slate-200 pb-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                      Planning Topics
                    </p>
                    <h3 className="text-2xl font-black">
                      Select everything that applies
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className={checkboxClasses}>
                    <input
                      name="business_owner"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.profile === "Business owner"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">Business owner</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Business income, entity structure, retirement plans, or
                        estimated taxes.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="retiring_soon"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.profile ===
                          "Retired or approaching retirement" ||
                        qualificationAnswers.concern ===
                          "Retirement tax strategy"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Retiring within five years
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Roth conversions, Medicare, Social Security, RMDs, or
                        withdrawal planning.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="taxable_investments"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.concern === "Capital gains"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Taxable investments
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Capital gains, tax-loss harvesting, concentrated stock,
                        or asset location.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="large_retirement_accounts"
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Large retirement accounts
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Future RMD exposure, Roth conversions, beneficiaries, or
                        tax-efficient withdrawals.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="charitable_giving"
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Significant charitable giving
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Donor-advised funds, appreciated assets, bunching, or
                        qualified charitable distributions.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="upcoming_sale"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.concern ===
                        "Selling a business or asset"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Upcoming sale or liquidity event
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Business, real estate, company stock, or another highly
                        appreciated asset.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="stock_compensation"
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Stock options or equity compensation
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        RSUs, ISOs, NSOs, ESPP shares, or concentrated employer
                        stock.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="estate_planning"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.concern ===
                        "Estate or legacy planning"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        Estate and legacy planning
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Trusts, beneficiaries, gifting, estate-tax exposure, or
                        family coordination.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section className="mb-10 border-b-2 border-slate-200 pb-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    4
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                      Current Team
                    </p>
                    <h3 className="text-2xl font-black">
                      Professionals already involved
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className={checkboxClasses}>
                    <input
                      name="current_advisor"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.team ===
                          "CPA and financial advisor" ||
                        qualificationAnswers.team === "Financial advisor only"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        I currently work with a financial advisor
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        This does not prevent us from reviewing your planning
                        situation.
                      </span>
                    </span>
                  </label>

                  <label className={checkboxClasses}>
                    <input
                      name="current_cpa"
                      type="checkbox"
                      defaultChecked={
                        qualificationAnswers.team ===
                          "CPA and financial advisor" ||
                        qualificationAnswers.team === "CPA only"
                      }
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />

                    <span>
                      <span className="block font-black">
                        I currently work with a CPA or tax preparer
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Planning recommendations may be coordinated with your
                        existing professional.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section className="mb-10 border-b-2 border-slate-200 pb-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    5
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                      Timing and Scope
                    </p>
                    <h3 className="text-2xl font-black">
                      What level of help are you seeking?
                    </h3>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="desired_service"
                      className="mb-2 block text-sm font-black"
                    >
                      Planning service of interest
                    </label>

                    <select
                      id="desired_service"
                      name="desired_service"
                      required
                      defaultValue=""
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select an engagement
                      </option>
                      <option>Unity Tax Opportunity Assessment™</option>
                      <option>Comprehensive Tax Strategy Review</option>
                      <option>
                        Advanced Planning or Family Office Coordination
                      </option>
                      <option>I am not sure yet</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="urgency"
                      className="mb-2 block text-sm font-black"
                    >
                      When would you like to begin?
                    </label>

                    <select
                      id="urgency"
                      name="urgency"
                      required
                      defaultValue=""
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select a timeframe
                      </option>
                      <option>Within 30 days</option>
                      <option>Within 3 months</option>
                      <option>This year</option>
                      <option>Just exploring for now</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="referral_source"
                      className="mb-2 block text-sm font-black"
                    >
                      How did you hear about Unity Tax Planning?
                    </label>

                    <select
                      id="referral_source"
                      name="referral_source"
                      defaultValue=""
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      <option>Friend, family member, or client</option>
                      <option>Financial advisor</option>
                      <option>CPA or tax professional</option>
                      <option>Attorney</option>
                      <option>Google or another search engine</option>
                      <option>LinkedIn or social media</option>
                      <option>Unity Financial Planning Group</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    6
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                      Main Concern
                    </p>
                    <h3 className="text-2xl font-black">
                      What would you most like help solving?
                    </h3>
                  </div>
                </div>

                <label
                  htmlFor="biggest_tax_concern"
                  className="mb-2 block text-sm font-black"
                >
                  Briefly describe your concern or upcoming decision
                </label>

                <textarea
                  id="biggest_tax_concern"
                  name="biggest_tax_concern"
                  required
                  className={`${inputClasses} min-h-44 resize-y`}
                  placeholder="Example: I am five years from retirement and want to know whether I should begin Roth conversions. I also have a taxable investment account with a large unrealized gain."
                />

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Please provide general information only. Do not enter Social
                  Security numbers, account numbers, or other sensitive details.
                </p>
              </section>

              <div className="rounded-[2rem] border-2 border-slate-200 bg-slate-100 p-6 sm:p-7">
                <p className="mb-3 text-lg font-black text-slate-950">
                  Before you submit
                </p>

                <p className="text-sm font-medium leading-7 text-slate-600">
                  Submitting this assessment does not create a client
                  relationship or guarantee that an engagement will be offered.
                  Scope, pricing, responsibilities, and applicable disclosures
                  will be provided before any paid planning work begins.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-5 text-lg font-black text-white shadow-xl transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting
                  ? "Submitting Your Assessment..."
                  : "Submit My Assessment"}
              </button>

              {message && (
                <p className="mt-5 rounded-2xl bg-red-100 p-5 text-sm font-black text-red-700">
                  {message}
                </p>
              )}

              <p className="mt-5 text-center text-sm font-medium leading-6 text-slate-500">
                Your information will be used to evaluate your planning request
                and contact you regarding potential next steps.
              </p>
            </form>
          )}
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}