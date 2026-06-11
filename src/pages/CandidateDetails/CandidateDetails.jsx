import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getCandidate, getCandidateMatch, sendToManager, shortlistCandidate,
  rejectCandidate, holdCandidate, resumeToScreening, resumeToManagerReview,
  approveInterview, technicalSelect, technicalReject, hireCandidate,
} from "../../api/candidates";
import { getFeedbackByCandidate } from "../../api/interviewFeedback";
import { getJob } from "../../api/jobs";
import { mapCandidateFromApi, mapMatchFromApi, mapFeedbackFromApi, mapJobFromApi, getScoreColor } from "../../utils/mappers";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { Textarea } from "../../components/ui/Input";
import { refreshNotifications } from "../../utils/notificationEvents";
import AvailabilitySlotsEditor, { AvailabilitySlotsList } from "../../components/candidates/AvailabilitySlotsEditor";

export default function CandidateDetails() {
  const { id, jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [match, setMatch] = useState(null);
  const [job, setJob] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [slots, setSlots] = useState([{ date: "", startTime: "09:00", endTime: "10:00" }]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const c = await getCandidate(id);
      setCandidate(mapCandidateFromApi(c));
      if (jobId || c.jobId) {
        const jId = jobId || c.jobId;
        const [m, j, f] = await Promise.all([
          getCandidateMatch(id, jId).catch(() => null),
          getJob(jId).catch(() => null),
          getFeedbackByCandidate(id).catch(() => []),
        ]);
        if (m) setMatch(mapMatchFromApi(m));
        if (j) setJob(mapJobFromApi(j));
        setFeedback((f || []).map(mapFeedbackFromApi));
      }
    } catch {
      toast.error("Failed to load candidate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id, jobId]);

  const action = async (fn, msg, payload = remarks) => {
    try {
      await fn(id, payload);
      toast.success(msg);
      load();
      refreshNotifications();
    } catch (err) {
      toast.error(err.response?.data || "Action failed");
    }
  };

  const handleApproveInterview = async () => {
    if (!slots.some((s) => s.date && s.startTime && s.endTime)) {
      toast.error("Add at least one complete availability slot");
      return;
    }
    await action(approveInterview, "Interview approved", {
      remarks,
      availabilitySlots: slots.filter((s) => s.date && s.startTime && s.endTime),
    });
  };

  if (loading) return <Spinner />;
  if (!candidate) return <div className="text-center py-12"><Button onClick={() => navigate(-1)}>Go Back</Button></div>;

  const role = user?.role;
  const isHr = ["Admin", "HR"].includes(role);
  const isManager = ["Admin", "Manager"].includes(role);
  const showHrActions = isHr && ["HRScreening", "Shortlisted", "Applied"].includes(candidate.status);
  const showHrOnHold = isHr && candidate.status === "OnHold";
  const showManagerApprove = isManager && candidate.status === "SentToManager";
  const showManagerDecision = ["Admin", "Manager"].includes(role) &&
    ["InterviewCompleted", "InterviewScheduled"].includes(candidate.status);
  const showHire = ["Admin", "HR"].includes(role) && candidate.status === "TechnicalSelected";

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title={candidate.name} subtitle={candidate.email} />
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={candidate.status} />
                {candidate.atsScore != null && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold bg-slate-100 ${getScoreColor(candidate.atsScore)}`}>
                    ATS {Math.round(candidate.atsScore)}%
                  </span>
                )}
                {candidate.linkedIn && (
                  <a
                    href={candidate.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    View LinkedIn Profile
                  </a>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Info label="Phone" value={candidate.phone} />
                <Info label="Experience" value={candidate.experience} />
                <Info label="Job" value={candidate.jobTitle || job?.title} />
                <Info label="LinkedIn" value={candidate.linkedIn || "—"} />
              </div>
              {candidate.hrRemarks && <Info label="HR Remarks" value={candidate.hrRemarks} />}
              {candidate.managerRemarks && <Info label="Manager Remarks" value={candidate.managerRemarks} />}
              {candidate.managerAvailability?.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-400 mb-2">Manager Availability</p>
                  <AvailabilitySlotsList slots={candidate.managerAvailability} />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((s) => (
                    <span key={s} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {match && (
            <Card>
              <CardHeader title="ATS Match Analysis" subtitle={`${match.matchScore}% match score`} />
              <CardBody>
                <p className="text-sm text-slate-600 mb-3">Matched skills:</p>
                <div className="flex flex-wrap gap-2">
                  {match.skillsMatched.map((s) => (
                    <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">{s}</span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {feedback.length > 0 && (
            <Card>
              <CardHeader title="Interview Feedback" />
              <CardBody className="space-y-4">
                {feedback.map((f) => (
                  <div key={f.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-sm">{f.managerName}</span>
                      <span className={`text-xs font-semibold ${f.decision === "Selected" ? "text-emerald-600" : "text-red-600"}`}>{f.decision}</span>
                    </div>
                    <p className="text-sm text-slate-600">{f.comments}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Tech: {f.technicalRating}/5 · Problem Solving: {f.problemSolvingRating}/5 · Communication: {f.communicationRating}/5
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader title="Workflow Actions" />
            <CardBody className="space-y-4">
              <Textarea label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} />
              {showHrActions && (
                <div className="space-y-2">
                  <Button className="w-full" variant="secondary" onClick={() => action(shortlistCandidate, "Candidate shortlisted")}>Shortlist</Button>
                  <Button className="w-full" onClick={() => action(sendToManager, "Sent to manager")}>Send to Manager</Button>
                  <Button className="w-full" variant="secondary" onClick={() => action(holdCandidate, "Put on hold")}>Put On Hold</Button>
                  <Button className="w-full" variant="danger" onClick={() => action(rejectCandidate, "Candidate rejected")}>Reject</Button>
                </div>
              )}
              {showHrOnHold && (
                <Button className="w-full" onClick={() => action(resumeToScreening, "Resumed to screening")}>Resume Screening</Button>
              )}
              {showManagerApprove && (
                <>
                  <div className="space-y-2 mb-4">
                    <Button className="w-full" variant="secondary" onClick={() => action(holdCandidate, "Put on hold")}>Put On Hold</Button>
                    <Button className="w-full" variant="danger" onClick={() => action(rejectCandidate, "Candidate rejected")}>Reject</Button>
                  </div>
                  <AvailabilitySlotsEditor slots={slots} onChange={setSlots} />
                  <Button className="w-full" onClick={handleApproveInterview}>Approve Interview</Button>
                </>
              )}
              {showManagerDecision && (
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => action(technicalSelect, "Technically selected")}>Technical Select</Button>
                  <Button className="w-full" variant="danger" onClick={() => action(technicalReject, "Technically rejected")}>Technical Reject</Button>
                </div>
              )}
              {showHire && (
                <Button className="w-full" onClick={() => action(hireCandidate, "Candidate hired!")}>Mark as Hired</Button>
              )}
              {isManager && candidate.status === "OnHold" && (
                <Button className="w-full" onClick={() => action(resumeToManagerReview, "Returned to manager review")}>Resume Manager Review</Button>
              )}
              {!showHrActions && !showHrOnHold && !showManagerApprove && !showManagerDecision && !showHire && !(isManager && candidate.status === "OnHold") && (
                <p className="text-sm text-slate-400 text-center py-4">No actions available for current status.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}
