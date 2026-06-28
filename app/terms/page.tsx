import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DisclosureFooter from "@/components/DisclosureFooter";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Review the terms governing use of the Unity Tax Planning website, educational materials, sample plans, and online services.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionLinks = [
  {
    label: "Acceptance of Terms",
    href: "#acceptance",
  },
  {
    label: "About Unity Tax Planning",
    href: "#about",
  },
  {
    label: "Educational Information",
    href: "#educational-information",
  },
  {
    label: "No Professional Relationship",
    href: "#no-relationship",
  },
  {
    label: "Investment Services",
    href: "#investment-services",
  },
  {
    label: "Sample Plans",
    href: "#sample-plans",
  },
  {
    label: "User Responsibilities",
    href: "#user-responsibilities",
  },
  {
    label: "Intellectual Property",
    href: "#intellectual-property",
  },
  {
    label: "Third-Party Services",
    href: "#third-party-services",
  },
  {
    label: "Fees and Engagements",
    href: "#fees",
  },
  {
    label: "Disclaimers",
    href: "#disclaimers",
  },
  {
    label: "Limitation of Liability",
    href: "#limitation",
  },
  {
    label: "Privacy",
    href: "#privacy",
  },
  {
    label: "Governing Law",
    href: "#governing-law",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
            Website Terms
          </p>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Terms of Use
          </h1>

          <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-slate-300 sm:text-xl">
            These terms govern your access to and use of the Unity Tax Planning
            website, educational materials, sample plans, forms, and related
            online resources.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-300">
            Last updated: June 13, 2026
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-36 lg:self-start">
            <div className="rounded-[2rem] border-2 border-slate-200 bg-slate-50 p-6">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                Terms Sections
              </p>

              <nav aria-label="Terms of use sections" className="space-y-3">
                {sectionLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="space-y-8">
              <section
                id="acceptance"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  1. Acceptance of Terms
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Your agreement to these terms
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    By accessing or using this website, downloading materials,
                    submitting a form, or communicating through the website,
                    you agree to these Terms of Use and the Unity Tax Planning
                    Privacy Policy.
                  </p>

                  <p>
                    Do not use this website if you do not agree to these terms.
                    These terms apply only to use of the website and related
                    online resources. A separate written engagement agreement
                    will govern any paid or professional services.
                  </p>
                </div>
              </section>

              <section
                id="about"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  2. About Unity Tax Planning
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Separate business entity
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Unity Tax Planning is intended to operate as a separate
                    business entity owned by Wade Marcy. It provides
                    tax-planning education, analysis, strategy, and
                    coordination services under separate written engagements.
                  </p>

                  <p>
                    Wade Marcy is also associated with Unity Financial Planning
                    Group, a registered investment adviser. Unity Tax Planning
                    and Unity Financial Planning Group are separate businesses
                    that provide different services under separate agreements.
                  </p>

                  <p>
                    Clients are not required to engage Unity Financial Planning
                    Group to receive services from Unity Tax Planning. Clients
                    of Unity Financial Planning Group are not required to engage
                    Unity Tax Planning.
                  </p>
                </div>
              </section>

              <section
                id="educational-information"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  3. Educational Information
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  General information only
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Website content is provided for general educational,
                    informational, and planning purposes. It is not intended to
                    provide individualized tax, legal, accounting, investment,
                    insurance, or financial advice.
                  </p>

                  <p>
                    Information may not reflect your specific circumstances or
                    the most recent changes in tax laws, regulations,
                    administrative guidance, court decisions, or professional
                    interpretations.
                  </p>

                  <p>
                    You should consult appropriately qualified professionals
                    before relying on website content or implementing a tax,
                    legal, estate-planning, accounting, investment, or insurance
                    strategy.
                  </p>
                </div>
              </section>

              <section
                id="no-relationship"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  4. No Professional Relationship
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Website use does not create an engagement
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Accessing this website, reviewing content, downloading a
                    sample report, submitting an intake form, receiving an
                    automated response, or communicating by email does not
                    create a tax, legal, accounting, investment advisory,
                    fiduciary, or client relationship.
                  </p>

                  <p>
                    A professional relationship is established only after the
                    appropriate parties agree to and execute a separate written
                    engagement agreement.
                  </p>

                  <p>
                    Unity Tax Planning may decline an inquiry or proposed
                    engagement at its discretion, subject to applicable law.
                  </p>
                </div>
              </section>

              <section
                id="investment-services"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  5. Investment Advisory Services
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Investment services are separate
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Unity Tax Planning does not provide portfolio management,
                    securities recommendations, trade execution, investment
                    implementation, or other investment advisory services.
                  </p>

                  <p>
                    Investment advisory services, when applicable, are offered
                    separately through Unity Financial Planning Group under a
                    separate advisory agreement.
                  </p>

                  <p>
                    Nothing on this website constitutes an offer to buy or sell
                    a security or a recommendation regarding a particular
                    security, investment product, account, strategy, or
                    transaction.
                  </p>
                </div>
              </section>

              <section
                id="sample-plans"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  6. Sample Plans and Illustrations
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Hypothetical examples are not personal advice
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Sample plans, scenarios, case studies, calculations,
                    estimates, illustrations, and examples are hypothetical and
                    provided solely for educational purposes unless expressly
                    stated otherwise.
                  </p>

                  <p>
                    They do not represent a promise, projection, or guarantee of
                    tax savings, investment performance, financial results, or
                    any other outcome.
                  </p>

                  <p>
                    Actual results will vary based on individual facts,
                    assumptions, income, filing status, deductions, tax rules,
                    timing, implementation, professional advice, and future
                    events.
                  </p>
                </div>
              </section>

              <section
                id="user-responsibilities"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  7. User Responsibilities
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Permitted and prohibited use
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  You agree to use the website lawfully and responsibly. You
                  may not:
                </p>

                <ul className="mt-6 space-y-4">
                  {[
                    "Use the website for an unlawful, fraudulent, deceptive, or abusive purpose",
                    "Attempt to access administrative areas, databases, accounts, or systems without authorization",
                    "Probe, scan, test, or circumvent website security controls",
                    "Introduce malware, harmful code, automated attacks, or disruptive technology",
                    "Scrape, copy, harvest, or extract website data through automated means without written permission",
                    "Impersonate another person or submit false, misleading, or unauthorized information",
                    "Interfere with website availability, performance, or other users",
                    "Use website content to provide services to third parties without written permission",
                    "Remove copyright, trademark, attribution, or proprietary notices",
                    "Use Unity Tax Planning names, branding, reports, or materials in a misleading manner",
                  ].map((item) => (
                    <li key={item} className="flex gap-4">
                      <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                      <p className="font-medium leading-8 text-slate-600">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="intellectual-property"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  8. Intellectual Property
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Ownership of website materials
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    The website and its original content, branding, designs,
                    graphics, text, reports, sample plans, planning frameworks,
                    downloads, calculations, organization, and presentation are
                    owned by or licensed to Unity Tax Planning and are protected
                    by applicable intellectual-property laws.
                  </p>

                  <p>
                    You may view and download materials for your own personal,
                    noncommercial evaluation. You may not reproduce, publish,
                    distribute, sell, license, modify, create derivative works
                    from, or commercially exploit materials without prior
                    written permission.
                  </p>

                  <p>
                    Permission to download a sample plan does not transfer
                    ownership or grant permission to remove branding, reuse the
                    report as your own work, or provide it to others as
                    individualized advice.
                  </p>
                </div>
              </section>

              <section
                id="third-party-services"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  9. Third-Party Services and Links
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Independent websites and providers
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    The website may link to or rely on third-party hosting,
                    database, authentication, scheduling, analytics, payment,
                    communication, document, artificial-intelligence, or other
                    technology providers.
                  </p>

                  <p>
                    Unity Tax Planning does not control and is not responsible
                    for the availability, content, privacy, security, accuracy,
                    products, services, or practices of independent third
                    parties.
                  </p>

                  <p>
                    Your use of a third-party website or service may be governed
                    by separate terms and privacy policies.
                  </p>
                </div>
              </section>

              <section
                id="fees"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  10. Fees and Paid Engagements
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Separate written agreements control
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Website pricing is general information and may represent
                    starting prices, estimated ranges, or examples. Final fees
                    may depend on complexity, scope, timing, required analysis,
                    coordination, and the terms of the applicable engagement.
                  </p>

                  <p>
                    Fees, payment schedules, deliverables, responsibilities,
                    cancellation terms, refund terms, and engagement limitations
                    will be governed by the applicable written agreement.
                  </p>

                  <p>
                    Website pricing may be changed or withdrawn at any time
                    before an engagement is accepted.
                  </p>
                </div>
              </section>

              <section
                id="artificial-intelligence"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  11. AI-Assisted Tools
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Technology does not replace professional review
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Artificial intelligence and other technology-assisted tools
                    may be used to organize information, summarize materials,
                    identify possible planning topics, produce preliminary
                    calculations, or support internal analysis.
                  </p>

                  <p>
                    Technology-assisted output may be incomplete, inaccurate,
                    outdated, or inappropriate for a particular situation. It
                    must not be treated as final professional advice without
                    appropriate review.
                  </p>

                  <p>
                    You should not submit highly sensitive information through
                    general website forms, ordinary email, or an unapproved
                    technology system.
                  </p>
                </div>
              </section>

              <section
                id="disclaimers"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  12. Website Disclaimers
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Website provided as available
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    To the fullest extent permitted by applicable law, the
                    website and its content are provided on an “as is” and “as
                    available” basis without warranties of any kind, whether
                    express, implied, statutory, or otherwise.
                  </p>

                  <p>
                    Unity Tax Planning does not warrant that the website will be
                    uninterrupted, error-free, secure, complete, accurate,
                    current, compatible with every device, or free from harmful
                    components.
                  </p>

                  <p>
                    Unity Tax Planning does not guarantee that any strategy,
                    example, calculation, report, or planning topic will produce
                    a particular tax, legal, investment, financial, or business
                    outcome.
                  </p>
                </div>
              </section>

              <section
                id="limitation"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  13. Limitation of Liability
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Limits relating to website use
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    To the fullest extent permitted by applicable law, Unity Tax
                    Planning and its owners, personnel, contractors, affiliates,
                    and service providers will not be liable for indirect,
                    incidental, special, consequential, exemplary, or punitive
                    damages arising from or related to website use.
                  </p>

                  <p>
                    This includes damages relating to loss of data, loss of
                    revenue, lost opportunities, business interruption,
                    unauthorized access, reliance on website information, or
                    inability to access the website.
                  </p>

                  <p>
                    Nothing in these terms excludes or limits liability that
                    cannot lawfully be excluded or limited. A separate written
                    engagement agreement may contain different provisions
                    governing professional services.
                  </p>
                </div>
              </section>

              <section
                id="indemnification"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  14. Indemnification
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Responsibility for misuse
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  To the extent permitted by applicable law, you agree to
                  defend, indemnify, and hold harmless Unity Tax Planning and its
                  owners, personnel, contractors, affiliates, and service
                  providers from claims, losses, liabilities, damages, costs,
                  and expenses arising from your unlawful use of the website,
                  violation of these terms, infringement of another person’s
                  rights, or submission of information you were not authorized
                  to provide.
                </p>
              </section>

              <section
                id="privacy"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  15. Privacy and Sensitive Information
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Information submitted through the website
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    The collection and use of information submitted through the
                    website are described in the Unity Tax Planning Privacy
                    Policy.
                  </p>

                  <p>
                    Do not submit Social Security numbers, passwords, full
                    account numbers, complete tax returns, medical records,
                    copies of identification documents, or other highly
                    sensitive information through general forms or ordinary
                    email.
                  </p>

                  <Link
                    href="/privacy"
                    className="inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-500"
                  >
                    Read the Privacy Policy
                  </Link>
                </div>
              </section>

              <section
                id="termination"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  16. Suspension or Termination
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Access may be restricted
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  Unity Tax Planning may suspend, restrict, or terminate access
                  to the website or particular features when reasonably
                  necessary to protect security, prevent misuse, comply with
                  legal obligations, maintain website operations, or enforce
                  these terms.
                </p>
              </section>

              <section
                id="changes"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  17. Changes to These Terms
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Future updates
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    These Terms of Use may be updated to reflect changes in the
                    website, business, services, technology, or applicable
                    obligations.
                  </p>

                  <p>
                    The updated terms will be posted on this page with a revised
                    effective date. Continued website use after an update
                    constitutes acceptance of the revised terms to the extent
                    permitted by applicable law.
                  </p>
                </div>
              </section>

              <section
                id="governing-law"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  18. Governing Law
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Applicable law and venue
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    These Terms of Use are governed by the laws of the State of
                    Georgia, without regard to conflict-of-law principles,
                    except where another law is required to apply.
                  </p>

                  <p>
                    Subject to any different requirement imposed by applicable
                    law or a separate written agreement, disputes relating
                    solely to website use will be brought in a court of
                    competent jurisdiction located in Georgia.
                  </p>
                </div>
              </section>

              <section
                id="severability"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  19. General Provisions
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Entire terms and severability
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    These terms and the Privacy Policy constitute the agreement
                    governing general website use. They do not replace a
                    separate engagement agreement governing paid or
                    professional services.
                  </p>

                  <p>
                    If any provision is determined to be unlawful,
                    unenforceable, or invalid, the remaining provisions will
                    continue in effect to the fullest extent permitted by law.
                  </p>

                  <p>
                    Failure to enforce a provision does not waive the right to
                    enforce it later. Headings are provided for convenience and
                    do not limit the meaning of these terms.
                  </p>
                </div>
              </section>

              <section
                id="contact"
                className="scroll-mt-40 rounded-[2rem] border-2 border-blue-200 bg-blue-50 p-6 shadow-xl shadow-blue-100/50 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                  20. Contact Information
                </p>

                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  Questions about these terms
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-700">
                  Questions concerning these Terms of Use may be sent to:
                </p>

                <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-white p-5">
                  <p className="text-lg font-black text-slate-950">
                    Unity Tax Planning
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Attention: Website Terms
                  </p>

                  <a
                    href="mailto:wadermarcy@gmail.com?subject=Unity%20Tax%20Planning%20Terms%20Question"
                    className="mt-3 inline-block break-all font-black text-blue-600 transition hover:text-blue-500 hover:underline"
                  >
                    wadermarcy@gmail.com
                  </a>
                </div>
              </section>

              <section className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">
                  Important
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  Website content is not individualized professional advice.
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-300">
                  Tax, legal, accounting, investment, and financial decisions
                  should be reviewed with the appropriate qualified
                  professionals before implementation.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/tax-opportunity-scan"
                    className="inline-flex justify-center rounded-full bg-blue-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-blue-400"
                  >
                    Start My Assessment
                  </Link>

                  <Link
                    href="/privacy"
                    className="inline-flex justify-center rounded-full border-2 border-slate-700 px-6 py-4 text-sm font-black text-white transition hover:border-blue-400"
                  >
                    Read the Privacy Policy
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}