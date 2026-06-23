import type { ReactNode } from "react";
import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type Situation = {
  title: string;
  description: string;
  sampleSlug: string;
};

type SamplePlan = {
  title: string;
  description: string;
  slug: string;
};

type PlanningArea = {
  number: string;
  title: string;
  icon: ReactNode;
  position: string;
};

function BusinessIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M5 21V5.8C5 4.81 5.81 4 6.8 4h6.4c.99 0 1.8.81 1.8 1.8V21M3 21h18M8 8h1M8 12h1M8 16h1M12 8h1M12 12h1M12 16h1M17 10h2v11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RetirementIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M4 20h16M6 20v-8h12v8M8 12V8h8v4M12 4v4M9 4h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 16h2M14 16h2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InvestmentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M4 19V9M10 19V5M16 19v-7M22 19V3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M3 21h19M4 13l6-5 6 3 6-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CharitableIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TransactionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M8.5 12.5 5 16l3.5 3.5M5 16h10a4 4 0 0 0 4-4v-1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15.5 11.5 19 8l-3.5-3.5M19 8H9a4 4 0 0 0-4 4v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EstateIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M3 21h18M5 21v-9h14v9M8 21v-5h3v5M13 21v-5h3v5M4 12l8-8 8 8M9 9h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-10 w-10"
    >
      <path
        d="M12 3 19 6v5c0 4.7-2.8 8-7 10-4.2-2-7-5.3-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m12 7 1.2 3.2 3.3.2-2.6 2.1.9 3.3-2.8-1.8-2.8 1.8.9-3.3-2.6-2.1 3.3-.2L12 7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const situations: Situation[] = [
    {
      title: "I own a business",
      description:
        "Coordinate business income, retirement plan design, estimated taxes, and personal tax strategy.",
      sampleSlug: "business-owner",
    },
    {
      title: "I am retiring soon",
      description:
        "Review Roth conversions, RMDs, Social Security, Medicare IRMAA, and withdrawal sequencing.",
      sampleSlug: "pre-retiree-large-iras",
    },
    {
      title: "I have a high income",
      description:
        "Look for tax planning opportunities around retirement plans, giving, investments, and deductions.",
      sampleSlug: "high-income-family",
    },
    {
      title: "I have taxable investments",
      description:
        "Identify capital gains exposure, tax-loss harvesting opportunities, and portfolio tax drag.",
      sampleSlug: "taxable-investment-account",
    },
    {
      title: "I give to charity",
      description:
        "Coordinate generosity with appreciated stock, donor-advised funds, bunching, and future QCDs.",
      sampleSlug: "charitable-giving",
    },
    {
      title: "I may sell something big",
      description:
        "Plan before selling a business, property, stock position, or other highly appreciated asset.",
      sampleSlug: "large-capital-gain",
    },
  ];

  const samplePlans: SamplePlan[] = [
    {
      title: "Business Owner Tax Planning",
      description:
        "S-Corp income, retirement plan design, QBI, estimated taxes, and CPA coordination.",
      slug: "business-owner",
    },
    {
      title: "Pre-Retiree with Large IRAs",
      description:
        "Roth conversion planning, future RMDs, Medicare IRMAA, and retirement tax mapping.",
      slug: "pre-retiree-large-iras",
    },
    {
      title: "High-Income Family Planning",
      description:
        "Backdoor Roth, charitable giving, tax-loss harvesting, asset location, and year-end planning.",
      slug: "high-income-family",
    },
    {
      title: "Large Capital Gain Planning",
      description:
        "Pre-sale planning, depreciation recapture, NIIT, charitable strategy, installment sale, and 1031 review.",
      slug: "large-capital-gain",
    },
    {
      title: "Investment Tax-Efficiency Review",
      description:
        "Unrealized gains, harvestable losses, asset location, tax drag, and concentrated positions.",
      slug: "taxable-investment-account",
    },
    {
      title: "Charitable Giving Strategy",
      description:
        "Appreciated stock gifting, donor-advised fund bunching, deduction planning, and future QCDs.",
      slug: "charitable-giving",
    },
  ];

  const planningAreas: PlanningArea[] = [
    {
      number: "1",
      title: "Business Income",
      icon: <BusinessIcon />,
      position:
        "lg:left-1/2 lg:top-0 lg:-translate-x-1/2",
    },
    {
      number: "2",
      title: "Retirement",
      icon: <RetirementIcon />,
      position:
        "lg:right-0 lg:top-[19%]",
    },
    {
      number: "3",
      title: "Investments",
      icon: <InvestmentIcon />,
      position:
        "lg:bottom-[19%] lg:right-0",
    },
    {
      number: "4",
      title: "Charitable Giving",
      icon: <CharitableIcon />,
      position:
        "lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2",
    },
    {
      number: "5",
      title: "Major Transactions",
      icon: <TransactionIcon />,
      position:
        "lg:bottom-[19%] lg:left-0",
    },
    {
      number: "6",
      title: "Estate Coordination",
      icon: <EstateIcon />,
      position:
        "lg:left-0 lg:top-[19%]",
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
            <a href="#situations" className="hover:text-white">
              Situations
            </a>

            <Link href="/how-it-works" className="hover:text-white">
              How It Works
            </Link>

            <a href="#samples" className="hover:text-white">
              Samples
            </a>

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
          <a
            href="#situations"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Situations
          </a>

          <Link
            href="/how-it-works"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            How It Works
          </Link>

          <a
            href="#samples"
            className="shrink-0 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          >
            Samples
          </a>

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

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 md:py-24 xl:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-24 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -right-32 top-16 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-[-24rem] left-1/3 h-[40rem] w-[40rem] rounded-full border border-blue-500/20" />
          <div className="absolute bottom-[-21rem] left-[28%] h-[40rem] w-[40rem] rounded-full border border-blue-400/10" />
          <div className="absolute bottom-[-18rem] left-[23%] h-[40rem] w-[40rem] rounded-full border border-blue-300/5" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.98fr_1.02fr] lg:items-center xl:gap-16">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.28em] text-blue-300 sm:text-base">
              Tax Planning Before It Becomes Tax History
            </p>

            <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl lg:text-6xl xl:text-[4.5rem] xl:leading-[1.04]">
              Your tax return shows what happened.

              <span className="mt-3 block text-blue-300">
                We help identify what may have been missed.
              </span>
            </h1>

            <p className="mb-10 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Unity Tax Planning helps business owners, high-income families,
              retirees, and investors uncover potential tax planning
              opportunities before important decisions are made.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/tax-opportunity-scan"
                className="w-full rounded-2xl bg-blue-500 px-8 py-5 text-center text-lg font-black text-white shadow-xl shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto"
              >
                Start My Tax Blind Spot Review
              </Link>

              <a
                href="#samples"
                className="w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
              >
                View Sample Plans
              </a>
            </div>

            <p className="mt-8 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base sm:leading-7">
              This is not tax preparation, legal advice, accounting advice, or
              a guarantee of tax savings.
            </p>
          </div>

          <aside className="relative">
            <div className="absolute -inset-6 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-blue-400/20 bg-slate-900/40 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-sm sm:p-7 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="mb-7 text-center lg:hidden">
                <p className="text-2xl font-black text-white">
                  Your Tax Picture
                </p>

                <p className="mt-2 font-semibold leading-6 text-blue-300">
                  Several planning areas may affect one another.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:relative lg:block lg:h-[610px]">
                <svg
                  viewBox="0 0 600 600"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
                >
                  <circle
                    cx="300"
                    cy="300"
                    r="215"
                    fill="none"
                    stroke="rgba(96, 165, 250, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="4 7"
                  />

                  <circle
                    cx="300"
                    cy="300"
                    r="165"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.18)"
                    strokeWidth="1"
                  />

                  <line
                    x1="300"
                    y1="300"
                    x2="300"
                    y2="88"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="2"
                  />

                  <line
                    x1="300"
                    y1="300"
                    x2="493"
                    y2="190"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="2"
                  />

                  <line
                    x1="300"
                    y1="300"
                    x2="493"
                    y2="410"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="2"
                  />

                  <line
                    x1="300"
                    y1="300"
                    x2="300"
                    y2="512"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="2"
                  />

                  <line
                    x1="300"
                    y1="300"
                    x2="107"
                    y2="410"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="2"
                  />

                  <line
                    x1="300"
                    y1="300"
                    x2="107"
                    y2="190"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="2"
                  />

                  <circle
                    cx="300"
                    cy="88"
                    r="5"
                    fill="rgb(147, 197, 253)"
                  />

                  <circle
                    cx="493"
                    cy="190"
                    r="5"
                    fill="rgb(147, 197, 253)"
                  />

                  <circle
                    cx="493"
                    cy="410"
                    r="5"
                    fill="rgb(147, 197, 253)"
                  />

                  <circle
                    cx="300"
                    cy="512"
                    r="5"
                    fill="rgb(147, 197, 253)"
                  />

                  <circle
                    cx="107"
                    cy="410"
                    r="5"
                    fill="rgb(147, 197, 253)"
                  />

                  <circle
                    cx="107"
                    cy="190"
                    r="5"
                    fill="rgb(147, 197, 253)"
                  />
                </svg>

                <div className="relative order-first col-span-2 mx-auto mb-2 flex h-44 w-44 flex-col items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 text-center shadow-[0_0_55px_rgba(59,130,246,0.45)] sm:col-span-3 lg:absolute lg:left-1/2 lg:top-1/2 lg:z-20 lg:mb-0 lg:h-52 lg:w-52 lg:-translate-x-1/2 lg:-translate-y-1/2">
                  <div className="text-blue-300">
                    <ShieldIcon />
                  </div>

                  <p className="mt-3 text-2xl font-black leading-tight text-white lg:text-3xl">
                    Your Tax
                    <span className="block">Picture</span>
                  </p>
                </div>

                {planningAreas.map((area) => (
                  <div
                    key={area.title}
                    className={`relative z-10 flex min-h-40 flex-col items-center justify-center rounded-[1.75rem] border border-blue-300/40 bg-gradient-to-br from-blue-950/95 via-slate-950 to-blue-900/90 p-4 text-center shadow-[0_0_30px_rgba(59,130,246,0.18)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.32)] lg:absolute lg:h-36 lg:w-36 lg:rounded-full lg:p-3 ${area.position}`}
                  >
                    <div className="text-blue-300">{area.icon}</div>

                    <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-blue-400">
                      {area.number}
                    </p>

                    <p className="mt-1 text-sm font-black leading-5 text-white">
                      {area.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center lg:mt-2">
                <p className="text-lg font-bold leading-7 text-blue-300 sm:text-xl">
                  Most tax opportunities are connected—not isolated.
                </p>

                <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-500">
                  The areas shown are general examples. The planning topics
                  relevant to you depend on your individual circumstances.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="situations" className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
              Choose Your Situation
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Start with what is actually happening in your life.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {situations.map((situation) => (
              <article
                key={situation.title}
                className="rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <h3 className="mb-5 text-2xl font-black tracking-tight sm:text-3xl">
                  {situation.title}
                </h3>

                <p className="text-lg font-medium leading-8 text-slate-600">
                  {situation.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/example-plans/${situation.sampleSlug}`}
                    className="flex w-full justify-center rounded-xl bg-blue-600 px-5 py-4 text-center text-base font-black text-white hover:bg-blue-500 sm:w-auto"
                  >
                    View Sample
                  </Link>

                  <Link
                    href="/tax-opportunity-scan"
                    className="flex w-full justify-center rounded-xl border-2 border-slate-300 px-5 py-4 text-center text-base font-black text-slate-800 hover:border-blue-500 hover:text-blue-600 sm:w-auto"
                  >
                    Find Blind Spots
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="receive"
        className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              What You Receive
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              A clear planning summary, not a generic tax checklist.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              The goal is to turn your tax return, financial details, and
              planning questions into a more organized plan of action.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Step 01
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Document Review
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                We review the information needed to understand your tax picture,
                such as returns, income estimates, investment accounts, business
                details, or charitable giving.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-2xl shadow-blue-950/40 sm:p-9">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Step 02
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Planning Analysis
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                We look for planning opportunities around income, investments,
                retirement accounts, charitable giving, business ownership, or
                upcoming transactions.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Step 03
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Written Plan + Next Steps
              </h3>

              <p className="text-lg font-medium leading-8 text-slate-300">
                You receive a written planning summary with potential
                opportunities, priority items, implementation notes, and areas
                to coordinate with your CPA or other professionals.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/how-it-works"
              className="inline-block w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section id="samples" className="px-4 py-20 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-600 sm:text-base">
                Sample Planning Scenarios
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                See what a tax planning deliverable can look like.
              </h2>
            </div>

            <p className="text-xl font-medium leading-9 text-slate-600 sm:text-2xl">
              Each sample page explains the scenario, the planning issue, the
              opportunities reviewed, and includes a sample report.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {samplePlans.map((plan) => (
              <Link
                key={plan.slug}
                href={`/example-plans/${plan.slug}`}
                className="group rounded-[2rem] border-2 border-slate-300 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-9"
              >
                <h3 className="mb-5 text-2xl font-black tracking-tight group-hover:text-blue-600 sm:text-3xl">
                  {plan.title}
                </h3>

                <p className="mb-8 text-lg font-medium leading-8 text-slate-600">
                  {plan.description}
                </p>

                <span className="text-base font-black text-blue-600">
                  View Sample →
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-base leading-7 text-slate-500">
            Sample plans are hypothetical and for illustrative purposes only.
            They do not represent actual client experiences and should not be
            interpreted as tax, legal, accounting, investment, or financial
            advice.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-blue-300 sm:text-base">
              Pricing
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Start with the right level of review.
            </h2>

            <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-300 sm:text-2xl">
              Choose the level of planning that fits your situation. More
              complex needs can be discussed before any engagement begins.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Tax Blind Spot Review
              </h3>

              <p className="mb-5 text-2xl font-black text-blue-300">
                Starting at $995
              </p>

              <p className="text-lg font-medium leading-8 text-slate-300">
                A focused review to identify potential tax planning
                opportunities that may be easy to miss.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-blue-500 bg-slate-900 p-8 shadow-2xl shadow-blue-950/40 sm:p-9">
              <p className="mb-5 inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
                Most Popular
              </p>

              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Comprehensive Tax Planning
              </h3>

              <p className="mb-5 text-2xl font-black text-blue-300">
                Starting at $3,500
              </p>

              <p className="text-lg font-medium leading-8 text-slate-300">
                A deeper planning engagement for business owners, pre-retirees,
                and families with multiple moving parts.
              </p>
            </div>

            <div className="rounded-[2rem] border-2 border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-9">
              <h3 className="mb-5 text-2xl font-black sm:text-3xl">
                Advanced Planning
              </h3>

              <p className="mb-5 text-2xl font-black text-blue-300">
                Custom Engagement
              </p>

              <p className="text-lg font-medium leading-8 text-slate-300">
                For complex situations involving large gains, business sales,
                estate planning, and multi-advisor coordination.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="w-full rounded-2xl bg-blue-500 px-8 py-5 text-center text-lg font-black text-white shadow-xl shadow-blue-950/30 hover:bg-blue-400 sm:w-auto"
            >
              View Full Pricing
            </Link>

            <Link
              href="/faq"
              className="w-full rounded-2xl border-2 border-slate-700 px-8 py-5 text-center text-lg font-black text-white hover:border-blue-400 hover:bg-slate-900 sm:w-auto"
            >
              Read Frequently Asked Questions
            </Link>
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
            deeper review of your documents and a written tax planning summary.
          </p>

          <Link
            href="/tax-opportunity-scan"
            className="inline-block w-full rounded-2xl bg-white px-8 py-5 text-lg font-black text-blue-600 shadow-xl hover:bg-blue-50 sm:w-auto"
          >
            Start My Tax Blind Spot Review
          </Link>
        </div>
      </section>

      <DisclosureFooter />
    </main>
  );
}