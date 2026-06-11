import { useEffect, useState, useMemo } from "react";
import { Users } from "lucide-react";
import { getCandidates } from "../../api/candidates";
import { mapCandidateFromApi } from "../../utils/mappers";
import TabBar from "../../components/ui/TabBar";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/enterprise/PageHeader";
import SearchInput from "../../components/enterprise/SearchInput";
import CandidateRowCard from "../../components/enterprise/CandidateRowCard";
import EmptyState from "../../components/enterprise/EmptyState";
import StatsCard from "../../components/ui/StatsCard";
import { useAuth } from "../../context/AuthContext";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "Shortlisted", label: "Shortlisted" },
  { id: "OnHold", label: "On Hold" },
  { id: "Rejected", label: "Rejected" },
  { id: "SentToManager", label: "Sent To Manager" },
  { id: "TechnicalSelected", label: "Selected" },
];

export default function Candidates() {
  const { user } = useAuth();
  const isManager = user?.role === "Manager";
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates().then((d) => setCandidates(d.map(mapCandidateFromApi))).finally(() => setLoading(false));
  }, []);

  const tabs = useMemo(() => STATUS_TABS.map((t) => ({
    ...t,
    count: t.id === "all"
      ? candidates.length
      : t.id === "Rejected"
        ? candidates.filter((c) => c.status === "Rejected" || c.status === "TechnicalRejected").length
        : t.id === "TechnicalSelected"
          ? candidates.filter((c) => c.status === "TechnicalSelected" || c.status === "Hired").length
          : candidates.filter((c) => c.status === t.id).length,
  })), [candidates]);

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.jobTitle || "").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    if (statusFilter === "Rejected") return c.status === "Rejected" || c.status === "TechnicalRejected";
    if (statusFilter === "TechnicalSelected") return c.status === "TechnicalSelected" || c.status === "Hired";
    return c.status === statusFilter;
  });

  const shortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
  const inReview = candidates.filter((c) => ["HRScreening", "SentToManager"].includes(c.status)).length;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title={isManager ? "Assigned Candidates" : "Talent Pool"}
        description="Search, filter, and review candidates across all open requisitions."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="Total" value={candidates.length} accent="brand" />
        <StatsCard title="Shortlisted" value={shortlisted} accent="green" />
        <StatsCard title="In Review" value={inReview} accent="amber" />
        <StatsCard title="Showing" value={filtered.length} accent="blue" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <TabBar tabs={tabs} activeTab={statusFilter} onChange={setStatusFilter} />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, job..."
          className="w-full lg:w-72"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <CandidateRowCard key={c.id} candidate={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description={isManager ? "HR will forward candidates for your review." : "Adjust filters or upload resumes from a job requisition."}
        />
      )}
    </div>
  );
}
