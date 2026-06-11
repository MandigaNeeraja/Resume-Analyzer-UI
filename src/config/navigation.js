export const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard", roles: ["Admin", "HR", "Manager"] },
  { path: "/users", label: "User Management", icon: "users", roles: ["Admin"] },
  { path: "/jobs", label: "Jobs", icon: "jobs", roles: ["Admin", "HR", "Manager"] },
  { path: "/hr-screening", label: "HR Screening", icon: "screening", roles: ["Admin", "HR"] },
  { path: "/manager-review", label: "Candidate Review", icon: "review", roles: ["Admin", "Manager"] },
  { path: "/candidates", label: "All Candidates", icon: "candidates", roles: ["Admin", "HR"] },
  { path: "/candidates", label: "Assigned Candidates", icon: "candidates", roles: ["Manager"] },
  { path: "/interviews", label: "Interviews", icon: "interviews", roles: ["Admin", "HR", "Manager"] },
  { path: "/hiring", label: "Hiring", icon: "hiring", roles: ["Admin", "HR"] },
  { path: "/feedback", label: "Interview Feedback", icon: "feedback", roles: ["Admin", "Manager"] },
];

export const SEED_ACCOUNTS = {
  admin: [{ email: "admin@company.com", password: "Admin@123", role: "Admin" }],
  hr: [
    { email: "priya.sharma@company.com", password: "Hr@123", name: "Priya Sharma" },
    { email: "rahul.mehta@company.com", password: "Hr@123", name: "Rahul Mehta" },
    { email: "anita.desai@company.com", password: "Hr@123", name: "Anita Desai" },
  ],
  managers: [
    { email: "vikram.singh@company.com", password: "Manager@123", name: "Vikram Singh" },
    { email: "sneha.patel@company.com", password: "Manager@123", name: "Sneha Patel" },
    { email: "arjun.nair@company.com", password: "Manager@123", name: "Arjun Nair" },
  ],
};
