import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Start with the Tax Blind Spot Review",
      description:
        "You begin by answering a short set of questions about your income, investments, business ownership, retirement accounts, charitable giving, and any upcoming planning decisions.",
    },
    {
      number: "02",
      title: "We identify the areas worth reviewing",
      description:
        "Based on your answers, we determine whether your situation may involve missed tax planning opportunities, coordination gaps, or planning items that should be reviewed before year-end.",
    },
    {
      number: "03",
      title: "You provide the right documents",
      description:
        "If there is a fit, we request the documents needed to understand your tax picture. This may include prior-year tax returns, investment statements, business income details, paystubs, or transaction details.",
    },
    {
      number: "04",
      title: "We prepare a written planning summary",
      description:
        "You receive a written summary outlining potential planning opportunities, important considerations, priority items, and areas that may need CPA, attorney, or advisor coordination.",
    },
    {
      number: "05",
      title: "We walk through the findings",
      description:
        "We review the findings together, explain the planning opportunities in plain English, and help you understand which items may be worth pursuing.",
    },
    {
      number: "06",
      title: "We coordinate next steps",
      description:
        "When appropriate, we help coordinate implementation with your CPA, attorney, investment advisor, or other professionals so the planning does not sit unused.",
    },
  ];

  const documents = [
    "Prior-year tax return",
    "Current-year income estimate",
    "Recent paystub or business income summary",
    "Investment account statements",
    "Retirement account balances",
    "Charitable giving history",
    "Business ownership details",
    "Upcoming sale or liquidity event information",
    "Estate planning documents, if relevant",
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

          <nav className="hidden items-center gap-10 text-base font-semibold text-slate-300 md:flex">
            <Link href="/#situations" className="hover:text-white">
              Situations
            </Link>
            <Link href="/how-it-works" className="text-white">
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
            href="/tax-opportunity-scan"
            className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-blue-50 sm:px-8 sm:text-base"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Start Review</span>
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
            className="shrink-0 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-bold text-white"
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

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-blue-300 sm:text-base">
              How It Works
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              A simple process for finding tax planning opportunities.
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              The goal is to help you understand where proactive planning may
              be needed, what documents matter, and what next steps should be
              coordinated before decisions are made.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              The Process
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              From intake to written planning summary.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                  Step {step.number}
                </p>

                <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                  {step.title}
                </h3>

                <p className="text-lg font-medium leading-8 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
                What You May Need
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                The better the information, the better the planning.
              </h2>

              <p className="mt-6 text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
                Not every situation requires every document. The list simply
                shows what may be helpful depending on your planning needs.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((document) => (
                <div
                  key={document}
                  className="rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 text-lg font-bold text-slate-200 shadow-xl shadow-black/20"
                >
                  {document}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              What This Is Not
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Planning does not replace tax prep, legal advice, or accounting
              advice.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-5 text-2xl font-black">Not Tax Prep</h3>
              <p className="text-lg font-medium leading-8 text-slate-600">
                We do not simply prepare and file a prior-year return. The focus
                is proactive planning and coordination.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-5 text-2xl font-black">Not Legal Advice</h3>
              <p className="text-lg font-medium leading-8 text-slate-600">
                Estate, entity, and legal documents should be drafted and
                reviewed by a qualified attorney.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <h3 className="mb-5 text-2xl font-black">Not a Guarantee</h3>
              <p className="text-lg font-medium leading-8 text-slate-600">
                Tax planning can identify opportunities and tradeoffs, but no
                tax savings or specific result is guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Ready to begin the process?
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-blue-100 sm:text-2xl">
            Start with a short intake. If there is a fit, the next step is a
            deeper review of your documents and a written tax planning summary.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/tax-opportunity-scan"
              className="inline-block w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-blue-600 shadow-xl hover:bg-blue-50 sm:w-auto"
            >
              Start My Tax Blind Spot Review
            </Link>

            <Link
              href="/pricing"
              className="inline-block w-full rounded-2xl border-2 border-blue-300 px-8 py-5 text-lg font-black text-white hover:bg-blue-500 sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}