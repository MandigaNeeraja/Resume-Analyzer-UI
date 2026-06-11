const COUNTERS = [
  { key: "all", label: "All" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "onHold", label: "On Hold" },
  { key: "rejected", label: "Rejected" },
  { key: "sentToManager", label: "Sent To Manager" },
  { key: "selected", label: "Selected" },
];

export default function JobCandidateCounters({ summary, active, onChange }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {COUNTERS.map(({ key, label }) => {
        const count = summary[key] ?? 0;
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange?.(key)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              isActive
                ? "border-primary-500 bg-primary-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-primary-200"
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </button>
        );
      })}
    </div>
  );
}
