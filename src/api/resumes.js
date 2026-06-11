import client from "./client";

export const uploadResume = (jobId, file) => {
  const form = new FormData();
  form.append("JobId", jobId);
  form.append("ResumeFile", file);
  return client.post("/api/resumes/upload", form).then((r) => r.data);
};

export const getResumesByJob = (jobId) =>
  client.get(`/api/resumes/job/${jobId}`).then((r) => r.data);

export const deleteResume = (id) => client.delete(`/api/resumes/${id}`);
