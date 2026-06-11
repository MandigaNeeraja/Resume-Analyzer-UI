import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, ClipboardCheck, UserCheck,
  Calendar, UserPlus, MessageSquare, LogOut, X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NAV_ITEMS } from "../../config/navigation";
import BrandLogo from "../icons/BrandLogo";
import { cn } from "../../lib/utils";

const ICONS = {
  dashboard: LayoutDashboard,
  users: Users,
  jobs: Briefcase,
  screening: ClipboardCheck,
  review: UserCheck,
  candidates: Users,
  interviews: Calendar,
  hiring: UserPlus,
  feedback: MessageSquare,
};

const ROLE_COLORS = {
  Admin: "bg-violet-500/15 text-violet-200 border-violet-400/20",
  HR: "bg-blue-500/15 text-blue-200 border-blue-400/20",
  Manager: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
};

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] shrink-0",
          "bg-brand-900 text-white flex flex-col border-r border-white/5",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="shrink-0 px-4 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <div>
              <p className="font-semibold text-sm tracking-tight">RecruitPro</p>
              <p className="text-[10px] text-blue-300/70 uppercase tracking-widest font-medium">Talent Suite</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-md hover:bg-white/10 text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 min-h-0 px-3 py-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const Icon = ICONS[item.icon] || LayoutDashboard;
            return (
              <NavLink
                key={`${item.path}-${item.label}`}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 opacity-90" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="flex items-center gap-3 p-2 rounded-md bg-white/5 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <span className={cn("inline-block mb-2 px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide", ROLE_COLORS[user?.role] || "bg-white/10 text-slate-300 border-white/10")}>
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-red-300 hover:bg-red-500/10 border border-red-400/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
