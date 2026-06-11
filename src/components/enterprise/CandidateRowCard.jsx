import { Link } from "react-router-dom";
import { ChevronRight, Mail, Briefcase } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import AtsScoreBar from "./AtsScoreBar";
import SkillTags from "./SkillTags";
import { cn } from "../../lib/utils";

function getInitials(name) {
  return (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function CandidateRowCard({
  candidate,
  actions,
  className = "",
  compact = false,
}) {
  const detailUrl = candidate.jobId
    ? `/jobs/${candidate.jobId}/candidates/${candidate.id}`
    : `/candidate/${candidate.id}`;

  return (
    <div
      className={cn(
        "group flex flex-col lg:flex-row lg:items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-lg",
        "hover:border-brand-200 hover:shadow-[var(--shadow-elevated)] transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {getInitials(candidate.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900 truncate">{candidate.name}</p>
            <Badge status={candidate.status} />
          </div>
          {!compact && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
              {candidate.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" />{candidate.email}
                </span>
              )}
              {candidate.jobTitle && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />{candidate.jobTitle}
                </span>
              )}
            </div>
          )}
          {!compact && candidate.skills?.length > 0 && (
            <div className="mt-2">
              <SkillTags skills={candidate.skills} max={5} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 shrink-0">
        <div className="w-28">
          <AtsScoreBar score={candidate.atsScore} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <Link to={detailUrl}>
            <Button variant="outline" size="sm">
              View <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
