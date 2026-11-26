import Link from "next/link";
import Navbar from "@/components/Navbar";
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
    <main className="min-h-screen bg-[#f8f5ef] text-[#10243b]">
      <Navbar />

      <section className="bg-[#10243b] px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-[#d6bc87] sm:text-base">
              Pricing
            </p>

            <h1 className="font-serif mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              Your year-round tax advisory partner.
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Start with a free Tax Opportunity Assessment. Our engagements are designed for families, business owners, and
              investors who want proactive planning beyond basic tax
              preparation.
            </p>
          </div>
        </div>
      </section>
      <section id="memberships" className="bg-[#f8f5ef] px-6 pt-14 pb-8 text-[#10243b]"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#80602b]">Ongoing tax advisory</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">Tax planning is not a once-a-year decision.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Choose the ongoing advisory relationship that fits your financial life. Each relationship begins with an initial tax strategy engagement, followed by year-round guidance.</p><div className="mt-10 grid gap-5 lg:grid-cols-3"><article className="flex flex-col border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-3xl">Essential</h3><p className="mt-5 text-4xl font-semibold text-[#10243b]">$199<span className="text-base font-normal text-slate-600"> / month</span></p><div className="mt-4 rounded-md border border-[#d6bc87] bg-[#f8f5ef] px-4 py-3 text-sm font-bold text-[#10243b]">✓ Annual Tax Preparation Included</div><div className="mt-4 border-y border-[#ded7ca] py-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#80602b]">Initial tax strategy engagement</p><p className="mt-2 text-xl font-semibold">From $995</p></div><ul className="mt-6 space-y-3 text-slate-700"><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Federal and one state individual tax return</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Annual tax strategy review</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Semiannual planning meetings</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Tax law updates</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Email support</li></ul><Link href="/tax-opportunity-scan" className="mt-8 block rounded-md bg-[#10243b] px-5 py-3 text-center font-semibold text-white">Discuss Essential</Link></article>
<article className="flex flex-col border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-3xl">Advanced</h3><p className="mt-5 text-4xl font-semibold text-[#10243b]">$499<span className="text-base font-normal text-slate-600"> / month</span></p><div className="mt-4 rounded-md border border-[#d6bc87] bg-[#f8f5ef] px-4 py-3 text-sm font-bold text-[#10243b]">✓ Annual Tax Preparation Included</div><div className="mt-4 border-y border-[#ded7ca] py-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#80602b]">Initial tax strategy engagement</p><p className="mt-2 text-xl font-semibold">From $3,500</p></div><ul className="mt-6 space-y-3 text-slate-700"><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Federal and one state individual return, plus one business return within agreed scope</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Quarterly planning meetings</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Tax projections</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Strategy implementation coordination</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>CPA coordination</li></ul><Link href="/tax-opportunity-scan" className="mt-8 block rounded-md bg-[#10243b] px-5 py-3 text-center font-semibold text-white">Discuss Advanced</Link></article>
<article className="flex flex-col border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-3xl">Private Advisory</h3><p className="mt-5 text-4xl font-semibold text-[#10243b]">$999<span className="text-base font-normal text-slate-600"> / month</span></p><div className="mt-4 rounded-md border border-[#d6bc87] bg-[#f8f5ef] px-4 py-3 text-sm font-bold text-[#10243b]">✓ Annual Tax Preparation Included</div><div className="mt-4 border-y border-[#ded7ca] py-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#80602b]">Initial tax strategy engagement</p><p className="mt-2 text-xl font-semibold">Custom scope</p></div><ul className="mt-6 space-y-3 text-slate-700"><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Individual and business returns within agreed scope</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Complex business and personal tax planning</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Monthly strategy meetings</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Transaction planning</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Priority access</li></ul><Link href="/tax-opportunity-scan" className="mt-8 block rounded-md bg-[#10243b] px-5 py-3 text-center font-semibold text-white">Discuss Private Advisory</Link></article></div><p className="mt-6 max-w-4xl text-sm leading-7 text-slate-600">Proposed initial fees are shown separately from monthly advisory fees. Final membership scope, initial planning fees, billing terms and coordination with existing Unity Financial Planning Group services are confirmed in writing before engagement. Annual tax preparation is included in memberships within the agreed scope. Additional entities, states, complex filings, bookkeeping, amended returns and tax representation may require separate fees. Investment advisory services are not included unless separately agreed. Tax savings are not guaranteed.</p></div></section>


      <section className="px-6 pb-14 pt-4 sm:pb-20"><div className="mx-auto max-w-7xl border border-[#ded7ca] bg-white p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#80602b]">Project-based tax planning</p><h2 className="mt-4 max-w-3xl font-serif text-3xl sm:text-4xl">Need guidance for a specific financial decision?</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Not every situation requires an ongoing relationship. We offer focused tax planning engagements for specific opportunities, transactions and life events.</p><div className="mt-6 divide-y divide-[#ded7ca] border-y border-[#ded7ca]">{pricingPlans.map(plan => <div key={plan.name} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-2xl"><h3 className="font-serif text-xl">{plan.name}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{plan.description}</p></div><p className="shrink-0 font-semibold text-[#80602b]">{plan.price}</p></div>)}</div><Link href="/tax-opportunity-scan" className="mt-6 inline-flex rounded-md bg-[#10243b] px-6 py-3 font-semibold text-white">Discuss a one-time engagement</Link><p className="mt-4 text-sm leading-6 text-slate-600">Annual tax preparation is included in advisory memberships, not standalone engagements unless separately agreed.</p></div></section>


      <section className="bg-[#10243b] px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#d6bc87] sm:text-base">
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

          <div className="overflow-hidden rounded-[2rem] border-2 border-slate-700 bg-[#19334e] shadow-2xl shadow-black/30">
            <div className="grid grid-cols-3 bg-[#80602b] text-white">
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

                <div className="p-4 text-center text-xl font-black text-[#d6bc87] sm:p-6">
                  {taxPlanning}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-4xl text-base leading-7 text-slate-400">
            Unity Tax Planning combines proactive strategy and tax preparation for members and coordinates with outside professionals as appropriate.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#80602b] sm:text-base">
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
                Annual tax preparation is included in ongoing memberships within the agreed scope. Standalone planning engagements focus on proactive strategy and do not include filing unless separately agreed.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-4 text-2xl font-black">
                Do you replace my CPA?
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                You may retain your existing CPA. We coordinate responsibilities and confirm preparation scope before engagement.
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
              className="inline-block w-full rounded-2xl border-2 border-slate-300 bg-white px-8 py-5 text-center text-lg font-black text-slate-950 shadow-lg hover:border-[#b99a60] hover:text-[#80602b] sm:w-auto"
            >
              View All Frequently Asked Questions
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#80602b] px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Start with the right level of review.
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-[#f8f5ef] sm:text-2xl">
            Begin with the intake form. If your situation requires a different
            level of planning, we will discuss that before any engagement
            begins.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/tax-opportunity-scan"
              className="inline-block w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-[#80602b] shadow-xl hover:bg-[#f8f5ef] sm:w-auto"
            >
              Start My Free Assessment
            </Link>

            <Link
              href="/how-it-works"
              className="inline-block w-full rounded-2xl border-2 border-[#d6bc87] px-8 py-5 text-lg font-black text-white hover:bg-[#98743b] sm:w-auto"
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