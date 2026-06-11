const STATUS_STYLES = {
  Parsed: "bg-emerald-100 text-emerald-700",
  Failed: "bg-red-100 text-red-700",
  Shortlisted: "bg-emerald-100 text-emerald-700",
  Review: "bg-amber-100 text-amber-700",
  "Not Matched": "bg-red-100 text-red-600",
  Pending: "bg-slate-100 text-slate-600",
};

export default function ParseStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {status || "Unknown"}
    </span>
  );
}
