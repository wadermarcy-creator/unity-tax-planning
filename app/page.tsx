import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type Situation = {
  title: string;
  description: string;
  sampleSlug: string;
};

type PlanningExample = {
  slug: string;
  title: string;
  profile: string;
  blindSpots: string[];
  deliverable: string;
  samplePdf: string;
  sampleButtonText: string;
};

export default function Home() {
  const situations: Situation[] = [
    {
      title: "I own a business",
      description:
        "Income is meaningful, taxes are inconsistent, and future growth or a sale may create larger planning decisions.",
      sampleSlug: "business-owner",
    },
    {
      title: "I am retiring soon",
      description:
        "Roth conversions, withdrawals, RMDs, Social Security, Medicare IRMAA, and charitable giving may need to be coordinated.",
      sampleSlug: "pre-retiree-large-iras",
    },
    {
      title: "I have a high income",
      description:
        "High income can hide missed planning opportunities around investments, deductions, retirement plans, and charitable giving.",
      sampleSlug: "high-income-family",
    },
    {
      title: "I have taxable investments",
      description:
        "Capital gains, losses, turnover, asset location, and concentrated positions can quietly shape your tax bill.",
      sampleSlug: "taxable-investment-account",
    },
    {
      title: "I give to charity",
      description:
        "The asset you give, the timing of the gift, and the vehicle you use may matter as much as the amount you give.",
      sampleSlug: "charitable-giving",
    },
    {
      title: "I may sell something big",
      description:
        "A business, property, stock position, or liquidity event should be reviewed before the transaction happens.",
      sampleSlug: "large-capital-gain",
    },
  ];

  const examples: PlanningExample[] = [
    {
      slug: "high-income-family",
      title: "The High-Income Family",
      profile:
        "A family earning significant W-2 income feels like taxes eat everything but does not know what else can be done.",
      blindSpots: [
        "Backdoor Roth or retirement contribution opportunities",
        "Charitable bunching and donor-advised fund strategy",
        "Taxable investment account efficiency",
      ],
      deliverable:
        "A written summary showing potential planning opportunities, year-end action items, and CPA coordination notes.",
      samplePdf: "/sample-plans/high-income-family-tax-plan-sample.pdf",
      sampleButtonText: "View Sample High-Income Family Plan",
    },
    {
      slug: "business-owner",
      title: "The Business Owner",
      profile:
        "A business owner has strong income, inconsistent cash flow, and wants to know whether the business and personal tax strategy are connected.",
      blindSpots: [
        "Retirement plan design",
        "Estimated tax coordination",
        "Entity and compensation planning discussion points",
      ],
      deliverable:
        "A planning PDF outlining business owner tax topics, retirement plan opportunities, and CPA questions.",
      samplePdf: "/sample-plans/business-owner-tax-plan-sample.pdf",
      sampleButtonText: "View Sample Business Owner Plan",
    },
    {
      slug: "pre-retiree-large-iras",
      title: "The Pre-Retiree with Large IRAs",
      profile:
        "A couple in their early 60s has built large pre-tax IRA balances and wants to avoid being forced into heavy RMDs later.",
      blindSpots: [
        "Roth conversion windows",
        "RMD and QCD planning",
        "Social Security and Medicare IRMAA awareness",
      ],
      deliverable:
        "A retirement tax map showing which years may deserve deeper Roth conversion and withdrawal analysis.",
      samplePdf: "/sample-plans/roth-conversion-ladder-sample.pdf",
      sampleButtonText: "View Sample Roth Conversion Plan",
    },
    {
      slug: "large-capital-gain",
      title: "The Large Capital Gain",
      profile:
        "A family expects to sell a property, business interest, or concentrated stock position that could create a major tax bill.",
      blindSpots: [
        "Capital gains planning before the sale",
        "Charitable giving before the liquidity event",
        "Estimated tax planning",
      ],
      deliverable:
        "A pre-sale planning summary identifying tax-sensitive decisions to review before the transaction closes.",
      samplePdf: "/sample-plans/large-capital-gain-tax-plan-sample.pdf",
      sampleButtonText: "View Sample Capital Gain Plan",
    },
    {
      slug: "taxable-investment-account",
      title: "The Taxable Investment Account",
      profile:
        "A household has a large brokerage account but does not know whether the portfolio is being managed with tax efficiency in mind.",
      blindSpots: [
        "Tax-loss harvesting opportunities",
        "Unrealized capital gains exposure",
        "Asset location and turnover review",
      ],
      deliverable:
        "An investment tax-efficiency review showing potential tax planning issues inside the taxable portfolio.",
      samplePdf: "/sample-plans/taxable-investment-account-sample.pdf",
      sampleButtonText: "View Sample Investment Tax Review",
    },
    {
      slug: "charitable-giving",
      title: "The Charitably Inclined Family",
      profile:
        "A family gives to church and charities every year but usually writes checks without reviewing the best way to give.",
      blindSpots: [
        "Appreciated asset gifting",
        "Donor-advised fund strategy",
        "Bunching deductions or QCD planning",
      ],
      deliverable:
        "A charitable giving strategy summary showing potential ways to coordinate generosity with tax planning.",
      samplePdf: "/sample-plans/charitable-giving-tax-plan-sample.pdf",
      sampleButtonText: "View Sample Charitable Giving Plan",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-base font-bold tracking-tight sm:text-lg">
            Unity Tax Planning
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#situations" className="hover:text-white">
              Situations
            </a>
            <a href="#review" className="hover:text-white">
              What We Review
            </a>
            <a href="#deliverable" className="hover:text-white">
              What You Receive
            </a>
            <a href="#examples" className="hover:text-white">
              Examples
            </a>
          </nav>

          <Link
            href="/tax-opportunity-scan"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 sm:px-5"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Find Blind Spots</span>
          </Link>
        </div>
      </section>

      <section className="bg-slate-950 px-4 pb-16 pt-14 text-white sm:px-6 md:pb-32 md:pt-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-300 sm:text-sm">
              The Tax Blind Spot Review
            </p>

            <h1 className="mb-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
              Your tax return shows what happened. It does not show what you missed.
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Unity Tax Planning helps business owners, high-income families,
              and retirees identify tax planning blind spots before year-end
              decisions, retirement transitions, investment gains, or business
              events create costly surprises.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/tax-opportunity-scan"
                className="w-full rounded-xl bg-blue-500 px-6 py-4 text-center font-semibold text-white hover:bg-blue-400 sm:w-auto"
              >
                Find My Tax Blind Spots
              </Link>

              <a
                href="#deliverable"
                className="w-full rounded-xl border border-slate-700 px-6 py-4 text-center font-semibold text-white hover:bg-slate-900 sm:w-auto"
              >
                See What You Receive
              </a>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-6 text-slate-500">
              This review is designed to identify planning areas worth
              discussing. It is not tax preparation, legal advice, accounting
              advice, or a guarantee of tax savings.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 sm:text-sm">
              Do Any of These Sound Familiar?
            </p>

            <div className="space-y-5">
              {[
                "I make good money, but I feel like taxes eat everything.",
                "My CPA is good, but I only hear about taxes after the year is over.",
                "I have a taxable investment account and do not know if it is tax-efficient.",
                "I may sell a business, property, or stock position.",
                "I am retiring soon and do not know which accounts to use first.",
              ].map((item) => (
                <div
                  key={item}
                  className="border-b border-slate-800 pb-5 last:border-b-0 last:pb-0"
                >
                  <p className="text-base font-semibold leading-7 text-white">
                    “{item}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="situations" className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                Choose Your Situation
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Tax planning should start with what is actually happening in your life.
              </h2>
            </div>

            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              Most tax planning websites list strategies. This review starts
              with your situation, then determines which planning topics may
              deserve attention.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {situations.map((situation) => (
              <article
                key={situation.title}
                className="rounded-3xl border border-slate-200 p-6 transition hover:border-blue-400 hover:shadow-lg sm:p-8"
              >
                <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
                  {situation.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {situation.description}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/example-plans/${situation.sampleSlug}`}
                    className="flex w-full justify-center rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500 sm:w-auto"
                  >
                    View Sample
                  </Link>

                  <Link
                    href="/tax-opportunity-scan"
                    className="flex w-full justify-center rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 sm:w-auto"
                  >
                    Find Tax Blind Spots
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="review" className="bg-slate-950 px-4 py-16 text-white sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 sm:text-sm">
                What We Review
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                A focused review of the areas most likely to affect your future tax picture.
              </h2>
            </div>

            <p className="text-base leading-8 text-slate-300 sm:text-lg">
              A tax return records history. Planning looks for decisions that
              may need to happen before the year ends, before a transaction
              closes, or before retirement income begins.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <h3 className="mb-5 text-xl font-semibold sm:text-2xl">
                Income & Retirement
              </h3>

              <div className="space-y-3 text-slate-300">
                <p>• Roth conversion opportunities</p>
                <p>• IRA withdrawal sequencing</p>
                <p>• RMD and QCD planning</p>
                <p>• Social Security tax impact</p>
                <p>• Medicare IRMAA awareness</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <h3 className="mb-5 text-xl font-semibold sm:text-2xl">
                Investments & Gains
              </h3>

              <div className="space-y-3 text-slate-300">
                <p>• Taxable investment accounts</p>
                <p>• Capital gains exposure</p>
                <p>• Tax-loss harvesting topics</p>
                <p>• Asset location</p>
                <p>• Concentrated positions</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <h3 className="mb-5 text-xl font-semibold sm:text-2xl">
                Business, Giving & Legacy
              </h3>

              <div className="space-y-3 text-slate-300">
                <p>• Business owner tax planning topics</p>
                <p>• Retirement plan coordination</p>
                <p>• Charitable giving strategy</p>
                <p>• Estate and trust coordination</p>
                <p>• Liquidity event planning</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:mt-10 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Your CPA prepares the return. Planning may require a different conversation.
              </h3>

              <p className="text-base leading-8 text-slate-300 sm:text-lg">
                Many CPAs do excellent work preparing accurate tax returns.
                Tax planning looks forward and connects income, investments,
                retirement accounts, charitable giving, estate planning, business
                ownership, and family goals before decisions are made.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="deliverable" className="bg-slate-100 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                What You Receive
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                A clear tax planning deliverable, not just a conversation.
              </h2>
            </div>

            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              The review is designed to turn your tax return, financial details,
              and planning questions into a clear set of observations,
              opportunities, and next steps.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                Step 01
              </p>

              <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
                Secure Document Review
              </h3>

              <p className="mb-6 leading-7 text-slate-600">
                After the initial intake, you may be asked to provide documents
                needed to understand the full tax picture.
              </p>

              <div className="space-y-3 text-slate-700">
                <p>• Prior-year tax return</p>
                <p>• Current-year income estimates</p>
                <p>• Brokerage and retirement account statements</p>
                <p>• Business income details, if applicable</p>
                <p>• Charitable giving or liquidity event details</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                Step 02
              </p>

              <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
                Tax Planning Analysis
              </h3>

              <p className="mb-6 leading-7 text-slate-600">
                Your information is reviewed for planning opportunities,
                coordination gaps, and areas that may deserve deeper analysis.
              </p>

              <div className="space-y-3 text-slate-700">
                <p>• Roth conversion opportunities</p>
                <p>• Capital gains and tax-loss harvesting topics</p>
                <p>• Charitable giving strategies</p>
                <p>• Retirement withdrawal sequencing</p>
                <p>• Business owner planning opportunities</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                Step 03
              </p>

              <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
                Written Tax Plan PDF
              </h3>

              <p className="mb-6 leading-7 text-slate-600">
                When a deeper plan is appropriate, you receive a written tax
                planning summary designed to make next steps clear.
              </p>

              <div className="space-y-3 text-slate-700">
                <p>• Tax Blind Spot Summary</p>
                <p>• Potential tax savings opportunities</p>
                <p>• Priority map of planning items</p>
                <p>• CPA coordination notes</p>
                <p>• Action list and review call</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white sm:mt-10 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 sm:text-sm">
                  Final Deliverable
                </p>

                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                  The goal is to move from “I think I may be missing something”
                  to a clear, organized plan of action.
                </h3>
              </div>

              <div className="space-y-4 text-slate-300">
                <p>
                  The final plan may include potential tax savings strategies,
                  estimated opportunity areas, planning risks, implementation
                  priorities, and coordination notes for your CPA, attorney, or
                  financial advisor.
                </p>

                <p>
                  Potential opportunities depend on your specific facts and
                  should be reviewed with qualified professionals before
                  implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="examples" className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                Hypothetical Planning Examples
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                What the process can look like from start to finish.
              </h2>
            </div>

            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              These examples are hypothetical and are designed to show how
              different tax blind spots may turn into a written planning
              summary, coordinated next steps, and a more complete wealth
              conversation.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {examples.map((example) => (
              <article
                key={example.title}
                className="rounded-3xl border border-slate-200 p-6 sm:p-8"
              >
                <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
                  {example.title}
                </h3>

                <p className="mb-6 leading-7 text-slate-600">
                  {example.profile}
                </p>

                <div className="mb-6 rounded-2xl bg-slate-100 p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                    Possible Blind Spots
                  </p>

                  <div className="space-y-2 text-sm leading-6 text-slate-700">
                    {example.blindSpots.map((item) => (
                      <p key={item}>• {item}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                    Potential Deliverable
                  </p>

                  <p className="text-sm leading-6 text-slate-600">
                    {example.deliverable}
                  </p>

                  <Link
                    href={`/example-plans/${example.slug}`}
                    className="mt-5 flex w-full justify-center rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500 sm:inline-flex sm:w-auto"
                  >
                    View Scenario Breakdown
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-sm leading-6 text-slate-500">
            These examples and sample plans are hypothetical and for
            illustrative purposes only. They do not represent actual client
            experiences and should not be interpreted as tax, legal, accounting,
            investment, or financial advice. Potential tax savings, projections,
            and planning opportunities depend on each household’s specific facts
            and should be reviewed with qualified professionals before
            implementation.
          </p>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-16 text-white sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Get a clearer picture of what your tax plan may be missing.
          </h2>

          <p className="mb-8 text-lg leading-8 text-blue-100 sm:text-xl">
            Start with a short intake. If there is a fit, the next step is a
            deeper review of your documents and a written tax planning summary.
          </p>

          <Link
            href="/tax-opportunity-scan"
            className="inline-block w-full rounded-xl bg-white px-6 py-4 font-semibold text-blue-600 hover:bg-blue-50 sm:w-auto"
          >
            Find My Tax Blind Spots
          </Link>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}