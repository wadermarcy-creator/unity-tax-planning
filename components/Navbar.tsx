"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Samples", href: "/example-plans" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-white/10 bg-[#10243b]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
              <Image src="/unity-tax-logo.PNG" alt="Unity Tax Planning" width={1664} height={928} className="h-16 w-auto object-contain sm:h-20" />
            </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/tax-opportunity-scan"
          className="hidden rounded-full bg-[#d6bc87] px-6 py-3 text-sm font-bold text-[#030817] shadow-sm transition hover:bg-[#f8f5ef] md:inline-flex"
        >
          Start My Assessment
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-6 rounded-full bg-white" />
            <span className="block h-0.5 w-6 rounded-full bg-white" />
            <span className="block h-0.5 w-6 rounded-full bg-white" />
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#10243b] px-6 py-5 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-bold text-white transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/tax-opportunity-scan"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#d6bc87] px-5 py-4 text-center text-base font-black text-[#10243b] shadow-lg shadow-black/10 transition hover:bg-[#e5d2ab]"
            >
              Start My Assessment
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}