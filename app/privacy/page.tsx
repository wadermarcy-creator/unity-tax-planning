import type { Metadata } from "next";
import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Unity Tax Planning collects, uses, protects, and shares information submitted through its website and services.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const navigationItems = [
  {
    label: "Situations",
    href: "/#situations",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
  {
    label: "Samples",
    href: "/#samples",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white shadow-xl shadow-slate-950/10 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-950/40">
              <span className="text-xl font-black">U</span>
            </div>

            <div className="leading-tight">
              <p className="text-xl font-black tracking-tight">UNITY</p>

              <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-blue-300">
                Tax Planning
              </p>
            </div>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-bold text-slate-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/tax-opportunity-scan"
              className="rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-blue-400"
            >
              Start a Review
            </Link>
          </nav>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="overflow-x-auto border-t border-slate-800 px-4 py-3 lg:hidden"
        >
          <div className="mx-auto flex w-max min-w-full items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-black text-slate-200 transition hover:border-blue-400 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/tax-opportunity-scan"
              className="whitespace-nowrap rounded-full bg-blue-500 px-4 py-2 text-xs font-black text-white"
            >
              Start a Review
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
            Legal and Privacy
          </p>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Privacy Policy
          </h1>

          <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-slate-300 sm:text-xl">
            This policy explains how Unity Tax Planning collects, uses,
            protects, and shares information obtained through this website and
            related planning services.
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
                Policy Sections
              </p>

              <nav aria-label="Privacy policy sections" className="space-y-3">
                <a
                  href="#overview"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Overview
                </a>

                <a
                  href="#information-collected"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Information Collected
                </a>

                <a
                  href="#how-information-is-used"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  How Information Is Used
                </a>

                <a
                  href="#sharing"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Information Sharing
                </a>

                <a
                  href="#technology"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Technology Providers
                </a>

                <a
                  href="#cookies"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Cookies and Analytics
                </a>

                <a
                  href="#security"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Security
                </a>

                <a
                  href="#retention"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Data Retention
                </a>

                <a
                  href="#choices"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Your Choices
                </a>

                <a
                  href="#contact"
                  className="block text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Contact Information
                </a>
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="space-y-8">
              <section
                id="overview"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  1. Overview
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Who this policy applies to
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    This Privacy Policy applies to information collected by
                    Unity Tax Planning through this website, online intake
                    forms, communications, planning engagements, and related
                    interactions.
                  </p>

                  <p>
                    Unity Tax Planning is intended to operate as a separate
                    business entity owned by Wade Marcy. Wade Marcy is also
                    associated with Unity Financial Planning Group. Unity Tax
                    Planning and Unity Financial Planning Group are separate
                    businesses and may maintain separate records, agreements,
                    privacy obligations, and service relationships.
                  </p>

                  <p>
                    This policy does not automatically govern information
                    collected directly by Unity Financial Planning Group, a CPA,
                    an attorney, an insurance provider, or another independent
                    professional or service provider.
                  </p>
                </div>
              </section>

              <section
                id="information-collected"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  2. Information Collected
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Information you provide
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  Unity Tax Planning may collect information that you
                  voluntarily provide, including:
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    "Name and contact information",
                    "Email address and telephone number",
                    "Household income range",
                    "Investable asset range",
                    "Business ownership information",
                    "Retirement and charitable-planning interests",
                    "Information about an anticipated business or asset sale",
                    "Whether you currently work with a CPA or financial adviser",
                    "Tax-planning concerns, objectives, and areas of interest",
                    "Scheduling, communication, and follow-up preferences",
                    "Information included in messages or administrative communications",
                    "Documents provided through an approved secure process",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                        ✓
                      </div>

                      <p className="text-sm font-bold leading-6 text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <p className="font-black text-amber-900">
                    Do not submit highly sensitive information through general
                    website forms.
                  </p>

                  <p className="mt-2 text-sm font-medium leading-7 text-amber-800">
                    Do not submit Social Security numbers, passwords, complete
                    account numbers, complete tax returns, medical records, or
                    copies of identification documents unless you have been
                    given specific secure-submission instructions.
                  </p>
                </div>

                <h3 className="mt-9 text-xl font-black tracking-tight">
                  Information collected automatically
                </h3>

                <p className="mt-4 font-medium leading-8 text-slate-600">
                  When you use the website, certain technical information may
                  be collected automatically by hosting, security, analytics,
                  or website-service providers. This may include your Internet
                  Protocol address, browser type, device type, operating system,
                  referring page, pages visited, approximate location, and the
                  date and time of website activity.
                </p>
              </section>

              <section
                id="how-information-is-used"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  3. How Information Is Used
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Why information may be processed
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  Information may be used to:
                </p>

                <ul className="mt-6 space-y-4">
                  {[
                    "Respond to questions and requests",
                    "Evaluate whether Unity Tax Planning services may be appropriate",
                    "Schedule consultations and planning-review meetings",
                    "Prepare, organize, and deliver tax-planning analysis",
                    "Identify potential planning topics and follow-up needs",
                    "Coordinate with authorized CPAs, attorneys, financial advisers, and other professionals",
                    "Maintain engagement records and internal administrative notes",
                    "Improve the website, intake process, and client experience",
                    "Protect the website, database, and users from misuse or unauthorized activity",
                    "Comply with applicable legal, regulatory, tax, recordkeeping, and contractual obligations",
                    "Establish, exercise, or defend legal claims",
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
                id="sharing"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  4. Information Sharing
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  When information may be disclosed
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Unity Tax Planning does not sell personal information in
                    exchange for money.
                  </p>

                  <p>
                    Information may be disclosed to service providers and
                    professional advisers when reasonably necessary to operate
                    the business, provide requested services, protect the
                    business, or comply with applicable obligations.
                  </p>
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-black">
                      Technology and operations
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                      Hosting providers, database providers, authentication
                      providers, email providers, analytics tools, scheduling
                      systems, document systems, cybersecurity providers, and
                      other operational vendors.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-black">
                      Professional coordination
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                      CPAs, enrolled agents, accountants, attorneys, financial
                      advisers, insurance professionals, and other advisers when
                      authorized or reasonably necessary for a requested
                      engagement.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-black">
                      Business and legal purposes
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                      Auditors, consultants, insurers, compliance professionals,
                      legal counsel, regulators, courts, law enforcement, or
                      government authorities where permitted or required.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-black">
                      Business transitions
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                      Information may be transferred as part of a merger,
                      acquisition, financing, restructuring, sale of assets, or
                      similar business transaction, subject to applicable
                      obligations.
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="font-black text-blue-950">
                    Unity Financial Planning Group
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-7 text-blue-900">
                    Information is not automatically transferred to Unity
                    Financial Planning Group merely because Wade Marcy is
                    associated with both businesses. Information may be shared
                    when you request or authorize coordination, when necessary
                    to provide a requested service, or when otherwise permitted
                    by applicable law and the relevant agreements.
                  </p>
                </div>
              </section>

              <section
                id="technology"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  5. Technology and Service Providers
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Third-party systems
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Unity Tax Planning uses third-party technology providers to
                    operate its website and business. These providers may
                    process information on behalf of Unity Tax Planning or under
                    their own applicable terms and privacy policies.
                  </p>

                  <p>
                    The website currently uses Supabase for functions that may
                    include database storage, authentication, and management of
                    information submitted through website forms.
                  </p>

                  <p>
                    Additional providers may be used for hosting, website
                    deployment, analytics, email, scheduling, document
                    delivery, payment processing, artificial intelligence, and
                    other business functions.
                  </p>
                </div>
              </section>

              <section
                id="cookies"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  6. Cookies and Analytics
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Website measurement and functionality
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    The website and its service providers may use cookies,
                    local storage, server logs, pixels, or similar technologies
                    to operate the website, maintain security, understand
                    website traffic, remember preferences, and improve
                    performance.
                  </p>

                  <p>
                    Analytics tools may collect information about how visitors
                    reach and use the website, including pages viewed,
                    approximate location, device information, referral sources,
                    and interactions with website features.
                  </p>

                  <p>
                    You may be able to manage cookies through your browser
                    settings. Blocking certain technologies may affect website
                    functionality.
                  </p>
                </div>
              </section>

              <section
                id="artificial-intelligence"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  7. Artificial Intelligence
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  AI-assisted tools
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Unity Tax Planning may use artificial intelligence and
                    technology-assisted tools to help organize information,
                    summarize materials, identify possible planning topics,
                    prepare preliminary calculations, or support internal
                    analysis.
                  </p>

                  <p>
                    Information should not be submitted to an AI-assisted system
                    unless its use is considered appropriate for the applicable
                    engagement. AI-generated output may be incomplete or
                    inaccurate and is subject to professional review.
                  </p>

                  <p>
                    Highly sensitive information should not be entered into
                    general-purpose AI systems unless appropriate safeguards,
                    permissions, and contractual protections are in place.
                  </p>
                </div>
              </section>

              <section
                id="security"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  8. Security
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Protecting information
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    Unity Tax Planning uses administrative, technical, and
                    organizational measures intended to protect information
                    against unauthorized access, loss, misuse, alteration, or
                    disclosure.
                  </p>

                  <p>
                    These measures may include authenticated administrative
                    access, database access controls, encrypted connections,
                    service-provider safeguards, restricted access, and secure
                    document-transfer procedures.
                  </p>

                  <p>
                    No website, database, transmission method, or storage system
                    can be guaranteed to be completely secure. You should use
                    caution when transmitting information electronically.
                  </p>
                </div>
              </section>

              <section
                id="retention"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  9. Data Retention
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  How long information may be retained
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  Information may be retained for as long as reasonably
                  necessary to respond to inquiries, provide services, maintain
                  business and engagement records, comply with legal or
                  regulatory obligations, resolve disputes, enforce agreements,
                  protect against fraud, and support legitimate business
                  operations.
                </p>

                <p className="mt-4 font-medium leading-8 text-slate-600">
                  Retention periods may vary depending on the type of
                  information, the nature of the relationship, contractual
                  requirements, professional recordkeeping obligations, and
                  applicable law.
                </p>
              </section>

              <section
                id="choices"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  10. Your Choices and Requests
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Access, correction, and deletion requests
                </h2>

                <div className="mt-5 space-y-4 font-medium leading-8 text-slate-600">
                  <p>
                    You may contact Unity Tax Planning to request access to,
                    correction of, or deletion of certain personal information.
                    Requests will be reviewed and handled subject to applicable
                    law, identity verification, recordkeeping requirements,
                    contractual obligations, and legitimate business needs.
                  </p>

                  <p>
                    Some information may need to be retained even after a
                    deletion request, including records required for legal,
                    regulatory, tax, compliance, security, dispute-resolution,
                    or professional purposes.
                  </p>

                  <p>
                    You may request that marketing or nonessential
                    communications stop at any time. Service-related,
                    security-related, legal, or engagement-related
                    communications may still be sent where appropriate.
                  </p>
                </div>
              </section>

              <section
                id="children"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  11. Children&apos;s Privacy
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Services intended for adults
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  This website and its services are intended for adults and are
                  not directed to children under 13. Unity Tax Planning does not
                  knowingly seek to collect personal information directly from
                  children through general website forms.
                </p>

                <p className="mt-4 font-medium leading-8 text-slate-600">
                  Information about a minor should be provided only by or with
                  the authorization of the minor&apos;s parent, legal guardian,
                  or another person legally permitted to provide it.
                </p>
              </section>

              <section
                id="external-links"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  12. External Websites
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Third-party links
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  The website may contain links to third-party websites or
                  services. Unity Tax Planning does not control the privacy,
                  security, content, or business practices of those third
                  parties. You should review their policies before providing
                  information.
                </p>
              </section>

              <section
                id="changes"
                className="scroll-mt-40 rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                  13. Changes to This Policy
                </p>

                <h2 className="text-3xl font-black tracking-tight">
                  Policy updates
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-600">
                  This Privacy Policy may be updated to reflect changes in the
                  business, services, technology, providers, or applicable
                  obligations. The updated version will be posted on this page
                  with a revised effective date.
                </p>

                <p className="mt-4 font-medium leading-8 text-slate-600">
                  Your continued use of the website after an update means that
                  the revised policy will apply to future website activity,
                  subject to applicable law.
                </p>
              </section>

              <section
                id="contact"
                className="scroll-mt-40 rounded-[2rem] border-2 border-blue-200 bg-blue-50 p-6 shadow-xl shadow-blue-100/50 sm:p-9"
              >
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                  14. Contact Information
                </p>

                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  Privacy questions and requests
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-700">
                  Questions about this policy or requests concerning personal
                  information may be sent to:
                </p>

                <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-white p-5">
                  <p className="text-lg font-black text-slate-950">
                    Unity Tax Planning
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Attention: Privacy Request
                  </p>

                  <a
                    href="mailto:wadermarcy@gmail.com?subject=Unity%20Tax%20Planning%20Privacy%20Request"
                    className="mt-3 inline-block break-all font-black text-blue-600 transition hover:text-blue-500 hover:underline"
                  >
                    wadermarcy@gmail.com
                  </a>
                </div>

                <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
                  Additional information may be requested to verify your
                  identity and protect information from unauthorized access or
                  disclosure.
                </p>
              </section>

              <section className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">
                  Important Reminder
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  Use secure channels for sensitive documents.
                </h2>

                <p className="mt-5 font-medium leading-8 text-slate-300">
                  General website forms and ordinary email should not be used
                  for Social Security numbers, full account numbers, passwords,
                  complete tax returns, identification documents, or other
                  highly sensitive records.
                </p>

                <Link
                  href="/tax-opportunity-scan"
                  className="mt-7 inline-flex rounded-full bg-blue-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-blue-400"
                >
                  Return to Tax Opportunity Review
                </Link>
              </section>
            </div>
          </article>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}