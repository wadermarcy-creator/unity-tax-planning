"use client";

import {
  ArrowRight,
  Calendar,
  FileText,
  Mail,
  PlayCircle,
  Sparkles,
  UserPlus,
} from "lucide-react";

type Action = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const actions: Action[] = [
  {
    title: "Prepare Meeting",
    description: "Generate a meeting agenda, talking points, and planning opportunities.",
    icon: <Calendar className="h-5 w-5" />,
    color: "bg-blue-600 hover:bg-blue-500",
  },
  {
    title: "Draft Follow-up Email",
    description: "Create a personalized email after the introductory meeting.",
    icon: <Mail className="h-5 w-5" />,
    color: "bg-emerald-600 hover:bg-emerald-500",
  },
  {
    title: "Generate Proposal",
    description: "Build a proposal tailored to this prospect's planning needs.",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-violet-600 hover:bg-violet-500",
  },
  {
    title: "Start Onboarding",
    description: "Prepare account opening, custodial paperwork, and onboarding checklist.",
    icon: <UserPlus className="h-5 w-5" />,
    color: "bg-orange-600 hover:bg-orange-500",
  },
];

export default function NextActionsCard() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-3">
        <PlayCircle className="h-6 w-6 text-emerald-300" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Next Actions
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Advisor Workflow
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="group w-full rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-600"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={`rounded-xl p-3 text-white ${action.color}`}>
                  {action.icon}
                </div>

                <div>
                  <p className="font-black text-white">{action.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {action.description}
                  </p>
                </div>
              </div>

              <ArrowRight className="mt-1 h-5 w-5 text-slate-500 transition group-hover:text-white" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-violet-300" />
          <div>
            <p className="font-black text-white">
              Future Copilot Automation
            </p>
            <p className="mt-2 text-sm leading-6 text-violet-100/80">
              Eventually these buttons won't just navigate—they'll execute AI
              workflows. Client Copilot will prepare meetings, generate proposals,
              draft emails, create onboarding tasks, and update your CRM
              automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
