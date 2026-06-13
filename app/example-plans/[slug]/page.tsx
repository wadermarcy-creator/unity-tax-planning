import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DisclosureFooter from "@/components/DisclosureFooter";
import {
  getPlanningExample,
  planningExamples,
} from "@/lib/planningExamples";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return planningExamples.map((example) => ({
    slug: example.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = getPlanningExample(slug);

  if (!example) {
    return {
      title: "Sample Tax Planning Report",
      description:
        "Review hypothetical tax planning examples from Unity Tax Planning.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const pageUrl = `/example-plans/${example.slug}`;

  return {
    title: example.title,
    description: example.shortDescription,

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title: `${example.title} | Unity Tax Planning`,
      description: example.shortDescription,
      url: pageUrl,
      type: "article",
      siteName: "Unity Tax Planning",
    },

    twitter: {
      card: "summary_large_image",
      title: `${example.title} | Unity Tax Planning`,
      description: example.shortDescription,
    },
  };
}

export default async function ExamplePlanPage({ params }: PageProps) {
  const { slug } = await params;
  const example = getPlanningExample(slug);

  if (!example) {
    notFound();
  }

  const relatedExamples = planningExamples
    .filter((item) => item.slug !== example.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-slate-950">
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
            <Link
              href="/#situations"
              className="transition hover:text-white"
            >
              Situations
            </Link>

            <Link
              href="/how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </Link>

            <Link href="/#samples" className="text-white">
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
            href="/tax-opportunity-scan"
            className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-blue-50 sm:px-8 sm:text-base"
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
            className="shrink-0 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-bold text-white"
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

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-blue-300 sm:text-base">
              {example.eyebrow}
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
              {example.title}
            </h1>

            <p className="max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              {example.shortDescription}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={example.samplePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-blue-500 px-8 py-5 text-center text-lg font-black text-white shadow-xl shadow-blue-950/30 transition hover:bg-blue-400 sm:w-auto"
              >
                {example.sampleButtonText}
              </a>

              <Link
                href="/tax-opportunity-scan"
                className="w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
              >
                Start My Review
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-2xl shadow-blue-950/30 sm:p-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Main Concern
            </p>

            <p className="text-xl font-medium leading-9 text-slate-200">
              {example.mainConcern}
            </p>
          </aside>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              The Scenario
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              The situation behind this sample plan.
            </h2>
          </div>

          <div className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-10">
            <p className="text-xl font-medium leading-9 text-slate-700">
              {example.profile}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              What the Review Looks For
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Potential tax blind spots reviewed in this scenario.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {example.blindSpots.map((item, index) => (
              <article
                key={item}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <p className="text-lg font-black leading-8 text-slate-800">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg sm:p-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
              What the Sample Report Includes
            </p>

            <h2 className="mb-8 text-3xl font-black tracking-tight sm:text-4xl">
              A written plan with planning areas and next steps.
            </h2>

            <div className="space-y-4">
              {example.reportIncludes.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-2xl bg-slate-100 p-5"
                >
                  <span className="font-black text-blue-600">✓</span>

                  <p className="font-bold leading-7 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border-2 border-blue-500 bg-slate-950 p-8 text-white shadow-2xl shadow-blue-950/20 sm:p-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Potential Opportunities
            </p>

            <h2 className="mb-8 text-3xl font-black tracking-tight sm:text-4xl">
              What the planning process may help clarify.
            </h2>

            <div className="space-y-4">
              {example.opportunities.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-5"
                >
                  <span className="font-black text-blue-300">✓</span>

                  <p className="font-bold leading-7 text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              Related Sample Plans
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Explore other tax planning scenarios.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {relatedExamples.map((relatedExample) => (
              <Link
                key={relatedExample.slug}
                href={`/example-plans/${relatedExample.slug}`}
                className="group rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-xl transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                  Sample Tax Plan
                </p>

                <h3 className="text-2xl font-black tracking-tight text-white transition group-hover:text-blue-300 sm:text-3xl">
                  {relatedExample.title}
                </h3>

                <p className="mt-5 text-lg font-medium leading-8 text-slate-300">
                  {relatedExample.shortDescription}
                </p>

                <span className="mt-7 inline-block font-black text-blue-300">
                  View This Sample →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/#samples"
              className="inline-block w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
            >
              View All Sample Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Want to see what your own tax plan may be missing?
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-blue-100 sm:text-2xl">
            Start with a short intake. If there is a fit, the next step is a
            deeper review of your documents and a written tax planning summary.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={example.samplePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-blue-600 shadow-xl transition hover:bg-blue-50 sm:w-auto"
            >
              View Sample Report
            </a>

            <Link
              href="/tax-opportunity-scan"
              className="w-full rounded-2xl border-2 border-blue-300 px-8 py-5 text-lg font-black text-white transition hover:bg-blue-500 sm:w-auto"
            >
              Start My Tax Blind Spot Review
            </Link>
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-sm font-medium leading-7 text-blue-100">
            Sample reports are hypothetical and provided for illustrative
            purposes only. They do not represent actual client experiences and
            should not be interpreted as tax, legal, accounting, investment, or
            financial advice.
          </p>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}