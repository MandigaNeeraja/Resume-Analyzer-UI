import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { getCandidates, hireCandidate } from "../../api/candidates";
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
  { id: "technical-selected", label: "Technically Selected" },
  { id: "hired", label: "Hired" },
];

export default function Hiring() {
  const [activeTab, setActiveTab] = useState("technical-selected");
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getCandidates()
      .then((d) => setCandidates(d.map(mapCandidateFromApi)))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const technicalSelected = candidates.filter((c) => c.status === "TechnicalSelected");
  const hired = candidates.filter((c) => c.status === "Hired");
  const activeList = activeTab === "technical-selected" ? technicalSelected : hired;

  const tabs = TABS.map((t) => ({
    ...t,
    count: t.id === "technical-selected" ? technicalSelected.length : hired.length,
  }));

  const handleHire = async () => {
    if (!candidate) return;
    setSaving(true);
    try {
      await hireCandidate(candidate.id, remarks);
      toast.success(`${candidate.name} marked as Hired!`);
      setCandidate(null);
      setActiveTab("hired");
      load();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hiring Pipeline"
        description="Manage final hiring — view technically selected candidates and confirmed hires."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard title="Ready to Hire" value={technicalSelected.length} accent="amber" />
        <StatsCard title="Hired" value={hired.length} accent="green" />
        <StatsCard title="Total in Pipeline" value={technicalSelected.length + hired.length} accent="brand" />
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-2">
        {activeList.map((c) => (
          <CandidateRowCard
            key={c.id}
            candidate={c}
            actions={
              activeTab === "technical-selected" && (
                <Button size="sm" onClick={() => { setCandidate(c); setRemarks(""); }}>Mark as Hired</Button>
              )
            }
          />
        ))}
      </div>

      {activeList.length === 0 && (
        <EmptyState
          icon={UserPlus}
          title={activeTab === "technical-selected" ? "No candidates ready to hire" : "No hired candidates yet"}
          description={activeTab === "technical-selected" ? "Candidates will appear here after technical selection." : "Confirmed hires will be listed here."}
        />
      )}

      <Modal open={!!candidate} onClose={() => setCandidate(null)} title="Confirm Hiring">
        <p className="text-sm mb-4">Confirm hiring of <strong>{candidate?.name}</strong>?</p>
        <Textarea label="HR Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setCandidate(null)}>Cancel</Button>
          <Button onClick={handleHire} disabled={saving}>{saving ? "Processing..." : "Confirm Hire"}</Button>
        </div>
      </Modal>
    </div>
  );
}
