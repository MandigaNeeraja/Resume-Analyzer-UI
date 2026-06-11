import { useEffect, useState, useMemo } from "react";
import { Plus, Briefcase } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getJobs, getDepartments, createJob, updateJob, deleteJob } from "../../api/jobs";
import { mapJobFromApi } from "../../utils/mappers";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import TabBar from "../../components/ui/TabBar";
import StatsCard from "../../components/ui/StatsCard";
import JobForm from "../../components/jobs/JobForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PageHeader from "../../components/enterprise/PageHeader";
import SearchInput from "../../components/enterprise/SearchInput";
import JobCard from "../../components/enterprise/JobCard";
import EmptyState from "../../components/enterprise/EmptyState";
import { refreshNotifications } from "../../utils/notificationEvents";

const ITEMS_PER_PAGE = 9;

const JOB_TABS = [
  { id: "all", label: "All Jobs", status: null },
  { id: "open", label: "Open", status: "Open" },
  { id: "onhold", label: "On Hold", status: "OnHold" },
  { id: "closed", label: "Closed", status: "Closed" },
];

export default function Jobs() {
  const { user } = useAuth();
  const canEdit = ["Admin", "HR", "Manager"].includes(user?.role);
  const canDelete = ["Admin", "HR", "Manager"].includes(user?.role);

  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const tab = JOB_TABS.find((t) => t.id === activeTab);
      const params = {};
      if (tab?.status) params.status = tab.status;
      if (departmentFilter) params.department = departmentFilter;
      if (search.trim()) params.search = search.trim();
      const [j, d] = await Promise.all([getJobs(params), getDepartments()]);
      setJobs(j.map(mapJobFromApi));
      setDepartments(d);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setLoading(true); load(); }, [activeTab, departmentFilter]);
  useEffect(() => {
    const t = setTimeout(() => { if (!loading) load(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const tabCounts = useMemo(() => {
    const all = jobs.length;
    return JOB_TABS.map((tab) => ({
      ...tab,
      count: tab.id === "all" ? all : jobs.filter((j) => j.status === tab.status).length,
    }));
  }, [jobs]);

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = jobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openCount = jobs.filter((j) => j.status === "Open").length;
  const totalResumes = jobs.reduce((s, j) => s + (j.resumeCount ?? 0), 0);
  const totalMatched = jobs.reduce((s, j) => s + (j.matchCount ?? 0), 0);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob(deleteTarget.id);
      toast.success("Job deleted");
      setDeleteTarget(null);
      load();
      refreshNotifications();
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (jobData) => {
    setSaving(true);
    try {
      if (editJob) {
        await updateJob(editJob.id, jobData);
        toast.success("Job updated successfully");
      } else {
        await createJob(jobData);
        toast.success("Job created successfully");
      }
      setDialogOpen(false);
      setEditJob(null);
      load();
      refreshNotifications();
    } catch {
      toast.error(editJob ? "Failed to update job" : "Failed to create job");
    } finally {
      setSaving(false);
    }
  };

  if (loading && jobs.length === 0) return <Spinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Job Requisitions"
        description="Manage open roles, track pipeline metrics, and control requisition lifecycle."
        actions={canEdit && (
          <Button onClick={() => { setEditJob(null); setDialogOpen(true); }}>
            <Plus className="w-4 h-4" /> New Requisition
          </Button>
        )}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="Total Jobs" value={jobs.length} accent="brand" />
        <StatsCard title="Open" value={openCount} accent="green" />
        <StatsCard title="Resumes" value={totalResumes} accent="blue" />
        <StatsCard title="Matched" value={totalMatched} accent="amber" />
      </div>

      <TabBar tabs={tabCounts} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, department..."
          className="flex-1"
        />
        <select
          value={departmentFilter}
          onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-md border border-slate-200 text-sm bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {paginatedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {paginatedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={(e) => { e.stopPropagation(); setEditJob(job); setDialogOpen(true); }}
              onDelete={(e) => { e.stopPropagation(); setDeleteTarget(job); }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs match your filters"
          description="Create a new requisition or adjust your search and status filters."
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      <JobForm open={dialogOpen} onClose={() => { setDialogOpen(false); setEditJob(null); }} onSave={handleSave} editJob={editJob} saving={saving} departments={departments} />
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title="Delete Job" message={`Delete "${deleteTarget?.title}" and unlink related data?`} confirmLabel="Delete Job" loading={deleting} />
    </div>
  );
}
