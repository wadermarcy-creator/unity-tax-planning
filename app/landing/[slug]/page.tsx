import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getLandingPage } from "@/lib/landingPages";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type FaqItem = {
  question: string;
  answer: string;
};

type CaseStudy = {
  title?: string;
  client?: string;
  summary?: string;
  strategies?: string[];
  estimated_tax_savings?: string;
  disclaimer?: string;
};

type LandingPageData = {
  slug: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  audience: string;
  painPoints: string[];
  opportunities: string[];
  proofPoints: string[];
  faq: FaqItem[];
  caseStudy?: CaseStudy | null;
};

type CMSLandingPageRecord = {
  slug: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta: string;
  audience: string;
  pain_points: string[] | null;
  opportunities: string[] | null;
  proof_points: string[] | null;
  is_active: boolean | null;
};

type CampaignRecord = {
  slug: string;
  status: string | null;
  landing_page_json: {
    slug?: string;
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: string;
    audience?: string;
    pain_points?: string[];
    opportunities?: string[];
    proof_points?: string[];
  } | null;
  case_study_json?: CaseStudy | null;
  faq_json?: FaqItem[] | null;
};

function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createClient(supabaseUrl, supabaseAnonKey);
}

function convertCMSPage(record: CMSLandingPageRecord): LandingPageData {
  return {
    slug: record.slug,
    eyebrow: record.eyebrow,
    headline: record.headline,
    subheadline: record.subheadline,
    primaryCta: record.primary_cta,
    audience: record.audience,
    painPoints: record.pain_points || [],
    opportunities: record.opportunities || [],
    proofPoints: record.proof_points || [],
    faq: [
      {
        question: "What happens after I complete the assessment?",
        answer:
          "Your information is reviewed to determine whether there may be meaningful planning opportunities. If appropriate, the next step is a conversation about scope, documents, timing, and pricing.",
      },
      {
        question: "Do I need to replace my CPA?",
        answer:
          "No. Unity Tax Planning is designed to identify planning opportunities and coordinate with your existing CPA or tax professional when appropriate.",
      },
    ],
    caseStudy: null,
  };
}

function convertCampaign(record: CampaignRecord): LandingPageData | null {
  const landing = record.landing_page_json;

  if (!landing) return null;

  return {
    slug: landing.slug || record.slug,
    eyebrow: landing.eyebrow || "Proactive Tax Planning",
    headline:
      landing.headline || "Identify Tax Planning Opportunities Worth Reviewing",
    subheadline:
      landing.subheadline ||
      "Start with a focused assessment designed to identify planning areas that may deserve a deeper review.",
    primaryCta:
      landing.primary_cta || "Start My Tax Opportunity Assessment",
    audience:
      landing.audience ||
      "Individuals and families seeking proactive tax planning",
    painPoints: landing.pain_points || [],
    opportunities: landing.opportunities || [],
    proofPoints: landing.proof_points || [],
    faq: record.faq_json || [
      {
        question: "Is this tax preparation?",
        answer:
          "No. Unity Tax Planning focuses on proactive planning and opportunity identification before decisions are finalized.",
      },
      {
        question: "Will this replace my CPA?",
        answer:
          "No. The goal is to identify planning areas and coordinate with your existing CPA or tax professional when appropriate.",
      },
    ],
    caseStudy: record.case_study_json || null,
  };
}

async function getCMSLandingPage(slug: string) {
  const supabase = getServerSupabaseClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("marketing_landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  return convertCMSPage(data as CMSLandingPageRecord);
}

async function getCampaignLandingPage(slug: string) {
  const supabase = getServerSupabaseClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .or(`slug.eq.${slug},landing_page_json->>slug.eq.${slug}`)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  return convertCampaign(data as CampaignRecord);
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;

  const campaignPage = await getCampaignLandingPage(slug);
  const cmsPage = await getCMSLandingPage(slug);
  const staticPage = getLandingPage(slug);

  const page = (campaignPage || cmsPage || staticPage) as LandingPageData | null;

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-400">
              {page.eyebrow}
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              {page.headline}
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
              {page.subheadline}
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/tax-opportunity-scan"
                className="rounded-2xl bg-blue-600 px-8 py-5 text-lg font-black text-white shadow-xl shadow-blue-950/40 transition hover:bg-blue-500"
              >
                {page.primaryCta}
              </Link>

              <Link
                href="/example-plans"
                className="rounded-2xl border border-slate-700 bg-slate-950/60 px-8 py-5 text-lg font-black text-white transition hover:border-blue-500"
              >
                View Sample Tax Plans
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-500/30 bg-slate-900/80 p-8 shadow-2xl shadow-blue-950/20">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Assessment First Approach
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Identify planning areas worth reviewing",
                "Prioritize opportunities before deadlines pass",
                "Coordinate strategy with your existing professionals",
                "Determine whether a formal engagement makes sense",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <p className="font-black text-white">✓ {item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-900/40 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-4">
          {[
            ["Year-Round", "Planning before decisions are finalized"],
            ["CPA Friendly", "Built to coordinate with tax professionals"],
            ["Strategy First", "Focused on planning, not generic filing"],
            ["Assessment Led", "Designed to qualify serious opportunities"],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-6"
            >
              <p className="text-2xl font-black text-white">{title}</p>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-10">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Who This Is For
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                {page.audience}
              </h2>
            </div>

            <div>
              <h2 className="text-4xl font-black">
                Proactive planning starts before tax season.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Every tax situation is different. These assessments are designed
                to help identify planning opportunities that may deserve a
                deeper review before important financial, business, investment,
                or retirement decisions are finalized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {page.painPoints.length > 0 && (
        <section className="bg-slate-900/40 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Common Situations
            </p>

            <h2 className="mt-4 text-4xl font-black">
              You may be here because one of these feels familiar.
            </h2>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {page.painPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8"
                >
                  <p className="text-lg font-bold leading-8 text-slate-300">
                    <span className="mr-3 text-blue-300">✓</span>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.opportunities.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Planning Areas
            </p>

            <h2 className="mt-4 text-4xl font-black">
              Topics often worth reviewing.
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {page.opportunities.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <p className="text-lg font-black">{item}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Review applicability, timing, documentation, and coordination
                    with your broader advisory team.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl font-black">
            A simple path from assessment to strategy.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              [
                "1",
                "Complete the Assessment",
                "Share the major facts, goals, and concerns driving your tax planning questions.",
              ],
              [
                "2",
                "Review Opportunities",
                "Unity reviews whether there may be meaningful planning areas worth discussing.",
              ],
              [
                "3",
                "Decide Next Steps",
                "If the fit is right, we discuss scope, pricing, documents, and coordination.",
              ],
            ].map(([number, title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black">
                  {number}
                </div>

                <h3 className="mt-6 text-2xl font-black">{title}</h3>

                <p className="mt-4 text-base leading-7 text-slate-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.caseStudy && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-10">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                Illustrative Client Story
              </p>

              <h2 className="mt-4 text-4xl font-black">
                {page.caseStudy.title || "A Planning Scenario Worth Reviewing"}
              </h2>

              {page.caseStudy.client && (
                <p className="mt-4 text-xl font-black text-blue-200">
                  {page.caseStudy.client}
                </p>
              )}

              {page.caseStudy.summary && (
                <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
                  {page.caseStudy.summary}
                </p>
              )}

              {page.caseStudy.strategies &&
                page.caseStudy.strategies.length > 0 && (
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {page.caseStudy.strategies.map((strategy) => (
                      <div
                        key={strategy}
                        className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                      >
                        <p className="font-black text-white">✓ {strategy}</p>
                      </div>
                    ))}
                  </div>
                )}

              {page.caseStudy.estimated_tax_savings && (
                <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                    Illustrative Estimated Tax Impact
                  </p>
                  <p className="mt-3 text-4xl font-black text-white">
                    {page.caseStudy.estimated_tax_savings}
                  </p>
                </div>
              )}

              <p className="mt-6 text-sm leading-6 text-slate-500">
                {page.caseStudy.disclaimer ||
                  "Illustrative example only. Results will vary."}
              </p>
            </div>
          </div>
        </section>
      )}

      {page.proofPoints.length > 0 && (
        <section className="bg-slate-900/40 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Why Unity
            </p>

            <h2 className="mt-4 text-4xl font-black">
              A planning-first process for serious prospects.
            </h2>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {page.proofPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8"
                >
                  <div className="text-5xl">★</div>

                  <p className="mt-6 text-lg leading-8 text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.faq.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-black">
              Frequently Asked Questions
            </h2>

            <div className="mt-10 space-y-6">
              {page.faq.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8"
                >
                  <h3 className="text-xl font-black">{faq.question}</h3>

                  <p className="mt-4 text-lg leading-8 text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-800 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-500/30 bg-blue-600/10 px-10 py-16 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            Ready to Start?
          </p>

          <h2 className="mt-5 text-5xl font-black">
            Complete Your Tax Opportunity Assessment™
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            Your assessment helps identify areas that may deserve further
            review. If meaningful planning opportunities appear to exist,
            we&apos;ll discuss whether a formal engagement makes sense.
          </p>

          <Link
            href="/tax-opportunity-scan"
            className="mt-10 inline-block rounded-2xl bg-blue-600 px-10 py-5 text-xl font-black text-white shadow-xl shadow-blue-950/40 transition hover:bg-blue-500"
          >
            {page.primaryCta}
          </Link>

          <p className="mx-auto mt-8 max-w-3xl text-xs leading-6 text-slate-500">
            This page is for informational purposes only and does not provide
            tax, legal, accounting, investment, or financial advice. No result,
            savings, or outcome is guaranteed.
          </p>
        </div>
      </section>
    </main>
  );
}