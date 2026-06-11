import { cn } from "../../lib/utils";

const STYLES = {
  Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OnHold: "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function JobStatusBadge({ status = "Open", className = "" }) {
  const label = status?.replace(/([A-Z])/g, " $1").trim() || "Open";
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide border",
        STYLES[status] || STYLES.Open,
        className
      )}
    >
      {label}
    </span>
  );
}
