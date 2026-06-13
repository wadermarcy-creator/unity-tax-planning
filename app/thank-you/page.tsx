import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 px-4 py-4 text-white backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-900/30">
              <span className="text-xl font-black text-white">U</span>
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
            <Link href="/#situations" className="transition hover:text-white">
              Situations
            </Link>

            <Link
              href="/how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </Link>

            <Link href="/#samples" className="transition hover:text-white">
              Samples
            </Link>

            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>

            <Link href="/faq" className="transition hover:text-white">
              FAQ
            </Link>
          </nav>

          <Link
            href="/"
            className="rounded-full border-2 border-slate-700 px-5 py-3 text-sm font-black text-white transition hover:border-blue-400 hover:bg-slate-900 sm:px-7 sm:text-base"
          >
            Home
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
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            FAQ
          </Link>
        </div>
      </header>

      {/* Confirmation Hero */}
      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-500/20 text-4xl font-black text-blue-300">
              ✓
            </div>

            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-blue-300 sm:text-base">
              Submission Received
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
              Your Tax Blind Spot Review has been submitted.
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Thank you for sharing your information. I will review your
              situation and determine whether there appear to be meaningful
              planning opportunities worth exploring further.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              What Happens Next
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              A straightforward review process from here.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                01
              </div>

              <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                I review your intake
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                I will review the information you provided to understand your
                planning concerns, timing, financial picture, and areas that may
                deserve a deeper analysis.
              </p>
            </article>

            <article className="rounded-[2rem] border-2 border-blue-500 bg-slate-950 p-8 text-white shadow-xl shadow-blue-950/20 sm:p-9">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-sm font-black text-white">
                02
              </div>

              <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                I determine whether there is a fit
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                If your situation appears to be a fit, I will reach out to
                discuss your goals, the likely scope of work, expected timing,
                and pricing.
              </p>
            </article>

            <article className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-9">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                03
              </div>

              <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                We discuss the next step
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-600">
                If you decide to move forward, I will explain which documents
                are needed and how they should be provided through a secure
                process.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              Important Security Reminder
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Please do not email sensitive financial documents.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-300">
              Do not send Social Security numbers, account numbers, passwords,
              complete tax returns, or other sensitive information through
              ordinary email. If documents are needed, secure submission
              instructions will be provided.
            </p>
          </div>

          <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-2xl shadow-blue-950/30 sm:p-9">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Expected Response
            </p>

            <h3 className="text-3xl font-black">
              Your submission will be reviewed before the next step is
              recommended.
            </h3>

            <p className="mt-5 text-lg font-medium leading-8 text-slate-300">
              More complex situations may require additional information before
              an appropriate planning scope can be determined.
            </p>
          </div>
        </div>
      </section>

      {/* Helpful Links */}
      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              While You Wait
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Learn more about the planning process.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Link
              href="/how-it-works"
              className="group rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl sm:p-9"
            >
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                The Process
              </p>

              <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-600 sm:text-3xl">
                See how tax planning works
              </h3>

              <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
                Review the steps from intake and document collection through
                planning analysis and coordinated implementation.
              </p>

              <span className="mt-7 inline-block font-black text-blue-600">
                How It Works →
              </span>
            </Link>

            <Link
              href="/pricing"
              className="group rounded-[2rem] border-2 border-blue-500 bg-slate-950 p-8 text-white shadow-xl shadow-blue-950/20 transition hover:-translate-y-1 hover:shadow-2xl sm:p-9"
            >
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Engagements
              </p>

              <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-300 sm:text-3xl">
                Review planning options and pricing
              </h3>

              <p className="mt-5 text-lg font-medium leading-8 text-slate-300">
                Compare the Tax Blind Spot Review, comprehensive planning, and
                advanced coordination engagements.
              </p>

              <span className="mt-7 inline-block font-black text-blue-300">
                View Pricing →
              </span>
            </Link>

            <Link
              href="/faq"
              className="group rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl sm:p-9"
            >
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                Common Questions
              </p>

              <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-600 sm:text-3xl">
                Read frequently asked questions
              </h3>

              <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
                Learn how tax planning differs from preparation, how
                information is handled, and what an engagement may include.
              </p>

              <span className="mt-7 inline-block font-black text-blue-600">
                Read the FAQ →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Thank you for taking the first step.
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-blue-100 sm:text-2xl">
            Your submission has been received. You can return to the homepage or
            review sample planning scenarios while your information is being
            evaluated.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-block w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-blue-600 shadow-xl transition hover:bg-blue-50 sm:w-auto"
            >
              Return to Home
            </Link>

            <Link
              href="/#samples"
              className="inline-block w-full rounded-2xl border-2 border-blue-300 px-8 py-5 text-lg font-black text-white transition hover:bg-blue-500 sm:w-auto"
            >
              View Sample Plans
            </Link>
          </div>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}