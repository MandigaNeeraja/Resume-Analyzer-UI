import { useState, useRef, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNotifications } from "../../api/dashboard";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { NOTIFICATIONS_REFRESH_EVENT } from "../../utils/notificationEvents";

const TYPE_STYLES = {
  resume: "bg-blue-100 text-blue-700",
  job: "bg-violet-100 text-violet-700",
  match: "bg-indigo-100 text-indigo-700",
  screening: "bg-sky-100 text-sky-700",
  review: "bg-amber-100 text-amber-700",
  candidate: "bg-emerald-100 text-emerald-700",
  interview: "bg-orange-100 text-orange-700",
  feedback: "bg-purple-100 text-purple-700",
  hired: "bg-green-100 text-green-700",
  default: "bg-slate-100 text-slate-600",
};

function getDismissedKey(email) {
  return `notificationsDismissed:${email || "anonymous"}`;
}

function readDismissedIds(email) {
  try {
    const stored = localStorage.getItem(getDismissedKey(email));
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function writeDismissedIds(email, ids) {
  localStorage.setItem(getDismissedKey(email), JSON.stringify([...ids]));
}

export default function NotificationMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [dismissedIds, setDismissedIds] = useState(() => readDismissedIds(user?.email));
  const ref = useRef(null);

  const visibleItems = items.filter((item) => !dismissedIds.has(item.id));
  const count = visibleItems.length;

  const loadNotifications = useCallback(async () => {
    try {
      setError(false);
      const data = await getNotifications();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissIds = useCallback((ids) => {
    if (!ids.length) return;
    setDismissedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      writeDismissedIds(user?.email, next);
      return next;
    });
  }, [user?.email]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
      loadNotifications();
      setNow(Date.now());
    }, 30000);

    const onRefresh = () => loadNotifications();
    const onFocus = () => loadNotifications();

    window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadNotifications]);

  useEffect(() => {
    setDismissedIds(readDismissedIds(user?.email));
  }, [user?.email]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClearAll = () => {
    dismissIds(visibleItems.map((item) => item.id));
  };

  const handleNotificationClick = (item) => {
    dismissIds([item.id]);
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  const typeLabel = (type) => {
    const labels = {
      resume: "Resume",
      job: "Job",
      match: "Match",
      screening: "Screening",
      review: "Review",
      candidate: "Candidate",
      interview: "Interview",
      feedback: "Feedback",
      hired: "Hired",
    };
    return labels[type?.toLowerCase()] || "Update";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) loadNotifications();
        }}
        className="relative p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-slate-200 shadow-[var(--shadow-elevated)] overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-[11px] text-slate-400">Last 7 days</p>
            </div>
            {count > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-red-500 mb-2">Failed to load notifications</p>
                <button
                  onClick={loadNotifications}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Retry
                </button>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500">No new notifications</p>
                <p className="text-xs text-slate-400 mt-1">You're all caught up</p>
              </div>
            ) : (
              visibleItems.map((item) => {
                const typeStyle = TYPE_STYLES[item.type?.toLowerCase()] || TYPE_STYLES.default;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${typeStyle}`}>
                        {typeLabel(item.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{item.message}</p>
                        {item.detail && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.detail}</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatRelativeTime(item.occurredAt, now)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
