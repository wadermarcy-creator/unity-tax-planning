type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  trend?: string;
  tone?: "blue" | "green" | "purple" | "orange" | "red" | "slate";
};

const toneStyles = {
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  purple: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  orange: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  red: "border-red-500/30 bg-red-500/10 text-red-300",
  slate: "border-slate-700 bg-slate-900 text-slate-300",
};

export default function StatCard({
  label,
  value,
  detail,
  trend,
  tone = "blue",
}: StatCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>

          <p className="mt-4 text-4xl font-black tracking-tight text-white">
            {value}
          </p>

          {detail && (
            <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
              {detail}
            </p>
          )}
        </div>

        {trend && (
          <div
            className={`rounded-full border px-3 py-1 text-xs font-black ${toneStyles[tone]}`}
          >
            {trend}
          </div>
        )}
      </div>
    </article>
  );
}