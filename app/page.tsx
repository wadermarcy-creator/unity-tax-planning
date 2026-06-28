import Link from "next/link";
import Navbar from "@/components/Navbar";
import DisclosureFooter from "@/components/DisclosureFooter";

const process = [
  {
    step: "01",
    title: "Discover",
    description:
      "We learn about your income, business, investments, goals, and concerns.",
  },
  {
    step: "02",
    title: "Analyze",
    description:
      "We review your situation for proactive tax planning opportunities.",
  },
  {
    step: "03",
    title: "Strategize",
    description:
      "We prioritize the strategies that may have the greatest impact.",
  },
  {
    step: "04",
    title: "Implement",
    description:
      "We help coordinate next steps with your CPA, attorney, and advisory team.",
  },
];

const audiences = [
  {
    title: "Business Owners",
    text: "Reduce taxes, improve cash flow, and build long-term wealth through proactive planning.",
  },
  {
    title: "High-Income Families",
    text: "Coordinate income, investments, charitable giving, and estate planning with tax strategy.",
  },
  {
    title: "Investors",
    text: "Plan around capital gains, real estate, concentrated stock, and portfolio tax efficiency.",
  },
  {
    title: "Retirees",
    text: "Review Roth conversions, RMDs, IRMAA, Social Security taxation, and legacy planning.",
  },
];

const strategies = [
  "S Corporation Planning",
  "Retirement Plan Design",
  "Roth Conversions",
  "Capital Gains Planning",
  "Charitable Strategies",
  "Entity Structure Review",
  "Real Estate Tax Planning",
  "Estate Coordination",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030817] text-white">
      <Navbar />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <div>
          <p className="mb-7 text-sm font-bold uppercase tracking-[0.32em] text-blue-300">
            Proactive Tax Strategy
          </p>

          <h1 className="max-w-4xl text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            Stop Overpaying Taxes.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-300">
            Tax preparation records history. Tax strategy changes it. Start with
            a{" "}
            <strong className="text-white">
              Unity Tax Opportunity Assessment™
            </strong>{" "}
            and discover opportunities while there is still time to act.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tax-opportunity-scan"
              className="rounded-full bg-blue-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Start My Assessment
            </Link>

            <Link
              href="/example-plans"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center text-base font-bold text-white transition hover:bg-white/10"
            >
              See Sample Tax Plans
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white p-8 text-[#030817] shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
            The Assessment
          </p>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight">
            Find the tax strategies you may be missing.
          </h2>

          <div className="mt-8 space-y-5">
            {["Discover", "Analyze", "Strategize", "Implement", "Monitor"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600">
                    {index + 1}
                  </div>
                  <p className="font-bold text-slate-900">{item}</p>
                </div>
              )
            )}
          </div>

          <div className="mt-8 rounded-3xl bg-slate-50 p-6">
            <p className="text-sm leading-6 text-slate-600">
              Most people do tax planning after the year is already over. The
              Unity Tax Opportunity Assessment™ is designed to identify planning
              opportunities before they become missed opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white text-[#030817]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-blue-600">
                Why Unity
              </p>
              <h2 className="mt-6 text-5xl font-extrabold tracking-tight">
                Most people file taxes. Few people plan them.
              </h2>
            </div>

            <div className="space-y-7 text-lg leading-8 text-slate-600">
              <p>
                Many successful business owners and families only talk about
                taxes after the year is already over. By then, many of the best
                planning opportunities may already be gone.
              </p>
              <p>
                Unity Tax Planning helps you think proactively, identify
                strategies earlier, and coordinate tax decisions with your
                broader financial life.
              </p>
              <p className="font-bold text-slate-900">
                The biggest tax-saving opportunities are often available before
                December 31 — not after April 15.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#030817] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-blue-300">
              Unity Strategy Framework™
            </p>
            <h2 className="mt-6 text-5xl font-extrabold tracking-tight text-white">
              Strategy before filing. Coordination after planning.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <p className="text-sm font-extrabold text-blue-300">
                  {item.step}
                </p>
                <h3 className="mt-5 text-2xl font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 text-[#030817]">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-blue-600">
              Who We Help
            </p>
            <h2 className="mt-6 text-5xl font-extrabold tracking-tight">
              Built for people with more at stake.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-xl font-extrabold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-24 text-[#030817]">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-blue-600">
              Planning Opportunities
            </p>
            <h2 className="mt-6 text-5xl font-extrabold tracking-tight">
              A better tax outcome starts with better questions.
            </h2>
            <p className="mt-7 text-lg leading-8 text-slate-600">
              The assessment is designed to surface strategies worth reviewing
              based on your income, business, investments, goals, and timeline.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {strategies.map((strategy) => (
              <div
                key={strategy}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-900 shadow-sm"
              >
                {strategy}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030817] px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-blue-300">
            Start Here
          </p>
          <h2 className="mt-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            You worked too hard to pay more tax than you legally have to.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Start your Unity Tax Opportunity Assessment™ and discover whether
            proactive planning could make a meaningful difference.
          </p>

          <div className="mt-10">
            <Link
              href="/tax-opportunity-scan"
              className="inline-flex rounded-full bg-blue-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Start My Assessment
            </Link>
          </div>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}