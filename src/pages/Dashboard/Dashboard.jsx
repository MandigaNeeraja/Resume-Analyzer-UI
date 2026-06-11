import { useEffect, useState } from "react";
import { FileText, Star, Briefcase, ArrowLeftRight, Users, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../api/dashboard";
import StatsCard from "../../components/ui/StatsCard";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/enterprise/PageHeader";
import {
  ApplicationsOverviewChart,
  TopCandidatesPanel,
  MonthlyUploadsChart,
  HiringFunnelChart,
  StatusDistributionChart,
  RecentActivityPanel,
  QuickActionsPanel,
} from "../../components/dashboard/DashboardCharts";

function mapActivity(items) {
  return (items || []).map((item) => ({
    action: item.action,
    detail: item.detail,
    occurredAt: item.occurredAt,
    type: item.type,
  }));
}

function mapAnalytics(analytics) {
  if (!analytics) return null;
  return {
    summary: analytics.summary || {},
    hiringFunnel: analytics.hiringFunnel || [],
    groupedStatusDistribution: analytics.groupedStatusDistribution || analytics.statusDistribution || [],
    monthlyApplications: analytics.monthlyApplications || [],
    monthlyMatchTrend: analytics.monthlyMatchTrend || [],
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    getDashboard().then(setData).finally(() => setLoading(false));
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Spinner />;

  const analytics = mapAnalytics(data?.analytics);
  const recentActivity = mapActivity(data?.recentActivity);
  const topCandidates = data?.topCandidates || [];
  const role = user?.role;

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        description="Overview of recruitment metrics, pipeline health, and recent activity."
      />

      <StatsRow role={role} data={data} analytics={analytics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ApplicationsOverviewChart data={analytics?.monthlyMatchTrend} />
        </div>
        <div>
          <TopCandidatesPanel candidates={topCandidates} />
        </div>
      </div>

      <MonthlyUploadsChart data={analytics?.monthlyApplications} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HiringFunnelChart data={analytics?.hiringFunnel} />
        <StatusDistributionChart data={analytics?.groupedStatusDistribution} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentActivityPanel activity={recentActivity} now={now} />
        </div>
        <div>
          <QuickActionsPanel role={role} />
        </div>
      </div>
    </div>
  );
}

function StatsRow({ role, data, analytics }) {
  const summary = analytics?.summary || {};

  if (role === "Manager") {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="Pending Review" value={data?.candidatesPendingReview} accent="amber" icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Interviews Pending" value={data?.interviewsPending} accent="blue" icon={<Calendar className="w-5 h-5" />} />
        <StatsCard title="Selected" value={data?.selectedCandidates} accent="green" icon={<Star className="w-5 h-5" />} />
        <StatsCard title="Rejected" value={data?.rejectedCandidates} accent="red" icon={<ArrowLeftRight className="w-5 h-5" />} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatsCard title="Total Resumes" value={summary.totalResumes} accent="violet" icon={<FileText className="w-5 h-5" />} />
      <StatsCard title="Shortlisted" value={summary.shortlisted} accent="green" icon={<Star className="w-5 h-5" />} />
      <StatsCard title="Open Jobs" value={summary.openJobs ?? data?.totalJobs} accent="brand" icon={<Briefcase className="w-5 h-5" />} />
      <StatsCard title="Match Requests" value={summary.totalMatches} accent="amber" icon={<ArrowLeftRight className="w-5 h-5" />} />
    </div>
  );
}
