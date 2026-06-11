export const WORKFLOW_STATUS_COLORS = {
  Applied: "bg-slate-100 text-slate-700",
  HRScreening: "bg-blue-100 text-blue-800",
  SentToManager: "bg-indigo-100 text-indigo-800",
  InterviewScheduled: "bg-violet-100 text-violet-800",
  InterviewCompleted: "bg-purple-100 text-purple-800",
  TechnicalSelected: "bg-emerald-100 text-emerald-800",
  TechnicalRejected: "bg-red-100 text-red-800",
  Hired: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-700",
  OnHold: "bg-amber-100 text-amber-800",
  Shortlisted: "bg-cyan-100 text-cyan-800",
};

export const JOB_STATUS_COLORS = {
  Open: "bg-emerald-100 text-emerald-800",
  OnHold: "bg-amber-100 text-amber-800",
  Closed: "bg-slate-200 text-slate-700",
};

export const formatStatus = (status) =>
  status?.replace(/([A-Z])/g, " $1").trim() || "Unknown";

export const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
};

export const mapJobFromApi = (job) => ({
  id: job.jobId,
  title: job.jobTitle,
  designation: job.designation,
  department: job.department,
  location: job.location,
  employmentType: job.employmentType,
  experience: job.experienceRequired,
  description: job.description,
  skills: job.requiredSkills || [],
  createdOn: job.createdDate,
  createdByName: job.createdByName,
  resumeCount: job.resumeCount,
  matchCount: job.matchCount,
  status: job.status || "Open",
  updatedOn: job.updatedDate,
});

export const mapJobCandidateSummary = (s) => ({
  all: s.all ?? s.All ?? 0,
  shortlisted: s.shortlisted ?? s.Shortlisted ?? 0,
  onHold: s.onHold ?? s.OnHold ?? 0,
  rejected: s.rejected ?? s.Rejected ?? 0,
  sentToManager: s.sentToManager ?? s.SentToManager ?? 0,
  selected: s.selected ?? s.Selected ?? 0,
});

export const mapJobActivity = (a) => ({
  id: a.id ?? a.Id,
  jobId: a.jobId ?? a.JobId,
  activityType: a.activityType ?? a.ActivityType,
  description: a.description ?? a.Description,
  performedByName: a.performedByName ?? a.PerformedByName,
  createdAt: a.createdAt ?? a.CreatedAt,
});

export const mapCandidateFromApi = (c) => ({
  id: c.candidateId,
  jobId: c.jobId,
  jobTitle: c.jobTitle,
  name: c.fullName,
  email: c.email,
  phone: c.phone,
  linkedIn: c.linkedIn,
  experience: c.experience,
  skills: c.skills || [],
  atsScore: c.atsScore,
  status: c.status,
  hrRemarks: c.hrRemarks,
  managerRemarks: c.managerRemarks,
  managerAvailability: c.managerAvailability || [],
  createdDate: c.createdDate,
});

export const mapResumeFromApi = (r) => ({
  id: r.resumeId,
  candidateId: r.candidateId,
  fileName: r.fileName,
  candidateName: r.name,
  email: r.email,
  phone: r.phone,
  linkedIn: r.linkedIn,
  uploadedOn: r.uploadedOn,
  status: r.parseStatus,
  matchScore: r.matchScore,
  matchStatus: r.matchStatus,
  skills: r.skills || [],
});

export const mapMatchFromApi = (m) => ({
  id: m.candidateId,
  jobId: m.jobId,
  name: m.name,
  email: m.email,
  phone: m.phone,
  experience: m.experience,
  skillsMatched: m.skillsMatched || [],
  matchScore: Math.round(m.matchScore ?? 0),
  status: m.status,
  workflowStatus: m.workflowStatus ?? m.WorkflowStatus ?? "",
});

export const mapInterviewFromApi = (i) => ({
  id: i.interviewId,
  candidateId: i.candidateId,
  candidateName: i.candidateName,
  jobId: i.jobId,
  jobTitle: i.jobTitle,
  date: i.interviewDate?.split("T")[0],
  time: i.interviewTime?.slice?.(0, 5) || i.interviewTime,
  type: i.interviewType,
  meetingLink: i.meetingLink,
  status: i.status,
  scheduledByName: i.scheduledByName,
  createdDate: i.createdDate,
});

export const mapFeedbackFromApi = (f) => ({
  id: f.feedbackId ?? f.FeedbackId,
  interviewId: f.interviewId ?? f.InterviewId,
  candidateId: f.candidateId ?? f.CandidateId,
  managerName: f.managerName ?? f.ManagerName,
  technicalRating: f.technicalKnowledgeRating ?? f.TechnicalKnowledgeRating,
  problemSolvingRating: f.problemSolvingRating ?? f.ProblemSolvingRating,
  communicationRating: f.communicationRating ?? f.CommunicationRating,
  comments: f.comments ?? f.Comments,
  decision: f.decision ?? f.Decision,
  createdDate: f.createdDate ?? f.CreatedDate,
});

export const mapUserFromApi = (u) => ({
  id: u.userId,
  name: u.name,
  email: u.email,
  role: u.role,
  organization: u.organization,
});
