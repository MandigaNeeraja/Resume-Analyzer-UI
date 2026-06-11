import { cn } from "../../lib/utils";

export function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-slate-200/80 shadow-[var(--shadow-card)]",
        hover && "hover:shadow-[var(--shadow-elevated)] hover:border-slate-300/80 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100", className)}>
      <div className="min-w-0">
        {title && <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={cn("px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-lg", className)}>
      {children}
    </div>
  );
}
