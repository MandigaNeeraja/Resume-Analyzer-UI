import { useEffect, useMemo, useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getInterviews, createInterview, completeInterview } from "../../api/interviews";
import { getCandidates } from "../../api/candidates";
import { getJobs } from "../../api/jobs";
import { mapInterviewFromApi, mapCandidateFromApi, mapJobFromApi } from "../../utils/mappers";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import TabBar from "../../components/ui/TabBar";
import StatsCard from "../../components/ui/StatsCard";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/enterprise/PageHeader";
import InterviewCard from "../../components/enterprise/InterviewCard";
import EmptyState from "../../components/enterprise/EmptyState";
import { AvailabilitySlotsList } from "../../components/candidates/AvailabilitySlotsEditor";
import { refreshNotifications } from "../../utils/notificationEvents";

const INTERVIEW_TYPES = [
  { value: "HRRound", label: "HR Round" },
  { value: "TechnicalRound", label: "Technical Round" },
  { value: "FinalRound", label: "Final Round" },
];

export default function Interviews() {
  const { user } = useAuth();
  const canSchedule = ["Admin", "HR"].includes(user?.role);
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    candidateId: "", jobId: "", interviewDate: "", interviewTime: "10:00",
    interviewType: "TechnicalRound", meetingLink: "", selectedSlot: "",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const classifyInterview = (i) => {
    if (i.status === "Completed") return "completed";
    if (i.status !== "Scheduled") return "all";
    const dt = new Date(`${i.date}T${i.time || "00:00"}`);
    const now = new Date();
    const isToday = dt.toDateString() === now.toDateString();
    if (isToday) return "ongoing";
    if (dt > now) return "upcoming";
    return "ongoing";
  };

  const interviewTabs = useMemo(() => {
    const counts = { all: interviews.length, upcoming: 0, ongoing: 0, completed: 0 };
    interviews.forEach((i) => { counts[classifyInterview(i)] += 1; });
    return [
      { id: "all", label: "All", count: counts.all },
      { id: "upcoming", label: "Upcoming", count: counts.upcoming },
      { id: "ongoing", label: "Today", count: counts.ongoing },
      { id: "completed", label: "Completed", count: counts.completed },
    ];
  }, [interviews]);

  const visibleInterviews = activeTab === "all"
    ? interviews
    : interviews.filter((i) => classifyInterview(i) === activeTab);

  const load = async () => {
    const [i, c, j] = await Promise.all([getInterviews(), getCandidates(), getJobs()]);
    setInterviews(i.map(mapInterviewFromApi));
    setCandidates(c.map(mapCandidateFromApi).filter((x) => x.status === "InterviewScheduled"));
    setJobs(j.map(mapJobFromApi));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const selectedCandidate = useMemo(
    () => candidates.find((c) => String(c.id) === String(form.candidateId)),
    [candidates, form.candidateId]
  );

  const availabilitySlots = selectedCandidate?.managerAvailability || [];
  const hasAvailability = availabilitySlots.length > 0;

  const slotOptions = useMemo(
    () => availabilitySlots.map((slot, index) => ({
      value: `${slot.date}|${slot.startTime}`,
      label: `${slot.date} · ${slot.startTime?.slice(0, 5)} – ${slot.endTime?.slice(0, 5)}`,
      key: index,
    })),
    [availabilitySlots]
  );

  const handleCandidateChange = (candidateId) => {
    const candidate = candidates.find((c) => String(c.id) === String(candidateId));
    setForm({
      candidateId,
      jobId: candidate?.jobId ? String(candidate.jobId) : "",
      interviewDate: "",
      interviewTime: "10:00",
      interviewType: "TechnicalRound",
      meetingLink: "",
      selectedSlot: "",
    });
  };

  const handleSlotSelect = (value) => {
    if (!value) {
      setForm((prev) => ({ ...prev, selectedSlot: "", interviewDate: "", interviewTime: "10:00" }));
      return;
    }
    const [date, time] = value.split("|");
    setForm((prev) => ({
      ...prev,
      selectedSlot: value,
      interviewDate: date,
      interviewTime: time?.slice(0, 5) || "10:00",
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (hasAvailability && !form.selectedSlot) {
      toast.error("Select a manager availability slot");
      return;
    }
    setSaving(true);
    try {
      await createInterview({
        candidateId: Number(form.candidateId),
        jobId: Number(form.jobId),
        interviewDate: form.interviewDate,
        interviewTime: form.interviewTime + ":00",
        interviewType: form.interviewType,
        meetingLink: form.meetingLink,
      });
      toast.success("Interview scheduled");
      setModalOpen(false);
      load();
      refreshNotifications();
    } catch (err) {
      toast.error(err.response?.data || "Failed to schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeInterview(id);
      toast.success("Interview marked complete");
      load();
      refreshNotifications();
    } catch {
      toast.error("Failed to complete interview");
    }
  };

  if (loading) return <Spinner />;

  const upcoming = interviews.filter((i) => classifyInterview(i) === "upcoming").length;
  const today = interviews.filter((i) => classifyInterview(i) === "ongoing").length;
  const completed = interviews.filter((i) => classifyInterview(i) === "completed").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Interview Schedule"
        description="View and manage scheduled interviews across all requisitions."
        actions={canSchedule && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Schedule Interview
          </Button>
        )}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="Total" value={interviews.length} accent="brand" />
        <StatsCard title="Upcoming" value={upcoming} accent="blue" />
        <StatsCard title="Today" value={today} accent="amber" />
        <StatsCard title="Completed" value={completed} accent="green" />
      </div>

      <TabBar tabs={interviewTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-2">
        {visibleInterviews.map((i) => (
          <InterviewCard key={i.id} interview={i} canSchedule={canSchedule} onComplete={handleComplete} />
        ))}
      </div>

      {visibleInterviews.length === 0 && (
        <EmptyState icon={Calendar} title="No interviews in this view" description="Schedule interviews for candidates approved by managers." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Interview" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Candidate (Interview Scheduled status)"
            value={form.candidateId}
            onChange={(e) => handleCandidateChange(e.target.value)}
            options={[{ value: "", label: "Select candidate" }, ...candidates.map((c) => ({ value: c.id, label: `${c.name} — ${c.jobTitle || "No job"}` }))]}
            required
          />

          {selectedCandidate && (
            <div className="rounded-md border border-brand-100 bg-brand-50/50 p-4">
              <p className="text-sm font-medium text-slate-800 mb-2">Manager Availability</p>
              <AvailabilitySlotsList slots={availabilitySlots} />
            </div>
          )}

          {hasAvailability ? (
            <Select
              label="Select Manager Time Slot"
              value={form.selectedSlot}
              onChange={(e) => handleSlotSelect(e.target.value)}
              options={[{ value: "", label: "Choose an available slot" }, ...slotOptions]}
              required
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} required />
              <Input label="Time" type="time" value={form.interviewTime} onChange={(e) => setForm({ ...form, interviewTime: e.target.value })} required />
            </div>
          )}

          <Select
            label="Job"
            value={form.jobId}
            onChange={(e) => setForm({ ...form, jobId: e.target.value })}
            options={[{ value: "", label: "Select job" }, ...jobs.map((j) => ({ value: j.id, label: j.title }))]}
            required
          />
          <Select label="Interview Type" value={form.interviewType} onChange={(e) => setForm({ ...form, interviewType: e.target.value })} options={INTERVIEW_TYPES} />
          <Input label="Meeting Link" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} placeholder="https://teams.microsoft.com/..." />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Scheduling..." : "Schedule"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
