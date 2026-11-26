import Link from "next/link";
import Navbar from "@/components/Navbar";
import DisclosureFooter from "@/components/DisclosureFooter";

const audiences = [
  ["01", "Business owners", "Coordinate business and personal tax decisions, entity structure, retirement plans and cash flow."],
  ["02", "High-income households", "Explore income timing, equity compensation, charitable giving and retirement contributions."],
  ["03", "Retirees & pre-retirees", "Evaluate Roth conversions, required distributions, Medicare premiums and lifetime tax exposure."],
  ["04", "Major transactions", "Prepare for business sales, real estate transactions and concentrated investment gains before decisions are final."],
];
const steps = [
  ["Discover", "Understand your goals, income, assets and upcoming decisions."],
  ["Analyze", "Identify relevant opportunities and evaluate assumptions and tradeoffs."],
  ["Plan", "Develop a prioritized strategy and coordinate with your existing professionals."],
  ["Monitor", "Revisit decisions as your circumstances and tax laws change, under an agreed ongoing engagement."],
];
const primary = "inline-flex justify-center rounded-md bg-[#d6bc87] px-6 py-4 font-semibold text-[#10243b] transition hover:bg-[#e8d3aa] focus-visible:outline-2 focus-visible:outline-offset-4";
const secondary = "inline-flex justify-center rounded-md border border-white/30 px-6 py-4 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#10243b]">
      <Navbar />
      <section className="bg-[#10243b] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6bc87]">Proactive tax strategy</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Your taxes deserve a strategy. <span className="text-[#d6bc87]">Not just a return.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200">Plan ahead with a coordinated approach to your business, investments, retirement and major financial decisions.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/tax-opportunity-scan" className={primary}>Explore my tax opportunities</Link>
              <Link href="/pricing" className={secondary}>View services & pricing</Link>
            </div>
            <p className="mt-6 text-sm text-slate-300">Year-round tax strategy and preparation, with coordination alongside your existing professionals.</p>
          </div>
          <aside className="border border-[#d6bc87]/40 bg-[#192f49] p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d6bc87]">A year-round perspective</p>
            <h2 className="mt-5 font-serif text-3xl">Make informed decisions before deadlines arrive.</h2>
            <div className="mt-8 divide-y divide-white/15">
              {["Understand your current tax picture", "Evaluate strategies and tradeoffs", "Coordinate implementation with your CPA", "Review changes throughout the year"].map((item,i) => <div key={item} className="flex gap-4 py-4"><span className="text-[#d6bc87]">0{i+1}</span><span className="text-slate-100">{item}</span></div>)}
            </div>
          </aside>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806330]">Who we help</p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl sm:text-5xl">Complex finances deserve thoughtful planning.</h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-[#ded7ca] bg-[#ded7ca] sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(([number,title,description]) => <article key={title} className="bg-white p-7"><p className="text-sm text-[#806330]">{number}</p><h3 className="mt-5 font-serif text-2xl">{title}</h3><p className="mt-4 leading-7 text-slate-600">{description}</p></article>)}
        </div>
      </section>
      <section className="border-y border-[#ded7ca] bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806330]">Our approach</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">Strategy before filing. Coordination after planning.</h2><p className="mt-6 text-lg leading-8 text-slate-600">Tax preparation and proactive planning are complementary. We help identify decisions worth evaluating while there is still time to act.</p><Link href="/example-plans" className="mt-7 inline-block font-semibold underline underline-offset-4">Explore sample tax plans</Link></div>
          <div className="divide-y divide-[#ded7ca]">{steps.map(([title,description],i)=><div key={title} className="flex gap-5 py-5"><span className="text-[#806330]">0{i+1}</span><div><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 leading-7 text-slate-600">{description}</p></div></div>)}</div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806330]">Planning engagements</p>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Start with the right level of planning.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[["Focused review","From $995","Identify potential opportunities and receive a written summary."],["Comprehensive strategy","From $3,500","A deeper review of interconnected tax planning decisions."],["Advanced coordination","Custom scope","Complex transactions, entities and family planning needs."]].map(([title,price,description])=><article key={title} className="border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-2xl">{title}</h3><p className="mt-4 text-xl font-semibold">{price}</p><p className="mt-4 leading-7 text-slate-600">{description}</p><Link href="/pricing" className="mt-6 inline-block font-semibold underline underline-offset-4">View engagement details</Link></article>)}
        </div>
        <p className="mt-5 text-sm text-slate-600">Scope and fees are confirmed before engagement. Tax outcomes are not guaranteed.</p>
      </section>
<section id="memberships" className="bg-[#f8f5ef] px-6 py-20 text-[#10243b]"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#80602b]">Ongoing tax advisory</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">A tax strategy for every season.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">A one-time engagement establishes your strategy. Ongoing advisory helps monitor, refine and coordinate it as your circumstances change.</p><div className="mt-10 grid gap-5 lg:grid-cols-3"><article className="flex flex-col border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-3xl">Essential</h3><p className="mt-5 text-4xl font-semibold text-[#10243b]">$199<span className="text-base font-normal text-slate-600"> / month</span></p><ul className="mt-6 space-y-3 text-slate-700"><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Federal and one state individual tax return</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Annual tax strategy review</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Semiannual planning meetings</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Tax law updates</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Email support</li></ul><Link href="/tax-opportunity-scan" className="mt-8 block rounded-md bg-[#10243b] px-5 py-3 text-center font-semibold text-white">Discuss Essential</Link></article>
<article className="flex flex-col border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-3xl">Advanced</h3><p className="mt-5 text-4xl font-semibold text-[#10243b]">$499<span className="text-base font-normal text-slate-600"> / month</span></p><ul className="mt-6 space-y-3 text-slate-700"><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Federal and one state individual tax return; one business return within agreed scope</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Quarterly planning meetings</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Tax projections</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Strategy implementation coordination</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>CPA coordination</li></ul><Link href="/tax-opportunity-scan" className="mt-8 block rounded-md bg-[#10243b] px-5 py-3 text-center font-semibold text-white">Discuss Advanced</Link></article>
<article className="flex flex-col border border-[#ded7ca] bg-white p-8"><h3 className="font-serif text-3xl">Private Advisory</h3><p className="mt-5 text-4xl font-semibold text-[#10243b]">$999<span className="text-base font-normal text-slate-600"> / month</span></p><ul className="mt-6 space-y-3 text-slate-700"><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Individual and business tax preparation within agreed scope</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Complex business and personal tax planning</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Monthly strategy meetings</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Transaction planning</li><li className="flex gap-3"><span className="text-[#80602b]">✓</span>Priority access</li></ul><Link href="/tax-opportunity-scan" className="mt-8 block rounded-md bg-[#10243b] px-5 py-3 text-center font-semibold text-white">Discuss Private Advisory</Link></article></div><p className="mt-6 max-w-4xl text-sm leading-7 text-slate-600">Membership scope, any initial planning fees, billing terms and coordination with existing Unity Financial Planning Group services are confirmed in writing before engagement. Annual tax preparation is included in memberships within the agreed scope. Additional entities, states, complex filings, bookkeeping, amended returns and tax representation may require separate fees. Investment advisory services are not included unless separately agreed. Tax savings are not guaranteed.</p></div></section>
      <section className="bg-[#10243b] px-6 py-20 text-center text-white">
        <h2 className="mx-auto max-w-3xl font-serif text-4xl sm:text-5xl">Start planning before your next major decision.</h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-200">Explore potential planning opportunities with the Unity Tax Opportunity Assessment.</p>
        <div className="mt-8"><Link href="/tax-opportunity-scan" className={primary}>Start my assessment</Link></div>
      </section>
      <DisclosureFooter />
    </main>
  );
}
