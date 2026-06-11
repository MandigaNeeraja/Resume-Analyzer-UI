import { cn } from "../../lib/utils";

export default function TabBar({ tabs, activeTab, onChange, className = "" }) {
  return (
    <div className={cn("inline-flex flex-wrap gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-sm", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all",
              isActive
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-semibold tabular-nums",
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
