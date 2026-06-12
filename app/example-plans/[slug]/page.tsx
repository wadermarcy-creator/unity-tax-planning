import Link from "next/link";
import { notFound } from "next/navigation";
import DisclosureFooter from "@/components/DisclosureFooter";
import { getPlanningExample, planningExamples } from "@/lib/planningExamples";

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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const example = getPlanningExample(slug);

  if (!example) {
    return {
      title: "Sample Tax Planning Report | Unity Tax Planning",
    };
  }

  return {
    title: `${example.title} | Unity Tax Planning`,
    description: example.shortDescription,
  };
}

export default async function ExamplePlanPage({ params }: PageProps) {
  const { slug } = await params;
  const example = getPlanningExample(slug);

  if (!example) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-base font-bold tracking-tight sm:text-lg">
            Unity Tax Planning
          </Link>

          <Link
            href="/tax-opportunity-scan"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 sm:px-5"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Find Blind Spots</span>
          </Link>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-300 sm:text-sm">
              {example.eyebrow}
            </p>

            <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {example.title}
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              {example.shortDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={example.samplePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-blue-500 px-6 py-4 text-center font-semibold text-white hover:bg-blue-400 sm:w-auto"
              >
                {example.sampleButtonText}
              </a>

              <Link
                href="/tax-opportunity-scan"
                className="w-full rounded-xl border border-slate-700 px-6 py-4 text-center font-semibold text-white hover:bg-slate-900 sm:w-auto"
              >
                Start My Review
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Main Concern
            </p>

            <p className="text-lg leading-8 text-slate-200">
              {example.mainConcern}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
              Scenario
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The situation this sample plan is built around.
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6 sm:p-8">
            <p className="text-lg leading-8 text-slate-700">
              {example.profile}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
              What the Review Looks For
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Potential blind spots reviewed in this scenario.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {example.blindSpots.map((item) => (
              <div key={item} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="font-semibold leading-7 text-slate-800">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
              What the Sample Report Includes
            </p>

            <h2 className="mb-6 text-3xl font-semibold tracking-tight">
              A written plan with specific planning areas and next steps.
            </h2>

            <div className="space-y-3 text-slate-700">
              {example.reportIncludes.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 sm:text-sm">
              Potential Opportunities
            </p>

            <h2 className="mb-6 text-3xl font-semibold tracking-tight">
              What the planning process may help clarify.
            </h2>

            <div className="space-y-3 text-slate-300">
              {example.opportunities.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-16 text-white sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Want to see what your own tax plan may be missing?
          </h2>

          <p className="mb-8 text-lg leading-8 text-blue-100 sm:text-xl">
            Start with a short intake. If there is a fit, the next step is a
            deeper review of your documents and a written tax planning summary.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={example.samplePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-white px-6 py-4 font-semibold text-blue-600 hover:bg-blue-50 sm:w-auto"
            >
              View Sample Report
            </a>

            <Link
              href="/tax-opportunity-scan"
              className="w-full rounded-xl border border-blue-300 px-6 py-4 font-semibold text-white hover:bg-blue-500 sm:w-auto"
            >
              Start My Tax Blind Spot Review
            </Link>
          </div>

          <p className="mt-6 text-sm leading-6 text-blue-100">
            Sample reports are hypothetical and for illustrative purposes only.
            They do not represent actual client experiences and should not be
            interpreted as tax, legal, accounting, investment, or financial advice.
          </p>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}