import { cn } from "../../lib/utils";

export default function PageHeader({ title, description, actions, className = "" }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5", className)}>
      <div className="min-w-0">
        {title && <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h2>}
        {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
