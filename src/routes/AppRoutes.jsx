import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Jobs from "../pages/Jobs/Jobs";
import JobDetails from "../pages/JobDetails/JobDetails";
import Candidates from "../pages/Candidates/Candidates";
import CandidateDetails from "../pages/CandidateDetails/CandidateDetails";
import HrScreening from "../pages/HrScreening/HrScreening";
import ManagerReview from "../pages/ManagerReview/ManagerReview";
import Interviews from "../pages/Interviews/Interviews";
import Hiring from "../pages/Hiring/Hiring";
import Feedback from "../pages/Feedback/Feedback";
import Users from "../pages/Users/Users";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<ProtectedRoute roles={["Admin"]}><Users /></ProtectedRoute>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/jobs/:jobId/candidates/:id" element={<CandidateDetails />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidate/:id" element={<CandidateDetails />} />
        <Route path="/hr-screening" element={<ProtectedRoute roles={["Admin", "HR"]}><HrScreening /></ProtectedRoute>} />
        <Route path="/manager-review" element={<ProtectedRoute roles={["Admin", "Manager"]}><ManagerReview /></ProtectedRoute>} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/hiring" element={<ProtectedRoute roles={["Admin", "HR"]}><Hiring /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute roles={["Admin", "Manager"]}><Feedback /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
