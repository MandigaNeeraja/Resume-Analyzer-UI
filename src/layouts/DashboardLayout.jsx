import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { NAV_ITEMS } from "../config/navigation";

const TITLES = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/jobs": "Job Requisitions",
  "/hr-screening": "HR Screening",
  "/manager-review": "Manager Review",
  "/candidates": "Talent Pool",
  "/interviews": "Interviews",
  "/hiring": "Hiring Pipeline",
  "/feedback": "Interview Feedback",
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title =
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.label ||
    TITLES[location.pathname] ||
    "Recruitment";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          title={title}
          breadcrumb="Recruitment Management"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-4 py-5 lg:px-6 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
