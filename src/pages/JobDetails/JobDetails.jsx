import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Users, BarChart3 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getJob, deleteJob, closeJob, reopenJob, holdJob,
  getJobCandidateSummary, getJobActivity,
} from "../../api/jobs";
import { uploadResume, getResumesByJob, deleteResume } from "../../api/resumes";
import { getMatchesByJob } from "../../api/matches";
import {
  mapJobFromApi, mapResumeFromApi, mapMatchFromApi,
  mapJobCandidateSummary, mapJobActivity,
} from "../../utils/mappers";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StatsCard from "../../components/ui/StatsCard";
import Spinner from "../../components/ui/Spinner";
import JobStatusBadge from "../../components/ui/JobStatusBadge";
import ResumeUpload from "../../components/resumes/ResumeUpload";
import JobResumeTable from "../../components/jobs/JobResumeTable";
import JobMatchTable from "../../components/jobs/JobMatchTable";
import JobCandidateCounters from "../../components/jobs/JobCandidateCounters";
import JobActivityTimeline from "../../components/jobs/JobActivityTimeline";
import { Input } from "../../components/ui/Input";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SkillTags from "../../components/enterprise/SkillTags";
import { refreshNotifications } from "../../utils/notificationEvents";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const filterMatchesByCounter = (matches, counter) => {
  if (!counter || counter === "all") return matches;
  const map = {
    shortlisted: ["Shortlisted"],
    onHold: ["OnHold"],
    rejected: ["Rejected", "TechnicalRejected"],
    sentToManager: ["SentToManager"],
    selected: ["TechnicalSelected", "Hired"],
  };
  const statuses = map[counter];
  if (!statuses) return matches;
  return matches.filter((m) => statuses.includes(m.workflowStatus));
};

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = ["Admin", "HR", "Manager"].includes(user?.role);
  const canUpload = ["Admin", "HR"].includes(user?.role);
  const isClosed = (status) => status === "Closed";

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [counterFilter, setCounterFilter] = useState("all");
  const [minScore, setMinScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const load = async () => {
    try {
      const [j, r, m, s, a] = await Promise.all([
        getJob(jobId),
        getResumesByJob(jobId),
        getMatchesByJob(jobId),
        getJobCandidateSummary(jobId),
        getJobActivity(jobId),
      ]);
      setJob(mapJobFromApi(j));
      setResumes(r.map(mapResumeFromApi));
      setMatches(m.map(mapMatchFromApi));
      setSummary(mapJobCandidateSummary(s));
      setActivities(a.map(mapJobActivity));
    } catch {
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [jobId]);

  const handleUpload = useCallback(async (files) => {
    if (!files?.length || isClosed(job?.status)) return;
    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
      try {
        await uploadResume(jobId, files[i]);
        successCount++;
      } catch (err) {
        toast.error(err.response?.data || `Failed to upload ${files[i].name}`);
      }
    }

    setUploadProgress("");
    setUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} resume(s) uploaded successfully`);
      load();
      refreshNotifications();
    }
  }, [jobId, job?.status]);

  const handleJobStatus = async (action) => {
    setStatusLoading(true);
    try {
      if (action === "close") await closeJob(jobId);
      else if (action === "reopen") await reopenJob(jobId);
      else await holdJob(jobId);
      toast.success(`Job ${action === "close" ? "closed" : action === "reopen" ? "reopened" : "put on hold"}`);
      load();
      refreshNotifications();
    } catch {
      toast.error("Failed to update job status");
    } finally {
      setStatusLoading(false);
    }
  };

  const filteredMatches = useMemo(() => {
    let list = filterMatchesByCounter(matches, counterFilter);
    if (minScore) list = list.filter((m) => m.matchScore >= Number(minScore));
    return list;
  }, [matches, counterFilter, minScore]);

  if (loading) return <Spinner />;
  if (!job) return <div className="text-center py-12"><Button onClick={() => navigate("/jobs")}>Back to Jobs</Button></div>;

  const jobClosed = isClosed(job.status);

  return (
    <div className="space-y-5">
      <Button variant="ghost" onClick={() => navigate("/jobs")} className="gap-1.5 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Button>

      <Card>
        <CardBody>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
                <JobStatusBadge status={job.status} />
              </div>
              <p className="text-slate-600 mt-2">{job.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span>Department: {job.department || "—"}</span>
                <span>Experience: {job.experience || "N/A"}</span>
                <span>Created: {formatDate(job.createdOn)}</span>
                {job.location && <span>Location: {job.location}</span>}
              </div>
            </div>
            {canManage && (
              <div className="flex flex-wrap gap-2">
                {job.status === "Open" && (
                  <>
                    <Button variant="secondary" size="sm" disabled={statusLoading} onClick={() => handleJobStatus("hold")}>Put On Hold</Button>
                    <Button variant="danger" size="sm" disabled={statusLoading} onClick={() => handleJobStatus("close")}>Close Job</Button>
                  </>
                )}
                {job.status === "OnHold" && (
                  <>
                    <Button size="sm" disabled={statusLoading} onClick={() => handleJobStatus("reopen")}>Reopen Job</Button>
                    <Button variant="danger" size="sm" disabled={statusLoading} onClick={() => handleJobStatus("close")}>Close Job</Button>
                  </>
                )}
                {job.status === "Closed" && (
                  <Button size="sm" disabled={statusLoading} onClick={() => handleJobStatus("reopen")}>Reopen Job</Button>
                )}
                <Button variant="danger" size="sm" onClick={() => setConfirmAction({ type: "job", id: jobId, title: "Delete Job", message: `Delete "${job.title}"?` })}>Delete</Button>
              </div>
            )}
          </div>
          {job.skills.length > 0 && (
            <div className="mt-4">
              <SkillTags skills={job.skills} max={10} />
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatsCard title="Resumes Uploaded" value={resumes.length} accent="violet" icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="Matched Candidates" value={matches.length} accent="brand" icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Open Pipeline" value={summary?.all ?? 0} accent="green" icon={<BarChart3 className="w-5 h-5" />} />
      </div>

      <Card>
        <CardHeader title="Candidate Pipeline" subtitle="Filter matched candidates by workflow stage" />
        <CardBody>
          <JobCandidateCounters summary={summary} active={counterFilter} onChange={setCounterFilter} />
        </CardBody>
      </Card>

      {canUpload && (
        <Card>
          <CardHeader
            title="Upload Resumes"
            subtitle={jobClosed ? "This job is closed — uploads are disabled." : "PDF and DOCX supported. Skills are extracted using ATS taxonomy matching."}
          />
          <CardBody>
            {jobClosed ? (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                Resume uploads are disabled for closed jobs. Reopen the job to accept new applications.
              </div>
            ) : (
              <>
                <ResumeUpload onUpload={handleUpload} disabled={uploading} uploading={uploading} />
                {uploadProgress && <p className="text-sm text-primary-600 font-medium mt-3 text-center">{uploadProgress}</p>}
              </>
            )}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Matched Candidates"
          subtitle={`${filteredMatches.length} candidates`}
          action={
            <div className="w-36">
              <Input placeholder="Min score %" type="number" min={0} max={100} value={minScore} onChange={(e) => setMinScore(e.target.value)} />
            </div>
          }
        />
        <CardBody>
          <JobMatchTable matches={filteredMatches} jobId={jobId} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Uploaded Resumes" subtitle={`${resumes.length} files`} />
          <CardBody>
            <JobResumeTable resumes={resumes} onDelete={(id) => setConfirmAction({ type: "resume", id, title: "Delete Resume", message: "Delete this resume and candidate data?" })} canDelete={canUpload} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Job Activity Log" subtitle="Recent events" />
          <CardBody>
            <JobActivityTimeline activities={activities} />
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={async () => {
          setDeleting(true);
          try {
            if (confirmAction.type === "resume") {
              await deleteResume(confirmAction.id);
              toast.success("Resume deleted");
              setConfirmAction(null);
              load();
            } else {
              await deleteJob(confirmAction.id);
              navigate("/jobs");
            }
          } catch {
            toast.error("Delete failed");
          } finally {
            setDeleting(false);
          }
        }}
        title={confirmAction?.title}
        message={confirmAction?.message}
        loading={deleting}
      />
    </div>
  );
}
