"use client";

import { Mail } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type EmailTabProps = {
  campaign: MarketingCampaign;
};

export default function EmailTab({ campaign }: EmailTabProps) {
  const emails = campaign.email_json || [];

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Email Sequence
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Follow-Up Email Assets
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Review the AI-generated follow-up sequence for this campaign. These
            emails can be used after a prospect completes the Tax Opportunity
            Assessment.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Mail className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          {emails.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-bold text-slate-400">
                No email sequence has been generated yet.
              </p>
            </div>
          ) : (
            emails.map((email, index) => (
              <article
                key={`${email.subject}-${index}`}
                className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                  Email {index + 1}
                </p>

                <h3 className="mt-3 text-2xl font-black text-white">
                  {email.subject}
                </h3>

                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-300">
                    {email.body}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Sequence Summary
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Emails Generated
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {emails.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Intended Use
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-300">
                  Nurture prospects after assessment submission and encourage
                  qualified prospects to schedule a strategy conversation.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Future Upgrades
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Edit subject lines and body copy.</p>
              <p>Copy individual emails to clipboard.</p>
              <p>Generate alternate versions with AI.</p>
              <p>Connect to email automation later.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}