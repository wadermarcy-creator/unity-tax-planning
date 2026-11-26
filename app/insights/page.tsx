import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DisclosureFooter from "@/components/DisclosureFooter";
export const metadata: Metadata = {
 title: "Tax Strategy Insights",
 description: "Explore hypothetical tax planning scenarios for business owners, high-income families, investors and retirees.",
 alternates: { canonical: "/insights" },
 openGraph: { title: "Tax Strategy Insights | Unity Tax Planning", description: "Educational tax planning scenarios and strategies.", url: "/insights" }
};
const topics = [
 ["Business owners","Entity structure, retirement plans and business deductions","business-owner"],
 ["Retirement","Roth conversions, distributions and retirement income","pre-retiree-large-iras"],
 ["High-income households","Income timing and coordinated tax planning","high-income-family"],
 ["Major transactions","Capital gains and liquidity event planning","large-capital-gain"],
 ["Investments","Portfolio tax efficiency and asset location","taxable-investment-account"],
 ["Charitable giving","Tax considerations for philanthropic decisions","charitable-giving"]
];
export default function Insights() {
 return <main className="min-h-screen bg-[#f8f5ef] text-[#10243b]"><Navbar/>
 <section className="bg-[#10243b] px-6 py-20 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6bc87]">Tax Strategy Insights</p><h1 className="mt-5 max-w-4xl font-serif text-5xl sm:text-6xl">Real questions. Hypothetical scenarios. Thoughtful strategies.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Explore the decisions, assumptions and tradeoffs behind proactive tax planning.</p></div></section>
 <section className="mx-auto max-w-7xl px-6 py-14"><p className="text-xs font-semibold uppercase tracking-wider text-[#80602b]">Explore our existing sample plans</p><h2 className="mt-3 font-serif text-4xl">Find a scenario relevant to you.</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{topics.map(([title,description,slug])=><article key={slug} className="border border-[#ded7ca] bg-white p-7"><h3 className="font-serif text-2xl">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p><Link href={"/example-plans/"+slug} className="mt-5 inline-block font-semibold underline underline-offset-4">Explore sample plan</Link></article>)}</div><p className="mt-6 text-sm leading-7 text-slate-600">Examples are hypothetical and educational, not individualized tax advice or guarantees of tax savings.</p></section>
 <section className="bg-[#10243b] px-6 py-14 text-center text-white"><h2 className="font-serif text-3xl">What could proactive planning mean for you?</h2><Link href="/tax-opportunity-scan" className="mt-6 inline-block rounded-md bg-[#d6bc87] px-6 py-3 font-semibold text-[#10243b]">Start your complimentary assessment</Link></section><DisclosureFooter/></main>
}