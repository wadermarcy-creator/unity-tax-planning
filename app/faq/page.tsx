import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type FAQ = {
  question: string;
  answer: string;
};

type FAQSection = {
  title: string;
  description: string;
  questions: FAQ[];
};

export default function FAQPage() {
  const faqSections: FAQSection[] = [
    {
      title: "Understanding the Service",
      description:
        "What Unity Tax Planning does, who it is designed for, and how it differs from traditional tax preparation.",
      questions: [
        {
          question: "Is this tax preparation?",
          answer:
            "No. Tax preparation is primarily focused on accurately reporting transactions and filing a tax return after the year has ended. Unity Tax Planning focuses on identifying proactive planning opportunities before important decisions are finalized.",
        },
        {
          question: "Do you replace my CPA or tax preparer?",
          answer:
            "No. The goal is to work alongside your existing CPA or tax preparer. A planning engagement may produce recommendations, calculations, questions, and coordination notes that can be reviewed with the professional responsible for preparing your return.",
        },
        {
          question: "Who is this service best for?",
          answer:
            "The service is generally best suited for business owners, high-income families, pre-retirees, retirees, investors with taxable accounts, charitable families, and people preparing for a major sale or capital gain.",
        },
        {
          question: "Can I use this service if I already have a financial advisor?",
          answer:
            "Yes. You do not need to change advisors to request a tax planning review. When appropriate, planning findings may be coordinated with your existing financial advisor, CPA, attorney, or other professionals.",
        },
      ],
    },
    {
      title: "The Planning Process",
      description:
        "What happens after you submit the intake and what a planning engagement may include.",
      questions: [
        {
          question: "What happens after I submit the Tax Blind Spot Review?",
          answer:
            "Your intake is reviewed to determine whether there appear to be meaningful planning opportunities and whether the situation is a fit. If appropriate, the next step is a conversation about your goals, the required documents, the scope of work, timing, and pricing.",
        },
        {
          question: "What documents might be needed?",
          answer:
            "Depending on your situation, documents may include prior-year tax returns, current income estimates, paystubs, business financial information, investment statements, retirement account balances, charitable giving records, or details about an upcoming sale.",
        },
        {
          question: "How long does the process take?",
          answer:
            "Timing depends on complexity, document availability, and the type of engagement. A focused review may move more quickly, while comprehensive planning involving businesses, multiple entities, large transactions, or outside professionals may require additional time.",
        },
        {
          question: "Will I receive a written report?",
          answer:
            "A paid planning engagement may include a written summary of potential opportunities, planning priorities, important considerations, implementation steps, and items to discuss with your CPA, attorney, or other professionals.",
        },
        {
          question: "Will you help implement the recommendations?",
          answer:
            "Implementation support depends on the engagement. This may include helping organize next steps, coordinating with your existing professionals, supporting investment-related implementation when appropriate, and helping track unresolved planning items.",
        },
      ],
    },
    {
      title: "Pricing and Engagements",
      description:
        "How pricing works and what determines the appropriate level of planning.",
      questions: [
        {
          question: "How much does tax planning cost?",
          answer:
            "The Tax Blind Spot Review starts at $995. Comprehensive Tax Planning starts at $3,500. Advanced planning and family office-style coordination are custom engagements based on complexity and scope.",
        },
        {
          question: "Why are prices listed as starting prices?",
          answer:
            "Planning needs vary significantly. Pricing may depend on the number of tax returns, entities, investment accounts, planning topics, upcoming transactions, family members involved, and the amount of coordination required with outside professionals.",
        },
        {
          question: "Will I know the price before work begins?",
          answer:
            "Yes. The proposed scope and pricing will be discussed before a paid engagement begins. Submitting the intake form does not obligate you to purchase a service.",
        },
        {
          question: "Which engagement should I choose?",
          answer:
            "You do not need to determine that alone. The intake helps identify the likely level of planning needed. If your situation requires a different engagement than the one you initially selected, that will be discussed before work begins.",
        },
      ],
    },
    {
      title: "Results and Professional Coordination",
      description:
        "What tax planning can identify and the limits that apply to any planning analysis.",
      questions: [
        {
          question: "Is tax savings guaranteed?",
          answer:
            "No. Tax planning may identify opportunities, risks, tradeoffs, and timing strategies, but no specific savings or tax result can be guaranteed. Actual outcomes depend on your full circumstances, implementation, tax law, and the positions taken on your tax return.",
        },
        {
          question: "Do you provide legal or accounting advice?",
          answer:
            "Unity Tax Planning does not replace legal counsel or the tax professional responsible for preparing and signing your return. Legal documents should be prepared or reviewed by a qualified attorney, and tax filing positions should be confirmed with the appropriate tax professional.",
        },
        {
          question: "Can you communicate directly with my CPA or attorney?",
          answer:
            "When appropriate and with your permission, planning findings and implementation questions may be coordinated with your CPA, attorney, financial advisor, or other professionals.",
        },
        {
          question: "What if my CPA disagrees with a recommendation?",
          answer:
            "Tax planning can involve assumptions, tradeoffs, professional judgment, and incomplete information. Differences should be discussed openly so the relevant professionals can evaluate the facts, applicable tax rules, and implementation requirements.",
        },
      ],
    },
    {
      title: "Privacy and Security",
      description:
        "How to use the intake form and how sensitive documents should be handled.",
      questions: [
        {
          question: "Is my information secure?",
          answer:
            "The initial intake is designed to collect general planning information. You should not enter Social Security numbers, account numbers, passwords, complete tax returns, or other highly sensitive information in the intake form.",
        },
        {
          question: "How will sensitive documents be collected?",
          answer:
            "If a deeper review is appropriate, relevant documents should be requested and delivered through an approved secure process rather than pasted into the initial intake form.",
        },
        {
          question: "Does submitting the form make me a client?",
          answer:
            "No. Submitting an intake does not create an advisory, tax, legal, accounting, or other professional relationship. A client relationship begins only after the appropriate agreement has been reviewed and completed.",
        },
      ],
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

            <Link href="/how-it-works" className="hover:text-white">
              How It Works
            </Link>

            <Link href="/#samples" className="hover:text-white">
              Samples
            </Link>

            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>

            <Link href="/faq" className="text-white">
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
              Frequently Asked Questions
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              Understand the process before you begin.
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Learn how tax planning differs from tax preparation, what an
              engagement may include, how pricing works, and what happens after
              you submit the intake.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="lg:sticky lg:top-36 lg:self-start">
              <div className="rounded-[2rem] border-2 border-slate-300 bg-slate-100 p-7 shadow-lg">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                  Quick Navigation
                </p>

                <div className="space-y-3">
                  {faqSections.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#faq-section-${index + 1}`}
                      className="block rounded-xl border border-slate-300 bg-white px-4 py-3 font-black text-slate-800 transition hover:border-blue-500 hover:text-blue-600"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] border-2 border-blue-500 bg-slate-950 p-7 text-white shadow-xl shadow-blue-950/20">
                <p className="text-xl font-black">
                  Still not sure where to start?
                </p>

                <p className="mt-3 font-medium leading-7 text-slate-300">
                  Complete the short intake and describe your primary concern.
                  Your answers will help determine whether a deeper review makes
                  sense.
                </p>

                <Link
                  href="/tax-opportunity-scan"
                  className="mt-6 block rounded-2xl bg-blue-500 px-5 py-4 text-center font-black text-white hover:bg-blue-400"
                >
                  Start My Review
                </Link>
              </div>
            </aside>

            <div className="space-y-14">
              {faqSections.map((section, sectionIndex) => (
                <section
                  key={section.title}
                  id={`faq-section-${sectionIndex + 1}`}
                  className="scroll-mt-40"
                >
                  <div className="mb-7">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                      Section {String(sectionIndex + 1).padStart(2, "0")}
                    </p>

                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                      {section.title}
                    </h2>

                    <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
                      {section.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((faq) => (
                      <details
                        key={faq.question}
                        className="group rounded-[2rem] border-2 border-slate-300 bg-white p-6 shadow-md transition open:border-blue-500 open:shadow-xl sm:p-8"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                          <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                            {faq.question}
                          </h3>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white transition group-open:rotate-45 group-open:bg-blue-600">
                            +
                          </span>
                        </summary>

                        <p className="mt-6 border-t border-slate-200 pt-6 text-lg font-medium leading-8 text-slate-600">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-xl">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Review the Process
              </p>

              <h2 className="text-2xl font-black">See how planning works</h2>

              <p className="mt-4 font-medium leading-7 text-slate-300">
                Learn what happens between the initial intake, document review,
                written plan, and implementation.
              </p>

              <Link
                href="/how-it-works"
                className="mt-6 inline-block font-black text-blue-300 hover:text-white"
              >
                How It Works →
              </Link>
            </div>

            <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-xl shadow-blue-950/30">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Review Pricing
              </p>

              <h2 className="text-2xl font-black">Compare engagement levels</h2>

              <p className="mt-4 font-medium leading-7 text-slate-300">
                Review the starting prices and the type of planning included in
                each engagement.
              </p>

              <Link
                href="/pricing"
                className="mt-6 inline-block font-black text-blue-300 hover:text-white"
              >
                View Pricing →
              </Link>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-xl">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                View Examples
              </p>

              <h2 className="text-2xl font-black">Explore sample plans</h2>

              <p className="mt-4 font-medium leading-7 text-slate-300">
                See hypothetical planning scenarios for business owners,
                retirees, investors, and charitable families.
              </p>

              <Link
                href="/#samples"
                className="mt-6 inline-block font-black text-blue-300 hover:text-white"
              >
                View Samples →
              </Link>
            </div>
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
            deeper review of your documents and a written planning summary.
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