import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { cn } from "../../lib/utils";

function getInitials(name) {
  return (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function InterviewCard({ interview, canSchedule, onComplete }) {
  const isScheduled = interview.status === "Scheduled";

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-lg",
      "hover:border-brand-200 hover:shadow-[var(--shadow-elevated)] transition-all duration-200"
    )}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {getInitials(interview.candidateName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">{interview.candidateName}</p>
            <Badge status={isScheduled ? "InterviewScheduled" : "InterviewCompleted"} />
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{interview.jobTitle}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />{interview.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{interview.time}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
              {interview.type?.replace(/([A-Z])/g, " $1").trim()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {interview.meetingLink && isScheduled && (
          <a href={interview.meetingLink} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <Video className="w-3.5 h-3.5" /> Join <ExternalLink className="w-3 h-3 opacity-60" />
            </Button>
          </a>
        )}
        {canSchedule && isScheduled && (
          <Button size="sm" variant="secondary" onClick={() => onComplete(interview.id)}>Complete</Button>
        )}
      </div>
    </div>
  );
}
