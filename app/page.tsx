import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type Situation = {
  title: string;
  description: string;
  sampleSlug: string;
};

type SamplePlan = {
  title: string;
  description: string;
  slug: string;
};

export default function Home() {
  const situations: Situation[] = [
    {
      title: "I own a business",
      description:
        "Coordinate business income, retirement plan design, estimated taxes, and personal tax strategy.",
      sampleSlug: "business-owner",
    },
    {
      title: "I am retiring soon",
      description:
        "Review Roth conversions, RMDs, Social Security, Medicare IRMAA, and withdrawal sequencing.",
      sampleSlug: "pre-retiree-large-iras",
    },
    {
      title: "I have a high income",
      description:
        "Look for tax planning opportunities around retirement plans, giving, investments, and deductions.",
      sampleSlug: "high-income-family",
    },
    {
      title: "I have taxable investments",
      description:
        "Identify capital gains exposure, tax-loss harvesting opportunities, and portfolio tax drag.",
      sampleSlug: "taxable-investment-account",
    },
    {
      title: "I give to charity",
      description:
        "Coordinate generosity with appreciated stock, donor-advised funds, bunching, and future QCDs.",
      sampleSlug: "charitable-giving",
    },
    {
      title: "I may sell something big",
      description:
        "Plan before selling a business, property, stock position, or other highly appreciated asset.",
      sampleSlug: "large-capital-gain",
    },
  ];

  const samplePlans: SamplePlan[] = [
    {
      title: "Business Owner Tax Planning",
      description:
        "S-Corp income, retirement plan design, QBI, estimated taxes, and CPA coordination.",
      slug: "business-owner",
    },
    {
      title: "Pre-Retiree with Large IRAs",
      description:
        "Roth conversion planning, future RMDs, Medicare IRMAA, and retirement tax mapping.",
      slug: "pre-retiree-large-iras",
    },
    {
      title: "High-Income Family Planning",
      description:
        "Backdoor Roth, charitable giving, tax-loss harvesting, asset location, and year-end planning.",
      slug: "high-income-family",
    },
    {
      title: "Large Capital Gain Planning",
      description:
        "Pre-sale planning, depreciation recapture, NIIT, charitable strategy, installment sale, and 1031 review.",
      slug: "large-capital-gain",
    },
    {
      title: "Investment Tax-Efficiency Review",
      description:
        "Unrealized gains, harvestable losses, asset location, tax drag, and concentrated positions.",
      slug: "taxable-investment-account",
    },
    {
      title: "Charitable Giving Strategy",
      description:
        "Appreciated stock gifting, donor-advised fund bunching, deduction planning, and future QCDs.",
      slug: "charitable-giving",
    },
  ];

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

          <nav className="hidden items-center gap-8 text-base font-semibold text-slate-300 lg:flex">
            <a href="#situations" className="hover:text-white">
              Situations
            </a>

            <Link href="/how-it-works" className="hover:text-white">
              How It Works
            </Link>

            <a href="#samples" className="hover:text-white">
              Samples
            </a>

            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>

            <Link href="/faq" className="hover:text-white">
              FAQ
            </Link>
          </nav>

          <Link
            href="/tax-opportunity-scan"
            className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-blue-50 sm:px-8 sm:text-base"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Start Review</span>
          </Link>
        </div>

        <div className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden">
          <a
            href="#situations"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Situations
          </a>

          <Link
            href="/how-it-works"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            How It Works
          </Link>

          <a
            href="#samples"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Samples
          </a>

          <Link
            href="/pricing"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Pricing
          </Link>

          <Link
            href="/faq"
            className="shrink-0 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-bold text-white"
          >
            FAQ
          </Link>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-blue-300 sm:text-base">
              Tax Planning Before It Becomes Tax History
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              Your tax return shows what happened.
              <span className="block text-blue-300">
                We help identify what may have been missed.
              </span>
            </h1>

            <p className="mb-10 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Unity Tax Planning helps business owners, high-income families,
              retirees, and investors uncover tax planning opportunities before
              important decisions are made.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/tax-opportunity-scan"
                className="w-full rounded-2xl bg-blue-500 px-8 py-5 text-center text-lg font-black text-white shadow-xl shadow-blue-950/30 hover:bg-blue-400 sm:w-auto"
              >
                Start My Tax Blind Spot Review
              </Link>

              <a
                href="#samples"
                className="w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
              >
                View Sample Plans
              </a>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-500">
              This is not tax preparation, legal advice, accounting advice, or a
              guarantee of tax savings.
            </p>
          </div>
        </div>
      </section>

      <section id="situations" className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              Choose Your Situation
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Start with what is actually happening in your life.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {situations.map((situation) => (
              <article
                key={situation.title}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                  {situation.title}
                </h3>

                <p className="text-lg font-medium leading-8 text-slate-600">
                  {situation.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/example-plans/${situation.sampleSlug}`}
                    className="flex w-full justify-center rounded-xl bg-blue-600 px-5 py-4 text-center text-base font-black text-white hover:bg-blue-500 sm:w-auto"
                  >
                    View Sample
                  </Link>

                  <Link
                    href="/tax-opportunity-scan"
                    className="flex w-full justify-center rounded-xl border-2 border-slate-300 px-5 py-4 text-center text-base font-black text-slate-800 hover:border-blue-500 hover:text-blue-600 sm:w-auto"
                  >
                    Find Blind Spots
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="receive"
        className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              What You Receive
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              A clear planning summary, not a generic tax checklist.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              The goal is to turn your tax return, financial details, and
              planning questions into a more organized plan of action.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Step 01
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Document Review
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                We review the information needed to understand your tax picture,
                such as returns, income estimates, investment accounts, business
                details, or charitable giving.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-2xl shadow-blue-950/40 sm:p-9">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Step 02
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Planning Analysis
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                We look for planning opportunities around income, investments,
                retirement accounts, charitable giving, business ownership, or
                upcoming transactions.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Step 03
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Written Plan + Next Steps
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                You receive a written planning summary with potential
                opportunities, priority items, implementation notes, and areas
                to coordinate with your CPA or other professionals.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/how-it-works"
              className="inline-block w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section id="samples" className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
                Sample Planning Scenarios
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                See what a tax planning deliverable can look like.
              </h2>
            </div>

            <p className="text-xl font-medium leading-9 text-slate-600 sm:text-2xl">
              Each sample page explains the scenario, the planning issue, the
              opportunities reviewed, and includes a sample report.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {samplePlans.map((plan) => (
              <Link
                key={plan.slug}
                href={`/example-plans/${plan.slug}`}
                className="group rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <h3 className="mb-5 text-2xl font-black tracking-tight group-hover:text-blue-600 sm:text-3xl">
                  {plan.title}
                </h3>

                <p className="mb-8 text-lg font-medium leading-8 text-slate-600">
                  {plan.description}
                </p>

                <span className="text-base font-black text-blue-600">
                  View Sample →
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-base leading-7 text-slate-500">
            Sample plans are hypothetical and for illustrative purposes only.
            They do not represent actual client experiences and should not be
            interpreted as tax, legal, accounting, investment, or financial
            advice.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              Pricing
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Start with the right level of review.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Choose the level of planning that fits your situation. More
              complex needs can be discussed before any engagement begins.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Tax Blind Spot Review
              </h3>

              <p className="mb-5 text-2xl font-black text-blue-300">
                Starting at $995
              </p>

              <p className="text-lg font-medium leading-8 text-slate-300">
                A focused review to identify potential tax planning
                opportunities that may be easy to miss.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-2xl shadow-blue-950/40 sm:p-9">
              <p className="mb-5 inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
                Most Popular
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Comprehensive Tax Planning
              </h3>

              <p className="mb-5 text-2xl font-black text-blue-300">
                Starting at $3,500
              </p>

              <p className="text-lg font-medium leading-8 text-slate-300">
                A deeper planning engagement for business owners, pre-retirees,
                and families with multiple moving parts.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Advanced Planning
              </h3>

              <p className="mb-5 text-2xl font-black text-blue-300">
                Custom Engagement
              </p>

              <p className="text-lg font-medium leading-8 text-slate-300">
                For complex situations involving large gains, business sales,
                estate planning, and multi-advisor coordination.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="w-full rounded-2xl bg-blue-500 px-8 py-5 text-center text-lg font-black text-white shadow-xl shadow-blue-950/30 hover:bg-blue-400 sm:w-auto"
            >
              View Full Pricing
            </Link>

            <Link
              href="/faq"
              className="w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
            >
              Read Frequently Asked Questions
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Ready to see what your tax plan may be missing?
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-blue-100 sm:text-2xl">
            Start with a short intake. If there is a fit, the next step is a
            deeper review of your documents and a written tax planning summary.
          </p>

          <Link
            href="/tax-opportunity-scan"
            className="inline-block w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-blue-600 shadow-xl hover:bg-blue-50 sm:w-auto"
          >
            Start My Tax Blind Spot Review
          </Link>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}