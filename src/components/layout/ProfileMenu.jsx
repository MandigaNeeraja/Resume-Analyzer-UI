import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const ROLE_COLORS = {
  Admin: "bg-violet-100 text-violet-700 border-violet-200",
  HR: "bg-blue-100 text-blue-700 border-blue-200",
  Manager: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleColor = ROLE_COLORS[user?.role] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name}</p>
          <p className="text-[11px] text-slate-500">{user?.role}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 hidden md:block transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-slate-200 shadow-[var(--shadow-elevated)] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-sm font-bold">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate text-sm">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <span className={cn("inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border", roleColor)}>
              {user?.role}
            </span>
          </div>
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
