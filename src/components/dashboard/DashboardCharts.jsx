import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { getScoreColor } from "../../utils/mappers";
import { BriefcaseIcon, DocumentIcon, ArrowsIcon, UsersIcon } from "./DashboardIcons";

const BRAND = "#0052cc";
const PIE_COLORS = ["#0052cc", "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"];

const ACTIVITY_STYLES = {
  resume: { bg: "bg-violet-100", text: "text-violet-600", label: "Resume parsed" },
  job: { bg: "bg-blue-100", text: "text-blue-600", label: "New job" },
  match: { bg: "bg-amber-100", text: "text-amber-600", label: "Match" },
  screening: { bg: "bg-sky-100", text: "text-sky-600", label: "Screening" },
  review: { bg: "bg-orange-100", text: "text-orange-600", label: "Review" },
  interview: { bg: "bg-indigo-100", text: "text-indigo-600", label: "Interview" },
  candidate: { bg: "bg-emerald-100", text: "text-emerald-600", label: "Candidate" },
  hired: { bg: "bg-green-100", text: "text-green-600", label: "Hired" },
  feedback: { bg: "bg-purple-100", text: "text-purple-600", label: "Feedback" },
  default: { bg: "bg-slate-100", text: "text-slate-600", label: "Activity" },
};

function ActivityIcon({ type }) {
  const style = ACTIVITY_STYLES[type] || ACTIVITY_STYLES.default;
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}>
      <DocumentIcon className={`w-4 h-4 ${style.text}`} />
    </div>
  );
}

export function ApplicationsOverviewChart({ data }) {
  const chartData = (data || []).map((d) => ({
    month: d.month,
    value: d.value ?? 0,
  }));

  return (
    <Card className="h-full">
      <CardHeader title="Applications Overview" />
      <CardBody>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Avg Match Score"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={BRAND}
                strokeWidth={2.5}
                dot={{ fill: BRAND, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export function TopCandidatesPanel({ candidates }) {
  const items = candidates || [];

  return (
    <Card className="h-full">
      <CardHeader title="Top Matching Candidates" />
      <CardBody className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No match data yet</p>
        ) : (
          items.map((c, i) => {
            const score = Math.round(c.match ?? 0);
            return (
              <div key={`${c.name}-${i}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-slate-800 truncate pr-2">{c.name}</span>
                  <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
}

export function MonthlyUploadsChart({ data }) {
  const chartData = (data || []).map((d) => ({ month: d.month, count: d.count ?? 0 }));

  return (
    <Card>
      <CardHeader title="Monthly Resume Uploads" />
      <CardBody>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="count" fill={BRAND} radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export function HiringFunnelChart({ data }) {
  const chartData = (data || []).map((d) => ({ stage: d.stage, count: d.count ?? 0 }));

  return (
    <Card className="h-full">
      <CardHeader title="Hiring Funnel" />
      <CardBody>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="stage"
                width={90}
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [value, "Count"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
              />
              <Bar dataKey="count" fill={BRAND} radius={[0, 6, 6, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export function StatusDistributionChart({ data }) {
  const chartData = (data || []).filter((d) => d.value > 0);

  return (
    <Card className="h-full">
      <CardHeader title="Candidate Status Distribution" />
      <CardBody>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export function RecentActivityPanel({ activity, now }) {
  const items = activity || [];

  return (
    <Card className="h-full">
      <CardHeader title="Recent Activity" />
      <CardBody className="p-0">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8 px-6">No recent activity</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <div key={`${item.type}-${item.occurredAt}-${index}`} className="flex items-start gap-3 px-6 py-4">
                <ActivityIcon type={item.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                  {item.detail && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.detail}</p>
                  )}
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                  {formatRelativeTime(item.occurredAt, now)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

const QUICK_ACTIONS = [
  { to: "/jobs", label: "Create Job", icon: BriefcaseIcon, color: "text-violet-600 bg-violet-50" },
  { to: "/jobs", label: "View Jobs", icon: DocumentIcon, color: "text-blue-600 bg-blue-50" },
  { to: "/candidates", label: "View Candidates", icon: UsersIcon, color: "text-emerald-600 bg-emerald-50" },
  { to: "/hr-screening", label: "HR Screening", icon: ArrowsIcon, color: "text-amber-600 bg-amber-50", roles: ["Admin", "HR"] },
  { to: "/manager-review", label: "Review Queue", icon: ArrowsIcon, color: "text-amber-600 bg-amber-50", roles: ["Admin", "Manager"] },
  { to: "/interviews", label: "Interviews", icon: BriefcaseIcon, color: "text-indigo-600 bg-indigo-50" },
];

export function QuickActionsPanel({ role }) {
  const actions = QUICK_ACTIONS.filter((a) => !a.roles || a.roles.includes(role)).slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader title="Quick Actions" />
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/30 transition-all text-center"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
