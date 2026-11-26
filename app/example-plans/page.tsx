import type { Metadata } from "next";
export const metadata: Metadata = {"title":"Hypothetical Tax Planning Examples","description":"Explore educational tax planning scenarios for business owners, retirement, capital gains and charitable giving.","alternates":{"canonical":"/example-plans"},"openGraph":{"title":"Hypothetical Tax Planning Examples","description":"Explore educational tax planning scenarios for business owners, retirement, capital gains and charitable giving.","url":"/example-plans"}};
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DisclosureFooter from "@/components/DisclosureFooter";

const plans = [
  {
    title: "Business Owner",
    description:
      "Entity structure, retirement plans, deductions, and cash-flow tax strategy.",
    slug: "business-owner",
  },
  {
    title: "Pre-Retiree With Large IRAs",
    description:
      "Roth conversions, RMD planning, IRMAA, and retirement income strategy.",
    slug: "pre-retiree-large-iras",
  },
  {
    title: "High-Income Family",
    description:
      "Income planning, charitable giving, investment taxes, and family wealth strategy.",
    slug: "high-income-family",
  },
  {
    title: "Large Capital Gain",
    description:
      "Capital gains, charitable strategies, installment sales, and reinvestment planning.",
    slug: "large-capital-gain",
  },
  {
    title: "Taxable Investment Account",
    description:
      "Tax-loss harvesting, asset location, dividend strategy, and portfolio tax efficiency.",
    slug: "taxable-investment-account",
  },
  {
    title: "Charitable Giving",
    description:
      "Donor-advised funds, bunching, appreciated assets, QCDs, and legacy planning.",
    slug: "charitable-giving",
  },
];

export default function ExamplePlansPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#10243b]">
      <Navbar />

      <section className="bg-[#10243b] px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-[#d6bc87] sm:text-base">
            Sample Plans
          </p>

          <h1 className="font-serif max-w-5xl text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
            See what proactive tax strategy can look like.
          </h1>

          <p className="mt-8 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
            Review sample scenarios for business owners, high-income families,
            investors, and retirees so you can see the type of planning issues a
            Unity Tax Opportunity Assessment™ may uncover.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tax-opportunity-scan"
              className="inline-block rounded-2xl bg-[#80602b] px-8 py-5 text-center text-lg font-black text-white shadow-xl shadow-black/10 hover:bg-[#98743b]"
            >
              Start My Assessment
            </Link>

            <Link
              href="/pricing"
              className="inline-block rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-[#d6bc87] hover:bg-[#19334e]"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#80602b] sm:text-base">
              Example Scenarios
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Explore planning examples by situation.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-600 sm:text-2xl">
              These examples are for education only. Your actual planning
              opportunities depend on your income, assets, business structure,
              goals, documents, and professional tax advice.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.slug}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-[#b99a60] hover:shadow-2xl sm:p-9"
              >
                <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#80602b]">
                  Sample Plan
                </p>

                <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                  {plan.title}
                </h3>

                <p className="text-lg font-medium leading-8 text-slate-600">
                  {plan.description}
                </p>

                <Link
                  href={`/example-plans/${plan.slug}`}
                  className="mt-8 inline-block rounded-2xl bg-[#80602b] px-6 py-4 text-base font-black text-white shadow-xl shadow-black/10 hover:bg-[#98743b]"
                >
                  View Sample Plan
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10243b] px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#d6bc87] sm:text-base">
            Start Here
          </p>

          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Your situation deserves more than a generic checklist.
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
            Start your Unity Tax Opportunity Assessment™ and find out whether
            proactive planning may make a meaningful difference.
          </p>

          <Link
            href="/tax-opportunity-scan"
            className="inline-block rounded-2xl bg-[#80602b] px-8 py-5 text-lg font-black text-white shadow-xl shadow-black/10 hover:bg-[#98743b]"
          >
            Start My Assessment
          </Link>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}