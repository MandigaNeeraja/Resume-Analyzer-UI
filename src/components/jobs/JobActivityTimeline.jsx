const formatDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function JobActivityTimeline({ activities = [] }) {
  if (!activities.length) {
    return <p className="text-center text-slate-400 py-6 text-sm">No activity recorded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((a) => (
        <div key={a.id} className="flex gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                {a.activityType}
              </span>
              <span className="text-xs text-slate-400">{formatDate(a.createdAt)}</span>
            </div>
            <p className="text-sm text-slate-700 mt-0.5">{a.description}</p>
            {a.performedByName && (
              <p className="text-xs text-slate-400 mt-0.5">by {a.performedByName}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
