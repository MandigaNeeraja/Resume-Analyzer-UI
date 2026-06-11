export const dashboardStats = [
  { title: "Total Resumes", value: 120, change: "+10 this week", icon: "description", color: "#7C3AED", bgColor: "#EDE9FE" },
  { title: "Shortlisted", value: 45, change: "+5 this week", icon: "star", color: "#10B981", bgColor: "#D1FAE5" },
  { title: "Open Jobs", value: 12, change: "+2 this month", icon: "work", color: "#3B82F6", bgColor: "#DBEAFE" },
  { title: "Match Requests", value: 89, change: "+15 this week", icon: "compare", color: "#F59E0B", bgColor: "#FEF3C7" },
];

export const applicationsChartData = [
  { month: "Jan", applications: 45 },
  { month: "Feb", applications: 52 },
  { month: "Mar", applications: 48 },
  { month: "Apr", applications: 70 },
  { month: "May", applications: 65 },
  { month: "Jun", applications: 85 },
];

export const topCandidates = [
  { name: "Sarah Johnson", match: 92 },
  { name: "Michael Chen", match: 88 },
  { name: "Emily Davis", match: 85 },
  { name: "James Wilson", match: 82 },
  { name: "Lisa Anderson", match: 78 },
];

export const recentActivity = [
  { action: "Resume uploaded", detail: "John Smith for .NET Developer", time: "2 min ago", type: "upload" },
  { action: "New job added", detail: ".NET Developer position", time: "15 min ago", type: "job" },
  { action: "Candidate shortlisted", detail: "Sarah Johnson for React Developer", time: "1 hour ago", type: "shortlist" },
  { action: "Match completed", detail: "15 candidates matched for QA Engineer", time: "2 hours ago", type: "match" },
  { action: "Resume parsed", detail: "Emily Davis - Data Analyst", time: "3 hours ago", type: "parse" },
];

export const jobs = [
  {
    id: 1,
    title: "Backend Developer",
    description: "We are looking for a Backend Developer to build scalable APIs and services using ASP.NET Core and SQL Server.",
    skills: ["ASP.NET Core", "SQL Server", "C#", "Entity Framework"],
    experience: "2+ Years",
    createdOn: "May 15, 2026",
  },
  {
    id: 2,
    title: "React Developer",
    description: "Join our frontend team to build modern, responsive web applications using React and TypeScript.",
    skills: ["React", "JavaScript", "TypeScript", "Redux"],
    experience: "3-5 Years",
    createdOn: "May 20, 2026",
  },
  {
    id: 3,
    title: "QA Engineer",
    description: "Responsible for automated and manual testing of web applications to ensure quality delivery.",
    skills: ["Selenium", "Jest", "Cypress", "API Testing"],
    experience: "2-3 Years",
    createdOn: "May 22, 2026",
  },
  {
    id: 4,
    title: "Data Analyst",
    description: "Analyze business data and create insightful reports using SQL, Python, and Power BI.",
    skills: ["Python", "SQL", "Power BI", "Excel"],
    experience: "1-3 Years",
    createdOn: "May 25, 2026",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    description: "Manage CI/CD pipelines, cloud infrastructure, and containerized deployments.",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    experience: "4-6 Years",
    createdOn: "Jun 1, 2026",
  },
];

export const jobResumesByJobId = {
  1: [
    { id: 101, fileName: "john_doe_resume.pdf", candidateName: "John Doe", uploadedOn: "Jun 4, 2026", status: "Parsed" },
    { id: 102, fileName: "alex_roy_cv.docx", candidateName: "Alex Roy", uploadedOn: "Jun 3, 2026", status: "Parsed" },
    { id: 103, fileName: "priya_sharma_resume.pdf", candidateName: "Priya Sharma", uploadedOn: "Jun 2, 2026", status: "Failed" },
  ],
  2: [
    { id: 201, fileName: "sarah_johnson_cv.docx", candidateName: "Sarah Johnson", uploadedOn: "Jun 4, 2026", status: "Parsed" },
    { id: 202, fileName: "michael_chen_resume.pdf", candidateName: "Michael Chen", uploadedOn: "Jun 3, 2026", status: "Parsed" },
    { id: 203, fileName: "emily_davis_cv.pdf", candidateName: "Emily Davis", uploadedOn: "Jun 2, 2026", status: "Parsed" },
    { id: 204, fileName: "lisa_anderson_resume.docx", candidateName: "Lisa Anderson", uploadedOn: "Jun 1, 2026", status: "Parsed" },
  ],
  3: [
    { id: 301, fileName: "david_kim_resume.pdf", candidateName: "David Kim", uploadedOn: "Jun 3, 2026", status: "Parsed" },
    { id: 302, fileName: "nina_patel_cv.docx", candidateName: "Nina Patel", uploadedOn: "Jun 2, 2026", status: "Parsed" },
  ],
  4: [
    { id: 401, fileName: "emily_davis_cv.pdf", candidateName: "Emily Davis", uploadedOn: "Jun 1, 2026", status: "Parsed" },
  ],
  5: [
    { id: 501, fileName: "james_wilson_resume.docx", candidateName: "James Wilson", uploadedOn: "May 30, 2026", status: "Parsed" },
  ],
};

export const jobMatchesByJobId = {
  1: [
    { id: 1, name: "John Doe", email: "john.d@email.com", phone: "+1 555-0201", experience: "3 years", skillsMatched: ["ASP.NET Core", "SQL Server", "C#"], matchScore: 95, status: "Shortlisted" },
    { id: 2, name: "Alex Roy", email: "alex.r@email.com", phone: "+1 555-0202", experience: "2 years", skillsMatched: ["ASP.NET Core", "C#"], matchScore: 70, status: "Review" },
  ],
  2: [
    { id: 3, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 555-0101", experience: "4 years", skillsMatched: ["React", "TypeScript", "Redux"], matchScore: 92, status: "Shortlisted" },
    { id: 4, name: "Michael Chen", email: "michael.c@email.com", phone: "+1 555-0102", experience: "3 years", skillsMatched: ["React", "JavaScript", "Redux"], matchScore: 88, status: "Shortlisted" },
    { id: 5, name: "Emily Davis", email: "emily.d@email.com", phone: "+1 555-0103", experience: "2 years", skillsMatched: ["JavaScript", "React"], matchScore: 72, status: "Review" },
    { id: 6, name: "Lisa Anderson", email: "lisa.a@email.com", phone: "+1 555-0105", experience: "1 year", skillsMatched: ["JavaScript"], matchScore: 42, status: "Not Matched" },
  ],
  3: [
    { id: 7, name: "David Kim", email: "david.k@email.com", phone: "+1 555-0301", experience: "3 years", skillsMatched: ["Selenium", "Cypress", "API Testing"], matchScore: 85, status: "Shortlisted" },
    { id: 8, name: "Nina Patel", email: "nina.p@email.com", phone: "+1 555-0302", experience: "2 years", skillsMatched: ["Jest", "API Testing"], matchScore: 68, status: "Review" },
  ],
  4: [
    { id: 9, name: "Emily Davis", email: "emily.d@email.com", phone: "+1 555-0103", experience: "2 years", skillsMatched: ["Python", "SQL", "Power BI"], matchScore: 90, status: "Shortlisted" },
  ],
  5: [
    { id: 10, name: "James Wilson", email: "james.w@email.com", phone: "+1 555-0104", experience: "5 years", skillsMatched: ["Docker", "AWS", "CI/CD"], matchScore: 82, status: "Shortlisted" },
  ],
};

export const candidates = Object.values(jobMatchesByJobId)
  .flat()
  .map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    experience: m.experience,
    skills: m.skillsMatched,
    status: m.status,
  }));

export function getScoreColor(score) {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export function getStatusFromScore(score) {
  if (score >= 80) return "Shortlisted";
  if (score >= 60) return "Review";
  return "Not Matched";
}

export function getJobById(id) {
  return jobs.find((j) => j.id === Number(id));
}

export function getJobResumes(jobId) {
  return jobResumesByJobId[jobId] || [];
}

export function getJobMatches(jobId) {
  return (jobMatchesByJobId[jobId] || []).sort((a, b) => b.matchScore - a.matchScore);
}

export function getCandidateById(id) {
  return candidates.find((c) => c.id === Number(id));
}

export function getCandidateMatch(id) {
  return Object.values(jobMatchesByJobId).flat().find((m) => m.id === Number(id));
}
