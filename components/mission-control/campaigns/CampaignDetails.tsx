"use client";

import Link from "next/link";
import type { GeneratedCampaign } from "@/components/mission-control/campaigns/types";

type CampaignDetailsProps = {
  generatedCampaign: GeneratedCampaign | null;
  saveCampaign: () => Promise<void>;
  publishCampaign: () => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
};

export default function CampaignDetails({
  generatedCampaign,
  saveCampaign,
  publishCampaign,
  isSaving,
  isPublishing,
}: CampaignDetailsProps) {
  if (!generatedCampaign) {
    return (
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
          Campaign Preview
        </p>

        <h2 className="mt-3 text-2xl font-black text-white">
          Generate a campaign to preview assets.
        </h2>

        <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
          Once generated, you&apos;ll see the landing page, Google Ads assets,
          SEO metadata, keywords, blog outline, social posts, and email sequence
          here.
        </p>
      </section>
    );
  }

  const publicUrl = `/landing/${generatedCampaign.landing_page.slug}`;

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-7 shadow-2xl shadow-blue-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Generated Campaign
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {generatedCampaign.name}
            </h2>

            <Link
              href={publicUrl}
              className="mt-3 inline-block text-sm font-bold text-blue-200 hover:text-white"
            >
              {publicUrl}
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={saveCampaign}
              disabled={isSaving || isPublishing}
              className="rounded-2xl border border-slate-700 px-6 py-4 text-sm font-black text-slate-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving Draft..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={publishCampaign}
              disabled={isSaving || isPublishing}
              className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isPublishing ? "Publishing..." : "Publish Campaign"}
            </button>
          </div>
        </div>
      </div>

      <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
          Landing Page
        </p>

        <h3 className="mt-3 text-2xl font-black text-white">
          {generatedCampaign.landing_page.headline}
        </h3>

        <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
          {generatedCampaign.landing_page.subheadline}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {generatedCampaign.landing_page.pain_points.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold leading-6 text-slate-300"
            >
              {item}
            </p>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-300">
          Google Ads
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 font-black text-white">Headlines</h4>
            <div className="space-y-2">
              {generatedCampaign.google_ads.headlines.map((headline) => (
                <p
                  key={headline}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm font-bold text-slate-300"
                >
                  {headline}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-black text-white">Descriptions</h4>
            <div className="space-y-2">
              {generatedCampaign.google_ads.descriptions.map((description) => (
                <p
                  key={description}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm font-bold leading-6 text-slate-300"
                >
                  {description}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
          SEO + Keywords
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              SEO Title
            </p>
            <p className="mt-2 font-bold text-white">
              {generatedCampaign.seo.title}
            </p>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Meta Description
            </p>
            <p className="mt-2 text-sm font-medium leading-7 text-slate-300">
              {generatedCampaign.seo.meta_description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Primary Keywords
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {generatedCampaign.keywords.primary_keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-300"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Negative Keywords
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {generatedCampaign.keywords.negative_keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-black text-red-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
          Content + Follow Up
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h4 className="font-black text-white">
              {generatedCampaign.blog.title}
            </h4>

            <div className="mt-4 space-y-2">
              {generatedCampaign.blog.outline.map((item) => (
                <p
                  key={item}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-bold text-slate-300"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h4 className="font-black text-white">Email Sequence</h4>

            <div className="mt-4 space-y-3">
              {generatedCampaign.email_sequence.map((email, index) => (
                <div
                  key={`${email.subject}-${index}`}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                >
                  <p className="text-sm font-black text-white">
                    {email.subject}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                    {email.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}