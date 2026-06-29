import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getLandingPage } from "@/lib/landingPages";

type Props = {
  params: Promise<{
    slug: string;
  }>;
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
  faq: {
    question: string;
    answer: string;
  }[];
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

function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

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
  };
}

async function getCMSLandingPage(slug: string) {
  const supabase = getServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("marketing_landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return convertCMSPage(data as CMSLandingPageRecord);
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;

  const cmsPage = await getCMSLandingPage(slug);
  const staticPage = getLandingPage(slug);

  const page = cmsPage || staticPage;

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-400">
            {page.eyebrow}
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            {page.headline}
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            {page.subheadline}
          </p>

          <div className="mt-12 flex flex-wrap gap-5">
            <Link
              href="/tax-opportunity-scan"
              className="rounded-2xl bg-blue-600 px-8 py-5 text-lg font-black text-white transition hover:bg-blue-500"
            >
              {page.primaryCta}
            </Link>

            <Link
              href="/example-plans"
              className="rounded-2xl border border-slate-700 px-8 py-5 text-lg font-black text-white transition hover:border-blue-500"
            >
              View Sample Tax Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-10">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Who This Is For
            </p>

            <h2 className="mt-4 text-4xl font-black">{page.audience}</h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Every tax situation is different. These assessments are designed
              to identify planning opportunities that may deserve a deeper
              review before important tax decisions are made.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-black">Common Situations</h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {page.painPoints.map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8"
              >
                <div className="text-4xl">✓</div>

                <p className="mt-5 text-lg leading-8 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            Planning Areas
          </p>

          <h2 className="mt-4 text-4xl font-black">Topics Often Reviewed</h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {page.opportunities.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-lg font-black">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            Why Unity
          </p>

          <h2 className="mt-4 text-4xl font-black">
            A proactive planning approach.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {page.proofPoints.map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8"
              >
                <div className="text-5xl">★</div>

                <p className="mt-6 text-lg leading-8 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-500/30 bg-blue-600/10 px-10 py-16 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            Ready to Start?
          </p>

          <h2 className="mt-5 text-5xl font-black">
            Complete Your Tax Opportunity Assessment™
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            Your assessment helps identify areas that may deserve further
            review. If it appears that meaningful planning opportunities exist,
            we&apos;ll discuss whether a formal engagement makes sense.
          </p>

          <Link
            href="/tax-opportunity-scan"
            className="mt-10 inline-block rounded-2xl bg-blue-600 px-10 py-5 text-xl font-black text-white transition hover:bg-blue-500"
          >
            {page.primaryCta}
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-4xl font-black">Frequently Asked Questions</h2>

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
    </main>
  );
}