import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

export default function PricingPage() {
  const pricingPlans = [
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

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 px-4 py-5 text-white backdrop-blur sm:px-6">
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
            <Link href="/#receive" className="hover:text-white">
              What You Receive
            </Link>
            <Link href="/#samples" className="hover:text-white">
              Samples
            </Link>
            <Link href="/pricing" className="text-white">
              Pricing
            </Link>
          </nav>

          <Link
            href="/tax-opportunity-scan"
            className="rounded-full bg-white px-6 py-3 text-base font-black text-slate-950 shadow-lg hover:bg-blue-50 sm:px-8"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Start Review</span>
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
          <div className="grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[2rem] border-2 p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:p-9 ${
                  plan.featured
                    ? "border-blue-500 bg-slate-950 text-white"
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
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              Tax Prep vs. Tax Planning
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Tax preparation looks backward. Tax planning looks forward.
            </h2>
          </div>

          <div className="overflow-hidden rounded-[2rem] border-2 border-slate-300 bg-white shadow-xl">
            <div className="grid grid-cols-3 bg-slate-950 text-white">
              <div className="p-5 text-sm font-black uppercase tracking-[0.18em] sm:p-6">
                Service
              </div>
              <div className="p-5 text-center text-sm font-black uppercase tracking-[0.18em] sm:p-6">
                Tax Prep
              </div>
              <div className="p-5 text-center text-sm font-black uppercase tracking-[0.18em] sm:p-6">
                Tax Planning
              </div>
            </div>

            {[
              ["Prepare prior-year return", "✓", ""],
              ["Review prior-year return", "✓", "✓"],
              ["Identify future planning opportunities", "", "✓"],
              ["Roth conversion analysis", "", "✓"],
              ["Capital gain planning", "", "✓"],
              ["Charitable giving strategy", "", "✓"],
              ["Investment tax-efficiency review", "", "✓"],
              ["Retirement tax strategy", "", "✓"],
              ["CPA coordination notes", "", "✓"],
            ].map(([service, taxPrep, taxPlanning]) => (
              <div
                key={service}
                className="grid grid-cols-3 border-t border-slate-200"
              >
                <div className="p-5 text-base font-bold text-slate-900 sm:p-6">
                  {service}
                </div>
                <div className="p-5 text-center text-xl font-black text-slate-500 sm:p-6">
                  {taxPrep}
                </div>
                <div className="p-5 text-center text-xl font-black text-blue-600 sm:p-6">
                  {taxPlanning}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-4xl text-base leading-7 text-slate-500">
            Unity Tax Planning does not replace your CPA, tax preparer, or
            attorney. The goal is to help identify planning opportunities and
            coordinate implementation with the appropriate professionals.
          </p>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Start with the right level of review.
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-blue-100 sm:text-2xl">
            Begin with the intake form. If your situation requires a different
            level of planning, we will discuss that before any engagement begins.
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