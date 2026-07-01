"use client";

import { Mail } from "lucide-react";
import type { MarketingCampaign } from "@/components/mission-control/campaigns/types";

type EmailFormItem = {
  subject: string;
  body: string;
};

type EmailTabProps = {
  campaign: MarketingCampaign;
  emailForm: EmailFormItem[];
  setEmailForm: React.Dispatch<React.SetStateAction<EmailFormItem[]>>;
  isSavingEmail: boolean;
  emailMessage: string;
  onSave: () => void;
};

function updateEmailValue(
  emails: EmailFormItem[],
  index: number,
  field: keyof EmailFormItem,
  value: string,
) {
  return emails.map((email, currentIndex) =>
    currentIndex === index ? { ...email, [field]: value } : email,
  );
}

export default function EmailTab({
  campaign,
  emailForm,
  setEmailForm,
  isSavingEmail,
  emailMessage,
  onSave,
}: EmailTabProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Email Editor
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Follow-Up Email Sequence
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Edit the follow-up email sequence for this campaign. These emails
            can be used after a prospect completes the Tax Opportunity
            Assessment.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-300">
          <Mail className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          {emailForm.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-bold text-slate-400">
                No email sequence has been generated yet.
              </p>
            </div>
          ) : (
            emailForm.map((email, index) => (
              <article
                key={`email-editor-${index}`}
                className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                  Email {index + 1}
                </p>

                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Subject
                  </span>

                  <input
                    value={email.subject}
                    onChange={(event) =>
                      setEmailForm((current) =>
                        updateEmailValue(
                          current,
                          index,
                          "subject",
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm font-bold text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Body
                  </span>

                  <textarea
                    value={email.body}
                    onChange={(event) =>
                      setEmailForm((current) =>
                        updateEmailValue(
                          current,
                          index,
                          "body",
                          event.target.value,
                        ),
                      )
                    }
                    rows={10}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm font-bold leading-7 text-white outline-none focus:border-blue-500"
                  />
                </label>
              </article>
            ))
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={isSavingEmail}
            className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isSavingEmail ? "Saving Emails..." : "Save Email Sequence"}
          </button>

          {emailMessage && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
              {emailMessage}
            </p>
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
                  Emails
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {emailForm.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Campaign
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-300">
                  {campaign.name}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Next Upgrades
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <p>Copy individual emails to clipboard.</p>
              <p>Rewrite subject lines with AI.</p>
              <p>Send automatic confirmation emails after assessment.</p>
              <p>Connect to an email automation provider later.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
