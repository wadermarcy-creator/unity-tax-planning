"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserRound,
} from "lucide-react";

const opportunityAreas = [
  "Tax return review",
  "Retirement tax strategy",
  "Investment tax efficiency",
  "Business or entity planning",
  "Charitable planning",
  "Estate coordination",
];

const nextSteps = [
  ["Assessment received", "Your responses have been submitted securely.", "complete"],
  ["Opportunity review started", "Your assessment is being reviewed for planning signals.", "complete"],
  ["Advisor review", "An advisor will validate which opportunities may apply.", "current"],
  ["Strategy conversation", "If there is a fit, we will discuss next steps together.", "upcoming"],
];

const resources = [
  ["Tax Planning Checklist", "A simple checklist of documents and topics to gather.", "/samples"],
  ["Sample Tax Plans", "Review examples of proactive planning opportunities.", "/samples"],
  ["How It Works", "See the process from assessment to strategy review.", "/how-it-works"],
];

function StatusIcon({ status }: { status: string }) {
  if (status === "complete") return <CheckCircle2 className="h-5 w-5 text-emerald-300" />;
  if (status === "current") return <Sparkles className="h-5 w-5 text-violet-300" />;
  return <CalendarDays className="h-5 w-5 text-slate-500" />;
}

export default function TaxOpportunityScanThankYouPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-300">
                Assessment Complete
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Your Tax Opportunity Scan has been received.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Based on your responses, there may be several areas worth
                reviewing for proactive tax planning. An advisor will validate
                the information before making any recommendations.
              </p>
            </div>

            <div className="rounded-[2rem] border border-emerald-500/30 bg-emerald-500/10 p-6 lg:min-w-[300px]">
              <div className="flex items-center gap-3">
                <Target className="h-7 w-7 text-emerald-300" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Preliminary Score
                  </p>
                  <p className="text-4xl font-black text-white">91/100</p>
                </div>
              </div>

              <div className="mt-6 h-4 overflow-hidden rounded-full border border-slate-800 bg-slate-950">
                <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400" />
              </div>

              <p className="mt-4 text-sm font-bold leading-6 text-emerald-100/80">
                High planning potential. This is not a guarantee of savings, but
                it indicates that your situation may warrant a deeper review.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-violet-300" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-300">
                  Opportunity Preview
                </p>
                <h2 className="mt-1 text-3xl font-black text-white">
                  Areas we may review
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {opportunityAreas.map((area) => (
                <div key={area} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                    <div>
                      <p className="font-black text-white">{area}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Your advisor will determine whether this area is
                        relevant after reviewing your details.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-blue-300" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                  Next Steps
                </p>
                <h2 className="mt-1 text-3xl font-black text-white">
                  What happens now
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {nextSteps.map(([title, description, status]) => (
                <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex gap-3">
                    <StatusIcon status={status} />
                    <div>
                      <p className="font-black text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
              <p className="font-black text-white">Estimated response</p>
              <p className="mt-2 text-sm leading-6 text-violet-100/80">
                We typically review new assessments within one business day.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
            <div className="flex items-center gap-3">
              <UserRound className="h-6 w-6 text-emerald-300" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
                  Advisor Review
                </p>
                <h2 className="mt-1 text-3xl font-black text-white">
                  Reviewed by Unity
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">
                  <UserRound className="h-8 w-8 text-blue-300" />
                </div>

                <div>
                  <p className="text-xl font-black text-white">Wade Marcy</p>
                  <p className="mt-1 text-sm font-bold text-slate-400">
                    Founder · Unity Tax Planning
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Your assessment will be reviewed to identify whether a
                    proactive planning conversation may be valuable.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <p className="text-sm font-bold text-slate-300">
                  No tax advice is provided until your situation is reviewed.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <Mail className="h-5 w-5 text-blue-300" />
                <p className="text-sm font-bold text-slate-300">
                  Watch your inbox for the next step.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-yellow-300" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
                  While You Wait
                </p>
                <h2 className="mt-1 text-3xl font-black text-white">
                  Helpful resources
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {resources.map(([title, description, href]) => (
                <Link key={title} href={href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/60">
                  <Download className="h-5 w-5 text-blue-300" />
                  <p className="mt-4 font-black text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex gap-3">
                <Star className="mt-1 h-5 w-5 text-violet-300" />
                <div>
                  <p className="font-black text-white">
                    Want to prepare for your review?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Gather your most recent tax return, investment account
                    statements, retirement account statements, business or rental
                    details, and estate documents if applicable.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-blue-500/20 bg-blue-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Ready for the next step?
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Your assessment is now in advisor review.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100/80">
                We will review your responses and determine whether a planning
                conversation may be appropriate.
              </p>
            </div>

            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-500">
              Return Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
