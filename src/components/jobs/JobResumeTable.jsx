import ParseStatusBadge from "../common/ParseStatusBadge";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

function FileIcon({ fileName }) {
  const isPdf = fileName?.toLowerCase().endsWith(".pdf");
  return <span className={isPdf ? "text-red-500" : "text-blue-500"}>{isPdf ? "📕" : "📘"}</span>;
}

export default function JobResumeTable({ resumes, onDelete, canDelete }) {
  if (resumes.length === 0) {
    return <p className="text-center text-slate-400 py-8">No resumes uploaded for this job yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="pb-3 pr-4">File Name</th>
            <th className="pb-3 pr-4">Candidate Name</th>
            <th className="pb-3 pr-4">Uploaded On</th>
            <th className="pb-3 pr-4">Parse Status</th>
            <th className="pb-3 pr-4">ATS Score</th>
            {canDelete && <th className="pb-3 text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume) => (
            <tr key={resume.id} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2 font-medium">
                  <FileIcon fileName={resume.fileName} />
                  {resume.fileName}
                </div>
              </td>
              <td className="py-3 pr-4">{resume.candidateName || "—"}</td>
              <td className="py-3 pr-4 text-slate-500">
                {resume.uploadedOn ? formatRelativeTime(resume.uploadedOn) : "—"}
              </td>
              <td className="py-3 pr-4">
                <ParseStatusBadge status={resume.status} />
              </td>
              <td className="py-3 pr-4">
                {resume.matchScore != null ? `${Math.round(resume.matchScore)}%` : "—"}
              </td>
              {canDelete && (
                <td className="py-3 text-right">
                  <button
                    onClick={() => onDelete(resume.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
