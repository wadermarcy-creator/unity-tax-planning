"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Sparkles } from "lucide-react";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Header({
  title = "Mission Control",
  subtitle = "Here is what needs your attention today.",
}: HeaderProps) {
  const [todayLabel, setTodayLabel] = useState("");
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    setTodayLabel(getTodayLabel());
    setGreeting(getGreeting());
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#050816]/90 px-6 py-5 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-300">
              {todayLabel || "Mission Control"}
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              Live Workspace
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-3 text-base font-medium text-slate-400 sm:text-lg">
            {subtitle}
          </p>

          <p className="mt-2 text-sm font-bold text-blue-200">
            {greeting}, Wade.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-500 shadow-xl shadow-black/20 sm:w-80">
            <Search className="h-5 w-5" />
            <span className="text-sm font-bold">Search Mission Control...</span>
          </div>

          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-300 shadow-xl shadow-black/20 transition hover:border-blue-500 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 shadow-xl shadow-black/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
              W
            </div>

            <div>
              <p className="text-sm font-black text-white">Wade</p>
              <p className="text-xs font-bold text-slate-500">Founder</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}