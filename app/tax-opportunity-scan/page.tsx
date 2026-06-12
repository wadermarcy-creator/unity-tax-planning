"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DisclosureFooter from "@/components/DisclosureFooter";

export default function TaxOpportunityScanPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function calculateLeadScore(formData: FormData) {
    let score = 0;

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

    if (desiredService === "Comprehensive Tax Planning Review") score += 15;
    if (desiredService === "Advanced Planning or Family Office Coordination") {
      score += 25;
    }

    return score;
  }

  function calculateLeadGrade(score: number) {
    if (score >= 100) return "A+ Lead";
    if (score >= 75) return "A Lead";
    if (score >= 50) return "B Lead";
    if (score >= 25) return "C Lead";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const leadScore = calculateLeadScore(formData);
    const leadGrade = calculateLeadGrade(leadScore);

    const lead = {
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

      biggest_tax_concern: buildConcernSummary(formData),

      lead_score: leadScore,
      lead_grade: leadGrade,
      status: "new",
    };

    const { error } = await supabase.from("tax_leads").insert([lead]);

    if (error) {
      console.error(error);
      setMessage(
        "Something went wrong while submitting your review. Please try again.",
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
      <section className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 px-4 py-4 text-white backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-900/30">
              <span className="text-xl font-black tracking-tight text-white">
                U
              </span>
            </div>

            <div className="leading-tight">
              <p className="text-xl font-black tracking-tight sm:text-2xl">
                UNITY
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
                Tax Planning
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 text-base font-semibold text-slate-300 md:flex">
            <Link href="/#situations" className="hover:text-white">
              Situations
            </Link>

            <Link href="/how-it-works" className="hover:text-white">
              How It Works
            </Link>

            <Link href="/#samples" className="hover:text-white">
              Samples
            </Link>

            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </nav>

          <Link
            href="/"
            className="rounded-full border-2 border-slate-700 px-5 py-3 text-sm font-black text-white transition hover:border-blue-400 hover:bg-slate-900 sm:px-7 sm:text-base"
          >
            Home
          </Link>
        </div>

        <div className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1 md:hidden">
          <Link
            href="/#situations"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Situations
          </Link>

          <Link
            href="/how-it-works"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            How It Works
          </Link>

          <Link
            href="/#samples"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Samples
          </Link>

          <Link
            href="/pricing"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Pricing
          </Link>
        </div>
      </section>

      <section className="bg-slate-950 px-4 pb-20 pt-16 text-white sm:px-6 md:pb-28 md:pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-36">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.26em] text-blue-300 sm:text-base">
              Tax Blind Spot Review
            </p>

            <h1 className="mb-7 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Let&apos;s find out what deserves a closer look.
            </h1>

            <p className="mb-8 max-w-2xl text-xl font-medium leading-9 text-slate-300">
              Answer a few questions about your income, investments, business,
              retirement plans, and upcoming decisions. The intake should take
              about five minutes.
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
                    <p className="font-black text-white">Initial review</p>
                    <p className="mt-1 leading-7 text-slate-300">
                      Your answers are reviewed for planning opportunities and
                      areas requiring more information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    2
                  </div>

                  <div>
                    <p className="font-black text-white">Fit conversation</p>
                    <p className="mt-1 leading-7 text-slate-300">
                      If the situation appears to be a fit, we discuss scope,
                      timing, and pricing before beginning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    3
                  </div>

                  <div>
                    <p className="font-black text-white">Secure document review</p>
                    <p className="mt-1 leading-7 text-slate-300">
                      Relevant documents are requested through a secure process,
                      not through this intake form.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    4
                  </div>

                  <div>
                    <p className="font-black text-white">Written plan</p>
                    <p className="mt-1 leading-7 text-slate-300">
                      The engagement may include a written planning summary,
                      priorities, implementation steps, and coordination notes.
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

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-8 lg:p-10"
          >
            <div className="mb-10">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                Step One
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Tell us about your situation.
              </h2>

              <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
                There are no perfect answers. Estimates and approximate ranges
                are fine for this initial review.
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
                  <h3 className="text-2xl font-black">Contact information</h3>
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
                    defaultValue=""
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
                    defaultValue=""
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
                    <option>Coordinate tax, estate, and financial planning</option>
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
                    className="mt-1 h-5 w-5 accent-blue-600"
                  />

                  <span>
                    <span className="block font-black">
                      Taxable investments
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      Capital gains, tax-loss harvesting, concentrated stock, or
                      asset location.
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
                    <option>Tax Blind Spot Review</option>
                    <option>Comprehensive Tax Planning Review</option>
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
                Submitting this intake does not create a client relationship or
                guarantee that an engagement will be offered. Scope, pricing,
                responsibilities, and applicable disclosures will be provided
                before any paid planning work begins.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-5 text-lg font-black text-white shadow-xl transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting
                ? "Submitting Your Review..."
                : "Submit My Tax Blind Spot Review"}
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
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}