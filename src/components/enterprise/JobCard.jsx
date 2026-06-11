import { useNavigate } from "react-router-dom";
import { MapPin, Users, FileText, Pencil, Trash2, ChevronRight } from "lucide-react";
import JobStatusBadge from "../ui/JobStatusBadge";
import Button from "../ui/Button";
import SkillTags from "./SkillTags";
import { cn } from "../../lib/utils";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function JobCard({ job, canEdit, canDelete, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "group bg-white border border-slate-200/80 rounded-lg p-4 cursor-pointer",
        "hover:border-brand-200 hover:shadow-[var(--shadow-elevated)] transition-all duration-200"
      )}
      onClick={() => navigate(`/jobs/${job.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/jobs/${job.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
              {job.title}
            </h3>
            <JobStatusBadge status={job.status} />
          </div>
          <p className="text-sm text-slate-500">{job.designation || job.department}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
        {job.department && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-medium">
            {job.department}
          </span>
        )}
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />{job.location}
          </span>
        )}
        <span>{formatDate(job.createdOn)}</span>
      </div>

      {job.skills?.length > 0 && (
        <div className="mb-3">
          <SkillTags skills={job.skills} max={3} />
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />{job.resumeCount ?? 0} resumes
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <Users className="w-3.5 h-3.5" />{job.matchCount ?? 0} matched
          </span>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {canEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {canDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} title="Delete" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
