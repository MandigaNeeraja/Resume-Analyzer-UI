import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import StatsCard from "../../components/common/StatsCard";
import { getAnalytics } from "../../api/analytics";

const STATUS_COLORS = {
  Shortlisted: "#10B981",
  "Under Review": "#F59E0B",
  "Not Matched": "#EF4444",
  "In Progress": "#3B82F6",
};

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
        setError("");
      } catch {
        setData(null);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const summary = data?.summary;
  const hiringFunnel = data?.hiringFunnel || [];
  const statusDistribution = (data?.statusDistribution || []).map((item) => ({
    ...item,
    color: STATUS_COLORS[item.name] || "#94A3B8",
  }));
  const monthlyApplications = data?.monthlyApplications || [];
  const hasData =
    (summary?.totalCandidates ?? 0) > 0 ||
    (summary?.totalResumes ?? 0) > 0 ||
    hiringFunnel.some((stage) => stage.count > 0);

  const summaryCards = summary
    ? [
        {
          title: "Total Candidates",
          value: summary.totalCandidates,
          change: "",
          icon: "people",
          color: "#7C3AED",
          bgColor: "#EDE9FE",
        },
        {
          title: "Total Resumes",
          value: summary.totalResumes,
          change: "",
          icon: "description",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
        },
        {
          title: "Job Matches",
          value: summary.totalMatches,
          change: "",
          icon: "compare",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
        },
        {
          title: "Avg Match Score",
          value: `${summary.averageMatchScore}%`,
          change: "",
          icon: "star",
          color: "#10B981",
          bgColor: "#D1FAE5",
        },
      ]
    : [];

  return (
    <Box>
      {!hasData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hiring data yet. Upload resumes and run job matches to see analytics.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryCards.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Hiring Funnel
              </Typography>
              {hiringFunnel.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No funnel data available.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hiringFunnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      tick={{ fill: "#64748B", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                      }}
                    />
                    <Bar dataKey="count" fill="#7C3AED" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Candidate Status Distribution
              </Typography>
              {statusDistribution.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No candidates to display yet.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      formatter={(value) => (
                        <span style={{ color: "#64748B", fontSize: 12 }}>{value}</span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Monthly Resume Uploads
              </Typography>
              {monthlyApplications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No upload history available.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyApplications}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                      }}
                    />
                    <Bar dataKey="count" fill="#A78BFA" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics;
