import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import {
  getManagerReview, approveInterview, rejectCandidate,
  holdCandidate, resumeToManagerReview,
} from "../../api/candidates";
import { mapCandidateFromApi } from "../../utils/mappers";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import StatsCard from "../../components/ui/StatsCard";
import { Textarea } from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/enterprise/PageHeader";
import CandidateRowCard from "../../components/enterprise/CandidateRowCard";
import EmptyState from "../../components/enterprise/EmptyState";
import AvailabilitySlotsEditor from "../../components/candidates/AvailabilitySlotsEditor";
import { refreshNotifications } from "../../utils/notificationEvents";

export default function ManagerReview() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [slots, setSlots] = useState([{ date: "", startTime: "09:00", endTime: "10:00" }]);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getManagerReview()
      .then((d) => setCandidates(d.map(mapCandidateFromApi)))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleApprove = async () => {
    if (!modal?.candidate) return;
    if (!slots.some((s) => s.date && s.startTime && s.endTime)) {
      toast.error("Add at least one availability slot");
      return;
    }
    setSaving(true);
    try {
      await approveInterview(modal.candidate.id, {
        remarks,
        availabilitySlots: slots.filter((s) => s.date && s.startTime && s.endTime),
      });
      toast.success("Interview approved — HR will schedule");
      setModal(null);
      load();
      refreshNotifications();
    } catch (err) {
      toast.error(err.response?.data || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSimpleAction = async (fn) => {
    if (!modal?.candidate) return;
    setSaving(true);
    try {
      await fn(modal.candidate.id, remarks);
      toast.success("Action completed");
      setModal(null);
      setRemarks("");
      load();
      refreshNotifications();
    } catch (err) {
      toast.error(err.response?.data || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const highScore = candidates.filter((c) => (c.atsScore ?? 0) >= 80).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manager Review"
        description="Review candidates forwarded by HR — approve for interview, reject, or put on hold."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard title="Pending Review" value={candidates.length} accent="amber" />
        <StatsCard title="High ATS (80%+)" value={highScore} accent="green" />
        <StatsCard title="Avg ATS" value={candidates.length ? Math.round(candidates.reduce((s, c) => s + (c.atsScore ?? 0), 0) / candidates.length) + "%" : "—"} accent="brand" />
      </div>

      <div className="space-y-2">
        {candidates.map((c) => (
          <CandidateRowCard
            key={c.id}
            candidate={c}
            actions={
              <>
                <Button size="sm" onClick={() => { setModal({ action: "approve", candidate: c }); setRemarks(""); setSlots([{ date: "", startTime: "09:00", endTime: "10:00" }]); }}>Approve</Button>
                <Button size="sm" variant="secondary" onClick={() => { setModal({ action: "hold", candidate: c }); setRemarks(""); }}>Hold</Button>
                <Button size="sm" variant="danger" onClick={() => { setModal({ action: "reject", candidate: c }); setRemarks(""); }}>Reject</Button>
              </>
            }
          />
        ))}
      </div>

      {candidates.length === 0 && (
        <EmptyState icon={UserCheck} title="No candidates pending review" description="HR will forward screened candidates for your approval." />
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.action === "approve" ? "Approve for Interview" :
          modal?.action === "hold" ? "Put On Hold" : "Reject Candidate"
        }
        size={modal?.action === "approve" ? "lg" : "md"}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Candidate: <strong>{modal?.candidate?.name}</strong></p>
          {modal?.candidate?.hrRemarks && (
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-600">
              <span className="font-medium text-slate-700">HR Remarks: </span>{modal.candidate.hrRemarks}
            </div>
          )}
          <Textarea label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          {modal?.action === "approve" && (
            <AvailabilitySlotsEditor slots={slots} onChange={setSlots} />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button
              variant={modal?.action === "reject" ? "danger" : "primary"}
              disabled={saving}
              onClick={() => {
                if (modal?.action === "approve") handleApprove();
                else if (modal?.action === "hold") handleSimpleAction(holdCandidate);
                else handleSimpleAction(rejectCandidate);
              }}
            >
              {saving ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
