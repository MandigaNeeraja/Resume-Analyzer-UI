import { cn } from "../../lib/utils";

export default function SkillTags({ skills = [], max = 4, size = "sm", className = "" }) {
  if (!skills.length) return <span className="text-xs text-slate-400">—</span>;

  const visible = skills.slice(0, max);
  const remaining = skills.length - max;

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visible.map((s) => (
        <span
          key={s}
          className={cn(
            "inline-flex font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/60",
            sizeClass
          )}
        >
          {s}
        </span>
      ))}
      {remaining > 0 && (
        <span className={cn("inline-flex font-medium rounded-md bg-brand-50 text-brand-700 border border-brand-100", sizeClass)}>
          +{remaining}
        </span>
      )}
    </div>
  );
}
