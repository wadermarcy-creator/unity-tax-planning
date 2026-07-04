"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Brain,
  BriefcaseBusiness,
  CheckSquare,
  Factory,
  FileText,
  LayoutDashboard,
  Megaphone,
  ScrollText,
  Settings,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

const navSections = [
  {
    label: "Home",
    items: [
      {
        label: "Morning Brief",
        href: "/mission-control",
        icon: LayoutDashboard,
      },
      {
        label: "Pipeline",
        href: "/mission-control/pipeline",
        icon: BriefcaseBusiness,
      },
      {
        label: "Revenue Intelligence",
        href: "/mission-control/revenue",
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "Leads",
    items: [
      {
        label: "Assessments",
        href: "/mission-control/assessments",
        icon: FileText,
      },
      {
        label: "Client Copilot",
        href: "/mission-control/client-copilot",
        icon: UserRound,
      },
      {
        label: "Clients",
        href: "/mission-control/clients",
        icon: Users,
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        label: "Campaigns",
        href: "/mission-control/marketing/campaigns",
        icon: Megaphone,
      },
      {
        label: "Campaign Factory",
        href: "/mission-control/marketing/campaign-factory",
        icon: Factory,
      },
      {
        label: "Landing Pages",
        href: "/mission-control/marketing/landing-pages",
        icon: ScrollText,
      },
    ],
  },
  {
    label: "AI Tools",
    items: [
      {
        label: "Opportunity Engine",
        href: "/mission-control/opportunity-engine",
        icon: Brain,
      },
      {
        label: "Strategy Builder",
        href: "/mission-control/strategy-builder",
        icon: ScrollText,
      },
      {
        label: "AI",
        href: "/mission-control/ai",
        icon: Bot,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Tasks",
        href: "/mission-control/tasks",
        icon: CheckSquare,
      },
      {
        label: "Reports",
        href: "/mission-control/reports",
        icon: BarChart3,
      },
      {
        label: "Settings",
        href: "/mission-control/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:block">
      <Link
        href="/mission-control"
        className="mb-6 block rounded-[1.5rem] border border-blue-500/30 bg-blue-500/10 p-5"
      >
        <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
          Unity
        </p>

        <h1 className="mt-2 text-2xl font-black leading-none text-white">
          Mission
          <br />
          Control
        </h1>

        <p className="mt-3 text-xs font-bold leading-5 text-slate-400">
          The operating system for proactive tax planning.
        </p>
      </Link>

      <nav className="space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[0.68rem] font-black uppercase tracking-[0.24em] text-slate-600">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/mission-control"
                    ? pathname === "/mission-control"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
