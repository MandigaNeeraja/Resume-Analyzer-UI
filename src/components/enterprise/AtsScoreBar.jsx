import { cn } from "../../lib/utils";

function getScoreStyle(score) {
  if (score >= 80) return { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 60) return { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" };
  return { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" };
}

export default function AtsScoreBar({ score, size = "md", showLabel = true, className = "" }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>;

  const rounded = Math.round(score);
  const style = getScoreStyle(rounded);

  if (size === "sm") {
    return (
      <div className={cn("flex items-center gap-2 min-w-[100px]", className)}>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", style.bar)} style={{ width: `${rounded}%` }} />
        </div>
        <span className={cn("text-xs font-semibold tabular-nums w-8 text-right", style.text)}>{rounded}%</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">ATS Match</span>
          <span className={cn("font-bold tabular-nums", style.text)}>{rounded}%</span>
        </div>
      )}
      <div className={cn("h-2 rounded-full overflow-hidden", style.bg)}>
        <div className={cn("h-full rounded-full transition-all", style.bar)} style={{ width: `${rounded}%` }} />
      </div>
    </div>
  );
}
