import { cn } from "../../lib/utils";
import { WORKFLOW_STATUS_COLORS, formatStatus } from "../../utils/mappers";

export default function Badge({ status, className = "" }) {
  const color = WORKFLOW_STATUS_COLORS[status] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border",
      color,
      className
    )}>
      {formatStatus(status)}
    </span>
  );
}
