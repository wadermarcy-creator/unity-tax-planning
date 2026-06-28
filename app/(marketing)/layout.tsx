import Link from "next/link";

const navItems = [
  { label: "Situations", href: "/situations" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Samples", href: "/example-plans" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#080d1d]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/30">
            U
          </div>

          <div>
            <div className="text-xl font-extrabold tracking-tight text-white">
              UNITY
            </div>
            <div className="text-xs font-bold tracking-[0.28em] text-blue-300">
              TAX PLANNING
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/tax-opportunity-scan"
          className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#030817] shadow-sm transition hover:bg-blue-100"
        >
          Start My Assessment
        </Link>
      </div>
    </header>
  );
}