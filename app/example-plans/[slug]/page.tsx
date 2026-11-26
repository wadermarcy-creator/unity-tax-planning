import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
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
    <main className="min-h-screen bg-[#f8f5ef] text-[#10243b]">
      <Navbar />

      <section className="bg-[#10243b] px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-[#d6bc87] sm:text-base">
              {example.eyebrow}
            </p>

            <h1 className="font-serif mb-8 text-5xl font-normal tracking-tight sm:text-6xl md:text-7xl">
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
                className="w-full rounded-lg bg-[#d6bc87] px-8 py-5 text-center text-lg font-semibold text-[#10243b] shadow-xl shadow-black/10 transition hover:bg-[#e5d2ab] sm:w-auto"
              >
                {example.sampleButtonText}
              </a>

              <Link
                href="/tax-opportunity-scan"
                className="w-full rounded-lg border-2 border-[#536579] px-8 py-5 text-center text-lg font-black text-white transition hover:border-[#d6bc87] hover:bg-[#19334e] sm:w-auto"
              >
                Start My Assessment
              </Link>
            </div>
          </div>

          <aside className="rounded-xl border-2 border-[#b99a60] bg-[#19334e] p-8 shadow-2xl shadow-black/10 sm:p-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#d6bc87]">
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
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#80602b] sm:text-base">
              The Scenario
            </p>

            <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl md:text-6xl">
              The situation behind this sample plan.
            </h2>
          </div>

          <div className="rounded-xl border-2 border-[#ded4c2] bg-white p-8 shadow-lg sm:p-10">
            <p className="text-xl font-medium leading-9 text-slate-700">
              {example.profile}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#eee8dc] px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#80602b] sm:text-base">
              What the Review Looks For
            </p>

            <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl md:text-7xl">
              Potential tax blind spots reviewed in this scenario.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {example.blindSpots.map((item, index) => (
              <article
                key={item}
                className="rounded-xl border-2 border-[#ded4c2] bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-[#b99a60] hover:shadow-xl"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#80602b] text-sm font-black text-white">
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
          <article className="rounded-xl border-2 border-[#ded4c2] bg-white p-8 shadow-lg sm:p-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#80602b]">
              What the Sample Report Includes
            </p>

            <h2 className="font-serif mb-8 text-3xl font-normal tracking-tight sm:text-4xl">
              A written plan with planning areas and next steps.
            </h2>

            <div className="space-y-4">
              {example.reportIncludes.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-lg bg-[#eee8dc] p-5"
                >
                  <span className="font-black text-[#80602b]">✓</span>

                  <p className="font-bold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border-2 border-[#b99a60] bg-[#10243b] p-8 text-white shadow-2xl shadow-black/10 sm:p-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#d6bc87]">
              Potential Opportunities
            </p>

            <h2 className="font-serif mb-8 text-3xl font-normal tracking-tight sm:text-4xl">
              What the planning process may help clarify.
            </h2>

            <div className="space-y-4">
              {example.opportunities.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-lg border border-[#536579] bg-[#19334e] p-5"
                >
                  <span className="font-black text-[#d6bc87]">✓</span>

                  <p className="font-bold leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#10243b] px-4 py-20 text-white sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#d6bc87] sm:text-base">
              Related Sample Plans
            </p>

            <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl md:text-7xl">
              Explore other tax planning scenarios.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {relatedExamples.map((relatedExample) => (
              <Link
                key={relatedExample.slug}
                href={`/example-plans/${relatedExample.slug}`}
                className="group rounded-xl border-2 border-[#536579] bg-[#19334e] p-8 shadow-xl transition hover:-translate-y-1 hover:border-[#b99a60] hover:shadow-2xl sm:p-9"
              >
                <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#d6bc87]">
                  Sample Tax Plan
                </p>

                <h3 className="font-serif text-2xl font-normal tracking-tight text-white transition group-hover:text-[#d6bc87] sm:text-3xl">
                  {relatedExample.title}
                </h3>

                <p className="mt-5 text-lg font-medium leading-8 text-slate-300">
                  {relatedExample.shortDescription}
                </p>

                <span className="mt-7 inline-block font-black text-[#d6bc87]">
                  View This Sample →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/example-plans"
              className="inline-block w-full rounded-lg border-2 border-[#536579] px-8 py-5 text-center text-lg font-black text-white transition hover:border-[#d6bc87] hover:bg-[#19334e] sm:w-auto"
            >
              View All Sample Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#80602b] px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-serif mb-8 text-4xl font-normal tracking-tight sm:text-5xl md:text-7xl">
            Want to see what your own tax plan may be missing?
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl font-medium leading-9 text-[#f8f5ef] sm:text-2xl">
            Start with a short intake. If there is a fit, the next step is a
            deeper review of your documents and a written tax planning summary.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={example.samplePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-white px-8 py-5 text-lg font-black text-[#80602b] shadow-xl transition hover:bg-[#f8f5ef] sm:w-auto"
            >
              View Sample Report
            </a>

            <Link
              href="/tax-opportunity-scan"
              className="w-full rounded-lg border-2 border-[#d6bc87] px-8 py-5 text-lg font-black text-white transition hover:bg-[#694c22] sm:w-auto"
            >
              Start My Assessment
            </Link>
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-sm font-medium leading-7 text-[#f8f5ef]">
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