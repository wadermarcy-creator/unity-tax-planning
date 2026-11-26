"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  Factory,
  FileText,
  LayoutDashboard,
  Megaphone,
  ScrollText,
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
        label: "Prospects",
        href: "/mission-control/prospects",
        icon: Users,
      },
      {
        label: "Clients",
        href: "/mission-control/clients",
        icon: UserRound,
      },
      {
        label: "Client Copilot",
        href: "/mission-control/client-copilot",
        icon: UserRound,
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Insights Publisher", href: "/mission-control/insights", icon: FileText },
      {
        label: "Campaign Watch",
        href: "/mission-control/campaign-watch",
        icon: BarChart3,
      },
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
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Reports",
        href: "/mission-control/reports",
        icon: BarChart3,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#10243b] px-4 py-6 lg:block">
      <Link
        href="/mission-control"
        className="mb-6 block rounded-[1.5rem] border border-[#d6bc87]/30 bg-white/5 p-5 transition hover:border-[#d6bc87]/60 hover:bg-white/10"
      >
        <Image src="/unity-tax-logo.PNG" alt="Unity Tax Planning" width={1664} height={928} className="mb-3 h-16 w-auto object-contain" />

        <h1 className="mt-2 font-serif text-2xl font-normal leading-none text-white">
          Mission Control
        </h1>

        <p className="mt-3 text-xs font-bold leading-5 text-slate-400">
          The operating system for proactive tax planning.
        </p>
      </Link>

      <nav className="space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#d6bc87]">
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
                    key={`${section.label}-${item.label}`}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                      isActive
                        ? "bg-[#d6bc87] text-[#10243b] shadow-sm"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
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
