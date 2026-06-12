"use client";

import { useState } from "react";
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

    if (householdIncome === "$250k - $500k") score += 10;
    if (householdIncome === "$500k - $1M") score += 20;
    if (householdIncome === "$1M+") score += 30;

    if (investableAssets === "$500k - $1M") score += 10;
    if (investableAssets === "$1M - $5M") score += 25;
    if (investableAssets === "$5M+") score += 40;

    if (formData.get("business_owner") === "on") score += 25;
    if (formData.get("retiring_soon") === "on") score += 20;
    if (formData.get("charitable_giving") === "on") score += 15;
    if (formData.get("upcoming_sale") === "on") score += 25;
    if (formData.get("current_advisor") !== "on") score += 20;

    return score;
  }

  function calculateLeadGrade(score: number) {
    if (score >= 80) return "A Lead";
    if (score >= 50) return "B Lead";
    if (score >= 25) return "C Lead";
    return "Nurture";
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

      biggest_tax_concern: String(formData.get("biggest_tax_concern") || ""),

      lead_score: leadScore,
      lead_grade: leadGrade,
      status: "new",
    };

    const { error } = await supabase.from("tax_leads").insert([lead]);

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    form.reset();
    router.push("/thank-you");
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-950 px-6 py-6 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">
            Unity Tax Planning
          </a>

          <a
            href="/"
            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Back to Home
          </a>
        </div>
      </section>

      <section className="bg-slate-950 px-6 pb-20 pt-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              The Tax Blind Spot Review
            </p>

            <h1 className="mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
              Start with the intake. Then we determine what deserves a deeper review.
            </h1>

            <p className="mb-8 text-xl leading-8 text-slate-300">
              This is the first step in the planning process. After you submit
              this intake, I’ll review the information and determine whether a
              deeper tax planning review makes sense.
            </p>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="mb-4 font-semibold text-white">
                If there is a fit, the next step may include:
              </p>

              <div className="space-y-3 text-sm leading-6 text-slate-300">
                <p>• Secure upload of prior-year tax returns</p>
                <p>• Review of paystubs, income estimates, or business income</p>
                <p>• Review of brokerage and retirement account statements</p>
                <p>• Review of charitable giving and estate planning topics</p>
                <p>• Review of upcoming sale, liquidity, or retirement events</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="mb-4 font-semibold text-white">
                The written tax plan may include:
              </p>

              <div className="space-y-3 text-sm leading-6 text-slate-300">
                <p>• Tax Blind Spot Summary</p>
                <p>• Potential tax savings opportunities</p>
                <p>• Priority map of planning items</p>
                <p>• CPA coordination notes</p>
                <p>• Action list for implementation</p>
                <p>• Review call to walk through the plan</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-500">
              Please do not upload or enter sensitive tax documents on this
              intake page. If a deeper review is appropriate, documents will be
              requested through a secure process.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 text-slate-950 shadow-2xl md:p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                Start your blind spot review
              </h2>

              <p className="mt-2 leading-7 text-slate-600">
                Please provide a few details so I can understand what planning
                areas may deserve attention. This should take less than five
                minutes.
              </p>
            </div>

            <div className="mb-8 rounded-3xl bg-slate-100 p-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                What Happens After This?
              </p>

              <div className="space-y-3 text-sm leading-6 text-slate-700">
                <p>
                  <span className="font-semibold">1. Initial review:</span> I
                  review your intake for potential blind spots.
                </p>

                <p>
                  <span className="font-semibold">2. Review call:</span> If
                  there appears to be a planning opportunity, we schedule a
                  short call.
                </p>

                <p>
                  <span className="font-semibold">3. Secure documents:</span>{" "}
                  If deeper planning is appropriate, tax returns and supporting
                  documents may be requested securely.
                </p>

                <p>
                  <span className="font-semibold">4. Written plan:</span> A
                  deeper engagement may include a written PDF plan with
                  opportunities, priorities, and next steps.
                </p>
              </div>
            </div>

            <div className="mb-8 border-b border-slate-200 pb-8">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Contact Information
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    First name
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Last name
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8 border-b border-slate-200 pb-8">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Financial Picture
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Household income
                  </label>
                  <select
                    name="household_income"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Under $150k</option>
                    <option>$150k - $250k</option>
                    <option>$250k - $500k</option>
                    <option>$500k - $1M</option>
                    <option>$1M+</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Investable assets
                  </label>
                  <select
                    name="investable_assets"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Under $250k</option>
                    <option>$250k - $500k</option>
                    <option>$500k - $1M</option>
                    <option>$1M - $5M</option>
                    <option>$5M+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8 border-b border-slate-200 pb-8">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Planning Topics
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-400">
                  <input name="business_owner" type="checkbox" />
                  <span className="font-medium">Business owner</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-400">
                  <input name="retiring_soon" type="checkbox" />
                  <span className="font-medium">Retiring within 5 years</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-400">
                  <input name="charitable_giving" type="checkbox" />
                  <span className="font-medium">
                    Significant charitable giving
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-400">
                  <input name="current_advisor" type="checkbox" />
                  <span className="font-medium">Current financial advisor</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-400">
                  <input name="current_cpa" type="checkbox" />
                  <span className="font-medium">Current CPA</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-400">
                  <input name="upcoming_sale" type="checkbox" />
                  <span className="font-medium">
                    Upcoming business, real estate, or stock sale
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-sm font-semibold">
                What tax issue are you most concerned about?
              </label>

              <textarea
                name="biggest_tax_concern"
                className="min-h-36 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Examples: I feel like I pay too much in taxes, I am selling a business, I am retiring soon, I need Roth conversion guidance, I have a large capital gain, I want to give to charity more efficiently, etc."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Submitting..." : "Submit My Blind Spot Review"}
            </button>

            {message && (
              <p className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-700">
                {message}
              </p>
            )}

            <p className="mt-5 text-sm leading-6 text-slate-500">
              This intake form is for initial review only. Please do not upload,
              paste, or enter full tax returns, Social Security numbers, account
              numbers, or other sensitive documents here.
            </p>
          </form>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}