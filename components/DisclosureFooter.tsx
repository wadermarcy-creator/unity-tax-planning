import Link from "next/link";

export default function DisclosureFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-14 text-slate-400 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 border-b border-slate-800 pb-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-950/40">
                <span className="text-xl font-black text-white">U</span>
              </div>

              <div className="leading-tight">
                <p className="text-xl font-black tracking-tight text-white">
                  UNITY
                </p>

                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-300">
                  Tax Planning
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-400">
              Proactive tax planning for business owners, high-income families,
              retirees, investors, and individuals approaching important
              financial decisions.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex max-w-xl flex-wrap gap-x-6 gap-y-3 text-sm font-bold"
          >
            <Link href="/how-it-works" className="transition hover:text-white">
              How It Works
            </Link>

            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>

            <Link href="/example-plans" className="transition hover:text-white">
              Sample Plans
            </Link>

            <Link href="/faq" className="transition hover:text-white">
              FAQ
            </Link>

            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>

            <Link
              href="/tax-opportunity-scan"
              className="text-blue-300 transition hover:text-blue-200"
            >
              Start a Review
            </Link>
          </nav>
        </div>

        <div className="space-y-6 text-sm font-medium leading-7">
          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Separate Business Entity
            </h2>

            <p>
              Unity Tax Planning is a separate business entity owned by Wade
              Marcy. Unity Tax Planning provides tax-planning education,
              analysis, strategy, and coordination services under a separate
              written engagement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Relationship With Unity Financial Planning Group
            </h2>

            <p>
              Wade Marcy is also associated with Unity Financial Planning Group,
              a registered investment adviser. Unity Tax Planning and Unity
              Financial Planning Group are separate businesses that provide
              different services under separate agreements.
            </p>

            <p className="mt-3">
              Unity Tax Planning does not provide investment advisory services,
              portfolio management, securities recommendations, or investment
              implementation. Investment advisory services, when applicable, are
              offered separately through Unity Financial Planning Group.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Ownership and Potential Conflict of Interest
            </h2>

            <p>
              Because Wade Marcy has an ownership or financial interest in both
              Unity Tax Planning and Unity Financial Planning Group, he has a
              financial incentive to recommend services provided by either
              business. This creates a potential conflict of interest.
            </p>

            <p className="mt-3">
              Clients should consider this conflict when deciding whether to
              engage either business. Clients are not required to engage Unity
              Financial Planning Group to receive services from Unity Tax
              Planning. Clients of Unity Financial Planning Group are not
              required to engage Unity Tax Planning.
            </p>

            <p className="mt-3">
              Clients remain free to work with any investment adviser, CPA, tax
              professional, accountant, attorney, insurance professional, or
              other service provider of their choosing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Tax, Legal, and Accounting Information
            </h2>

            <p>
              Information presented through Unity Tax Planning is provided for
              general educational, analytical, and planning purposes. Unless
              expressly included in a separate written engagement, Unity Tax
              Planning does not provide tax-return preparation, legal advice,
              legal document preparation, accounting services, audit services, or
              legal opinions.
            </p>

            <p className="mt-3">
              Tax laws, regulations, interpretations, and individual
              circumstances may change. Clients should consult with a qualified
              CPA, enrolled agent, tax professional, accountant, or attorney
              before implementing a tax, legal, estate-planning, or accounting
              strategy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Investment and Securities Information
            </h2>

            <p>
              Nothing on this website should be interpreted as an offer to buy
              or sell a security, an individualized securities recommendation,
              portfolio-management advice, or a recommendation regarding a
              specific investment product.
            </p>

            <p className="mt-3">
              Any investment advisory recommendation or implementation must be
              provided through an appropriately registered investment adviser
              under a separate advisory agreement. Investing involves risk,
              including the possible loss of principal.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              No Guarantee of Results
            </h2>

            <p>
              Tax-planning opportunities depend on each client&apos;s individual
              circumstances, applicable law, timing, implementation, and the
              involvement of other professional advisers. Unity Tax Planning does
              not guarantee tax savings, investment performance, financial
              results, or any particular planning outcome.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Hypothetical Examples and Sample Plans
            </h2>

            <p>
              Sample plans, scenarios, calculations, illustrations, case studies,
              and planning examples are hypothetical and are provided solely for
              educational purposes. They do not represent actual client
              experiences unless expressly stated otherwise.
            </p>

            <p className="mt-3">
              Actual results will vary based on individual facts, assumptions,
              tax laws, filing status, income, deductions, timing,
              implementation, and advice received from other professionals.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              AI-Assisted Analysis
            </h2>

            <p>
              Artificial intelligence and other technology-assisted tools may be
              used to organize information, summarize documents, identify
              possible planning topics, produce preliminary calculations, or
              support internal analysis.
            </p>

            <p className="mt-3">
              These tools do not replace professional judgment. AI-generated or
              technology-assisted output may be incomplete or contain errors and
              should be reviewed by an appropriately qualified professional
              before being relied upon or implemented.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              No Professional Relationship Created
            </h2>

            <p>
              Accessing this website, reviewing educational content, downloading
              a sample plan, submitting an intake form, or communicating through
              the website does not create a tax, legal, accounting, investment
              advisory, fiduciary, or client relationship.
            </p>

            <p className="mt-3">
              A professional relationship is established only after the
              appropriate parties have accepted and executed a separate written
              engagement agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Confidential and Sensitive Information
            </h2>

            <p>
              Do not submit Social Security numbers, complete account numbers,
              passwords, complete tax returns, medical information, or other
              highly sensitive personal information through general website forms
              or ordinary email. Secure document-submission instructions will be
              provided when appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-black text-slate-200">
              Coordination With Other Professionals
            </h2>

            <p>
              Unity Tax Planning may coordinate with a client&apos;s CPA,
              accountant, attorney, investment adviser, insurance professional,
              or other adviser when authorized by the client. Each professional
              remains independently responsible for the services and advice they
              provide.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-slate-800 pt-8 text-xs font-medium leading-6 text-slate-500 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p>© {currentYear} Unity Tax Planning. All rights reserved.</p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/privacy"
                className="font-bold transition hover:text-slate-300"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="font-bold transition hover:text-slate-300"
              >
                Terms of Use
              </Link>
            </div>
          </div>

          <p className="max-w-2xl lg:text-right">
            Information is subject to change without notice. This disclosure
            should be read together with the applicable engagement agreement and
            any required regulatory disclosures.
          </p>
        </div>
      </div>
    </footer>
  );
}