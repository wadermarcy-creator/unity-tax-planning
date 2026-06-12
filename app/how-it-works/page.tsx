import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export default function HowItWorksPage() {
  const steps: ProcessStep[] = [
    {
      number: "01",
      title: "Start with the Tax Blind Spot Review",
      description:
        "Answer a short set of questions about your income, investments, business ownership, retirement accounts, charitable giving, and upcoming financial decisions.",
    },
    {
      number: "02",
      title: "We review your situation",
      description:
        "Your intake is reviewed to identify potential tax planning opportunities, coordination gaps, and areas that may deserve a deeper analysis.",
    },
    {
      number: "03",
      title: "We define the scope",
      description:
        "If the situation appears to be a fit, we discuss the documents needed, the type of engagement, expected timing, responsibilities, and pricing before work begins.",
    },
    {
      number: "04",
      title: "You provide the relevant documents",
      description:
        "Documents may include prior-year tax returns, current income estimates, investment statements, retirement balances, business information, or details about an upcoming transaction.",
    },
    {
      number: "05",
      title: "We prepare the planning analysis",
      description:
        "The review may examine income timing, investments, retirement accounts, charitable giving, business planning, large capital gains, and other relevant opportunities.",
    },
    {
      number: "06",
      title: "You receive a written planning summary",
      description:
        "Your written plan may include potential opportunities, important considerations, priority items, implementation notes, and questions for your CPA, attorney, or other professionals.",
    },
    {
      number: "07",
      title: "We walk through the findings",
      description:
        "We review the plan together, explain the findings in plain English, discuss tradeoffs, and identify the items that may be worth pursuing.",
    },
    {
      number: "08",
      title: "We coordinate the next steps",
      description:
        "When appropriate, implementation may be coordinated with your CPA, attorney, financial advisor, or other professionals so important planning items do not remain unfinished.",
    },
  ];

  const documents = [
    "Prior-year tax returns",
    "Current-year income estimate",
    "Recent paystubs",
    "Business income information",
    "Investment account statements",
    "Retirement account balances",
    "Charitable giving records",
    "Stock compensation details",
    "Upcoming sale information",
    "Estate planning documents",
  ];

  const deliverables = [
    {
      title: "Tax Blind Spot Summary",
      description:
        "A clear overview of the planning issues, opportunities, and coordination gaps identified during the review.",
    },
    {
      title: "Priority Map",
      description:
        "An organized list showing which items may deserve immediate attention, further analysis, or future monitoring.",
    },
    {
      title: "Implementation Notes",
      description:
        "Action-oriented guidance describing the professionals, documents, calculations, or decisions that may be needed next.",
    },
    {
      title: "CPA Coordination Questions",
      description:
        "A focused set of questions or planning items that may need confirmation from your CPA or tax preparer.",
    },
    {
      title: "Review Meeting",
      description:
        "A meeting to explain the findings, discuss tradeoffs, and help you understand the potential next steps.",
    },
    {
      title: "Ongoing Coordination",
      description:
        "Depending on the engagement, follow-up support may help organize implementation and monitor unresolved planning items.",
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
              How It Works
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              A clear process for finding tax planning opportunities.
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              The goal is to help you understand what deserves attention, what
              information is needed, and how the findings may be coordinated
              before important financial decisions are finalized.
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
              From the first intake to coordinated next steps.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-600 sm:text-2xl">
              The exact process may vary based on complexity, but every
              engagement begins with understanding your situation before
              recommending a scope of work.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                    {step.number}
                  </div>

                  <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                    Process Step
                  </p>
                </div>

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
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
                What You May Need
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                Better information creates better planning.
              </h2>

              <p className="mt-6 text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
                Not every engagement requires every document. The specific
                request will depend on your goals, financial situation, and the
                planning questions being evaluated.
              </p>

              <div className="mt-8 rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-7 shadow-xl shadow-blue-950/30">
                <p className="text-xl font-black text-white">
                  Sensitive documents are requested separately.
                </p>

                <p className="mt-3 font-medium leading-7 text-slate-300">
                  Do not enter Social Security numbers, account numbers,
                  passwords, or complete tax returns into the initial intake
                  form. If documents are needed, you will receive instructions
                  for submitting them securely.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((document) => (
                <div
                  key={document}
                  className="rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 text-lg font-black text-slate-200 shadow-xl shadow-black/20"
                >
                  <span className="mr-3 text-blue-300">✓</span>
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
              What You May Receive
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              A planning deliverable built around decisions and next steps.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-600 sm:text-2xl">
              Deliverables vary by engagement, but the goal is to provide
              something organized, understandable, and usable.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((deliverable) => (
              <article
                key={deliverable.title}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:border-blue-500 hover:shadow-xl sm:p-9"
              >
                <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                  {deliverable.title}
                </h3>

                <p className="text-lg font-medium leading-8 text-slate-600">
                  {deliverable.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              Professional Coordination
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Planning works best when the right professionals communicate.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-600 sm:text-2xl">
              Unity Tax Planning does not replace the CPA, attorney, or other
              professional responsible for tax filing positions, legal
              documents, or specialized advice.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                Your CPA
              </p>

              <h3 className="mb-5 text-2xl font-black">
                Tax filing and technical confirmation
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                Your CPA or tax preparer may need to confirm filing positions,
                calculations, elections, deadlines, and implementation details.
              </p>
            </article>

            <article className="rounded-[2rem] border-2 border-blue-500 bg-slate-950 p-8 text-white shadow-xl shadow-blue-950/20 sm:p-9">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Unity Tax Planning
              </p>

              <h3 className="mb-5 text-2xl font-black">
                Planning analysis and coordination
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                The focus is identifying planning opportunities, organizing the
                financial context, and helping coordinate the next steps.
              </p>
            </article>

            <article className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                Your Attorney
              </p>

              <h3 className="mb-5 text-2xl font-black">
                Legal documents and legal advice
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                Estate planning documents, entity documents, contracts, and
                other legal matters should be handled by a qualified attorney.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              What This Is Not
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Clear boundaries help create better expectations.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-xl sm:p-9">
              <h3 className="mb-5 text-2xl font-black">Not Tax Preparation</h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                The service is not limited to preparing and filing a prior-year
                return. The primary focus is proactive planning before decisions
                are finalized.
              </p>
            </article>

            <article className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-xl shadow-blue-950/30 sm:p-9">
              <h3 className="mb-5 text-2xl font-black">Not Legal Advice</h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                Estate planning, entity formation, contracts, and legal
                documents should be prepared or reviewed by a qualified
                attorney.
              </p>
            </article>

            <article className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-xl sm:p-9">
              <h3 className="mb-5 text-2xl font-black">Not a Guarantee</h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                Planning may identify opportunities, risks, and tradeoffs, but
                no tax savings, investment result, or specific outcome is
                guaranteed.
              </p>
            </article>
          </div>

          <div className="mt-10">
            <Link
              href="/faq"
              className="inline-block w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
            >
              Read Frequently Asked Questions
            </Link>
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
            conversation about scope, documents, timing, and pricing.
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