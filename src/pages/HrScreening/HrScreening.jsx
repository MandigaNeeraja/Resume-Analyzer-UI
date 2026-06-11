import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { toast } from "react-toastify";
import {
  getHrScreening, sendToManager, shortlistCandidate,
  rejectCandidate, holdCandidate, resumeToScreening,
} from "../../api/candidates";
import { mapCandidateFromApi } from "../../utils/mappers";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TabBar from "../../components/ui/TabBar";
import StatsCard from "../../components/ui/StatsCard";
import { Textarea } from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/enterprise/PageHeader";
import CandidateRowCard from "../../components/enterprise/CandidateRowCard";
import EmptyState from "../../components/enterprise/EmptyState";

const TABS = [
  { id: "all", label: "All" },
  { id: "HRScreening", label: "Screening" },
  { id: "Shortlisted", label: "Shortlisted" },
  { id: "OnHold", label: "On Hold" },
];

export default function HrScreening() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [modal, setModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () =>
    getHrScreening()
      .then((d) => setCandidates(d.map(mapCandidateFromApi)))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const filtered = activeTab === "all"
    ? candidates
    : candidates.filter((c) => c.status === activeTab);

  const tabs = TABS.map((t) => ({
    ...t,
    count: t.id === "all" ? candidates.length : candidates.filter((c) => c.status === t.id).length,
  }));

  const runAction = async (fn) => {
    if (!modal?.candidate) return;
    setSaving(true);
    try {
      await fn(modal.candidate.id, remarks);
      toast.success("Action completed");
      setModal(null);
      setRemarks("");
      load();
    } catch (err) {
      toast.error(err.response?.data || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const screening = candidates.filter((c) => c.status === "HRScreening" || c.status === "Applied").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="HR Screening"
        description="Review candidates — shortlist, send to manager, reject, or put on hold."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="In Queue" value={candidates.length} accent="brand" />
        <StatsCard title="Screening" value={screening} accent="amber" />
        <StatsCard title="Shortlisted" value={candidates.filter((c) => c.status === "Shortlisted").length} accent="green" />
        <StatsCard title="On Hold" value={candidates.filter((c) => c.status === "OnHold").length} accent="blue" />
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-2">
        {filtered.map((c) => (
          <CandidateRowCard
            key={c.id}
            candidate={c}
            actions={
              <>
                {c.status === "OnHold" ? (
                  <Button size="sm" onClick={() => setModal({ action: "resume", candidate: c })}>Resume</Button>
                ) : (
                  <>
                    {(c.status === "HRScreening" || c.status === "Applied") && (
                      <Button size="sm" variant="secondary" onClick={() => setModal({ action: "shortlist", candidate: c })}>Shortlist</Button>
                    )}
                    <Button size="sm" onClick={() => setModal({ action: "send", candidate: c })}>To Manager</Button>
                    <Button size="sm" variant="secondary" onClick={() => setModal({ action: "hold", candidate: c })}>Hold</Button>
                    <Button size="sm" variant="danger" onClick={() => setModal({ action: "reject", candidate: c })}>Reject</Button>
                  </>
                )}
              </>
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={ClipboardCheck} title="No candidates in this queue" description="Candidates will appear here after resume upload and matching." />
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={
        modal?.action === "send" ? "Send to Manager" :
        modal?.action === "shortlist" ? "Shortlist Candidate" :
        modal?.action === "reject" ? "Reject Candidate" :
        modal?.action === "hold" ? "Put On Hold" : "Resume Screening"
      }>
        <p className="text-sm text-slate-600 mb-4">Candidate: <strong>{modal?.candidate?.name}</strong></p>
        <Textarea label="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button
            variant={modal?.action === "reject" ? "danger" : "primary"}
            disabled={saving}
            onClick={() => {
              const actions = {
                send: () => runAction(sendToManager),
                shortlist: () => runAction(shortlistCandidate),
                reject: () => runAction(rejectCandidate),
                hold: () => runAction(holdCandidate),
                resume: () => runAction(resumeToScreening),
              };
              actions[modal.action]?.();
            }}
          >
            {saving ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
