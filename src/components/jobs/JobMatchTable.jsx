import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import AtsScoreBar from "../enterprise/AtsScoreBar";
import SkillTags from "../enterprise/SkillTags";
import { cn } from "../../lib/utils";

function getInitials(name) {
  return (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function JobMatchTable({ matches, jobId }) {
  const navigate = useNavigate();

  if (matches.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600 mb-1 font-medium">No matched candidates yet</p>
        <p className="text-sm text-slate-400">Upload resumes above to start ATS matching for this job</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((match, index) => (
        <div
          key={match.id}
          className={cn(
            "flex flex-col lg:flex-row lg:items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-lg",
            "hover:border-brand-200 hover:shadow-[var(--shadow-elevated)] transition-all duration-200"
          )}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex flex-col items-center shrink-0 w-10">
              <span className="text-xs font-bold text-brand-600">#{index + 1}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-sm font-semibold mt-1">
                {getInitials(match.name)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">{match.name}</p>
                {match.workflowStatus && <Badge status={match.workflowStatus} />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{match.email}</p>
              {match.skillsMatched?.length > 0 && (
                <div className="mt-2">
                  <SkillTags skills={match.skillsMatched} max={5} />
                </div>
              )}
              {match.experience && (
                <p className="text-xs text-slate-400 mt-1">{match.experience}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="w-28">
              <AtsScoreBar score={match.matchScore} size="sm" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/jobs/${jobId}/candidates/${match.id}`)}
            >
              View <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
