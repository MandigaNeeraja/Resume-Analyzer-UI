import { cn } from "../../lib/utils";

const accents = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  brand: { bg: "bg-brand-50", icon: "text-brand-600", border: "border-brand-100" },
  green: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100" },
  red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100" },
};

export default function StatsCard({ title, value, icon, accent = "brand", trend, className = "" }) {
  const a = accents[accent] || accents.brand;

  return (
    <div className={cn("bg-white rounded-lg border border-slate-200/80 p-4 shadow-[var(--shadow-card)]", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{value ?? 0}</p>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        {icon && (
          <div className={cn("p-2.5 rounded-lg border shrink-0", a.bg, a.icon, a.border)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
