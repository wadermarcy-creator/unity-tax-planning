"use client";

import Link from "next/link";

type UnityCardProps = {
  children: React.ReactNode;
  className?: string;
};

type UnityCardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

type UnityPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

type UnityButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "ai" | "success" | "danger";
  className?: string;
};

type UnityMetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ReactNode;
  tone?: "blue" | "violet" | "emerald" | "yellow" | "red" | "slate";
};

type UnityBadgeProps = {
  children: React.ReactNode;
  tone?: "blue" | "violet" | "emerald" | "yellow" | "red" | "slate";
};

type UnityEmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

type UnityAIInsightProps = {
  title?: string;
  children: React.ReactNode;
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function toneClasses(tone: NonNullable<UnityMetricCardProps["tone"]>) {
  const tones = {
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    yellow: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
    slate: "border-slate-700 bg-slate-900 text-slate-300",
  };

  return tones[tone];
}

function buttonClasses(variant: NonNullable<UnityButtonProps["variant"]>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500",
    secondary:
      "border border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white",
    ghost: "text-slate-400 hover:text-white",
    ai: "border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20",
    success:
      "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
    danger:
      "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  };

  return cx(base, variants[variant]);
}

export function UnityCard({ children, className }: UnityCardProps) {
  return (
    <section
      className={cx(
        "rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function UnityCardHeader({
  eyebrow,
  title,
  description,
  action,
}: UnityCardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {eyebrow && (
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function UnityPageHero({
  eyebrow,
  title,
  description,
  action,
}: UnityPageHeroProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          {eyebrow && (
            <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}

export function UnityButton({
  children,
  onClick,
  href,
  type = "button",
  disabled = false,
  variant = "primary",
  className,
}: UnityButtonProps) {
  const classes = cx(buttonClasses(variant), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function UnityMetricCard({
  label,
  value,
  detail,
  icon,
  tone = "blue",
}: UnityMetricCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black text-white">{value}</p>

          {detail && (
            <p className="mt-2 text-sm font-bold text-slate-400">{detail}</p>
          )}
        </div>

        {icon && (
          <div className={cx("rounded-2xl border p-4", toneClasses(tone))}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function UnityBadge({ children, tone = "blue" }: UnityBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em]",
        toneClasses(tone),
      )}
    >
      {children}
    </span>
  );
}

export function UnityEmptyState({
  title,
  description,
  action,
}: UnityEmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-950 p-8 text-center">
      <p className="text-lg font-black text-white">{title}</p>

      {description && (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function UnityAIInsight({
  title = "AI Recommendation",
  children,
}: UnityAIInsightProps) {
  return (
    <div className="rounded-[2rem] border border-violet-500/20 bg-violet-500/10 p-5">
      <p className="font-black text-white">{title}</p>
      <div className="mt-2 text-sm leading-7 text-violet-100/80">
        {children}
      </div>
    </div>
  );
}

export function UnityDivider() {
  return <div className="h-px w-full bg-slate-800" />;
}
