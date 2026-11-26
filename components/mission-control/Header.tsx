"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#10243b]/95 px-6 py-5 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d6bc87]">
              {todayLabel || "Mission Control"}
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#d6bc87]/40 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#d6bc87]">
              <Sparkles className="h-3.5 w-3.5" />
              Live Workspace
            </span>
          </div>

          <h1 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-3 text-base font-medium text-slate-400 sm:text-lg">
            {subtitle}
          </p>

          <p className="mt-2 text-sm font-bold text-[#d6bc87]">
            {greeting}, Wade.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 shadow-xl shadow-black/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6bc87] text-sm font-bold text-[#10243b]">
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