import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  bestFor: string[];
  includes: string[];
  cta: string;
  href: string;
  featured: boolean;
};

export default function PricingPage() {
  const pricingPlans: PricingPlan[] = [
    {
      name: "Tax Blind Spot Review",
      price: "Starting at $995",
      description:
        "A focused review to identify potential tax planning opportunities that may be easy to miss.",
      bestFor: [
        "High-income W-2 earners",
        "Families with taxable investments",
        "People wanting a second opinion",
        "Those unsure where to start",
      ],
      includes: [
        "Review of prior-year tax return",
        "Review of current-year income picture",
        "Identification of planning opportunities",
        "Written summary",
        "Review meeting",
      ],
      cta: "Start My Review",
      href: "/tax-opportunity-scan",
      featured: false,
    },
    {
      name: "Comprehensive Tax Planning Review",
      price: "Starting at $3,500",
      description:
        "A deeper planning engagement for families and business owners with multiple moving parts.",
      bestFor: [
        "Business owners",
        "Pre-retirees",
        "Families with complex income",
        "People with several planning needs",
      ],
      includes: [
        "Everything in the Blind Spot Review",
        "Retirement tax planning review",
        "Investment tax-efficiency review",
        "Charitable giving review",
        "Detailed planning report",
        "CPA coordination notes",
      ],
      cta: "Start My Review",
      href: "/tax-opportunity-scan",
      featured: true,
    },
    {
      name: "Advanced Planning & Family Office Coordination",
      price: "Custom Engagement",
      description:
        "For complex situations involving large gains, business sales, estate planning, and multi-advisor coordination.",
      bestFor: [
        "Ultra-high-net-worth families",
        "Business sale planning",
        "Large capital gains",
        "Estate and legacy planning coordination",
      ],
      includes: [
        "Family office-style coordination",
        "CPA collaboration",
        "Attorney collaboration",
        "Liquidity event planning",
        "Estate planning coordination",
        "Private investment review",
      ],
      cta: "Request Consultation",
      href: "/tax-opportunity-scan",
      featured: false,
    },
  ];

  const comparisonRows = [
    ["Prepare prior-year return", "✓", ""],
    ["Review prior-year return", "✓", "✓"],
    ["Identify future planning opportunities", "", "✓"],
    ["Roth conversion analysis", "", "✓"],
    ["Capital gain planning", "", "✓"],
    ["Charitable giving strategy", "", "✓"],
    ["Investment tax-efficiency review", "", "✓"],
    ["Retirement tax strategy", "", "✓"],
    ["CPA coordination notes", "", "✓"],
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
            <Link href="/#situations" className="hover:text-white">
              Situations
            </Link>

            <Link href="/how-it-works" className="hover:text-white">
              How It Works
            </Link>

            <Link href="/#samples" className="hover:text-white">
              Samples
            </Link>

            <Link href="/pricing" className="text-white">
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
            className="shrink-0 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-bold text-white"
          >
            Pricing
          </Link>

          <Link
            href="/faq"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            FAQ
          </Link>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-blue-300 sm:text-base">
              Pricing
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              Tax planning should be clear before you begin.
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              These engagements are designed for families, business owners, and
              investors who want proactive planning beyond basic tax
              preparation.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              Engagement Options
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Choose the level of review that fits your situation.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[2rem] border-2 p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:p-9 ${
                  plan.featured
                    ? "border-blue-500 bg-slate-950 text-white shadow-blue-950/30"
                    : "border-slate-300 bg-white text-slate-950"
                }`}
              >
                {plan.featured && (
                  <p className="mb-5 inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
                    Most Popular
                  </p>
                )}

                <h2 className="mb-5 text-3xl font-black tracking-tight">
                  {plan.name}
                </h2>

                <p
                  className={`mb-6 text-2xl font-black ${
                    plan.featured ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {plan.price}
                </p>

                <p
                  className={`mb-8 text-lg font-medium leading-8 ${
                    plan.featured ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">
                    Best For
                  </h3>

                  <ul className="space-y-3">
                    {plan.bestFor.map((item) => (
                      <li
                        key={item}
                        className={`flex gap-3 text-base font-medium leading-7 ${
                          plan.featured ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <span className="font-black text-blue-500">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">
                    Includes
                  </h3>

                  <ul className="space-y-3">
                    {plan.includes.map((item) => (
                      <li
                        key={item}
                        className={`flex gap-3 text-base font-medium leading-7 ${
                          plan.featured ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <span className="font-black text-blue-500">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`block rounded-2xl px-6 py-4 text-center text-base font-black ${
                    plan.featured
                      ? "bg-blue-500 text-white hover:bg-blue-400"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-10 max-w-4xl text-base leading-7 text-slate-500">
            Pricing may vary based on complexity, number of entities, number of
            tax returns reviewed, number of accounts involved, timing, and the
            level of coordination needed with outside professionals.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              Why Planning Costs More Than Tax Prep
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Tax prep records the past. Tax planning helps prepare for what is
              next.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              The purpose is not just to file forms. The purpose is to identify
              planning opportunities before decisions are final.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border-2 border-slate-700 bg-slate-900 shadow-2xl shadow-black/30">
            <div className="grid grid-cols-3 bg-blue-600 text-white">
              <div className="p-4 text-xs font-black uppercase tracking-[0.16em] sm:p-6 sm:text-sm">
                Service
              </div>

              <div className="p-4 text-center text-xs font-black uppercase tracking-[0.16em] sm:p-6 sm:text-sm">
                Tax Prep
              </div>

              <div className="p-4 text-center text-xs font-black uppercase tracking-[0.16em] sm:p-6 sm:text-sm">
                Tax Planning
              </div>
            </div>

            {comparisonRows.map(([service, taxPrep, taxPlanning]) => (
              <div
                key={service}
                className="grid grid-cols-3 border-t border-slate-700"
              >
                <div className="p-4 text-sm font-bold text-white sm:p-6 sm:text-base">
                  {service}
                </div>

                <div className="p-4 text-center text-xl font-black text-slate-500 sm:p-6">
                  {taxPrep}
                </div>

                <div className="p-4 text-center text-xl font-black text-blue-300 sm:p-6">
                  {taxPlanning}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-4xl text-base leading-7 text-slate-400">
            Unity Tax Planning does not replace your CPA, tax preparer, or
            attorney. The goal is to help identify planning opportunities and
            coordinate implementation with the appropriate professionals.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              Common Questions
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              A few things to know before starting.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-4 text-2xl font-black">
                Is this tax preparation?
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                No. This is proactive tax planning. Tax preparation is focused
                on filing a return. Tax planning is focused on identifying
                opportunities before decisions are made.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-4 text-2xl font-black">
                Do you replace my CPA?
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                No. The goal is to work alongside your CPA or tax preparer by
                providing planning ideas, coordination notes, and financial
                planning context.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-4 text-2xl font-black">
                What if I need more than the starting review?
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                If your situation requires more advanced planning, that will be
                discussed before any engagement begins. You will know the scope
                and pricing first.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-4 text-2xl font-black">
                Is tax savings guaranteed?
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                No. Tax planning can identify opportunities, tradeoffs, and
                timing strategies, but there is no guarantee of savings or a
                specific tax result.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/faq"
              className="inline-block w-full rounded-2xl border-2 border-slate-300 bg-white px-8 py-5 text-center text-lg font-black text-slate-950 shadow-lg hover:border-blue-500 hover:text-blue-600 sm:w-auto"
            >
              View All Frequently Asked Questions
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Start with the right level of review.
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-blue-100 sm:text-2xl">
            Begin with the intake form. If your situation requires a different
            level of planning, we will discuss that before any engagement
            begins.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/tax-opportunity-scan"
              className="inline-block w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-blue-600 shadow-xl hover:bg-blue-50 sm:w-auto"
            >
              Start My Tax Blind Spot Review
            </Link>

            <Link
              href="/how-it-works"
              className="inline-block w-full rounded-2xl border-2 border-blue-300 px-8 py-5 text-lg font-black text-white hover:bg-blue-500 sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}