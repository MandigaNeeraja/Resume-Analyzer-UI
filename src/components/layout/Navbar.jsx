import { Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificationMenu";

export default function Navbar({ title, onMenuClick, breadcrumb }) {
  return (
    <header className="shrink-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center">
      <div className="flex items-center justify-between gap-4 w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            {breadcrumb && <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide hidden sm:block">{breadcrumb}</p>}
            <h1 className="text-base font-semibold text-slate-900 truncate leading-tight">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <NotificationMenu />
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
