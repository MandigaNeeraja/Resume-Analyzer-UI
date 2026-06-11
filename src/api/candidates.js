import client from "./client";

export const getCandidates = () => client.get("/api/candidates").then((r) => r.data);
export const getCandidate = (id) => client.get(`/api/candidates/${id}`).then((r) => r.data);
export const getHrScreening = () => client.get("/api/candidates/hr-screening").then((r) => r.data);
export const getManagerReview = () => client.get("/api/candidates/manager-review").then((r) => r.data);
export const getCandidateMatch = (id, jobId) =>
  client.get(`/api/candidates/${id}/job/${jobId}/match`).then((r) => r.data);

export const sendToManager = (id, remarks) =>
  client.put(`/api/candidates/${id}/send-to-manager`, { remarks }).then((r) => r.data);
export const shortlistCandidate = (id, remarks) =>
  client.put(`/api/candidates/${id}/shortlist`, { remarks }).then((r) => r.data);
export const rejectCandidate = (id, remarks) =>
  client.put(`/api/candidates/${id}/reject`, { remarks }).then((r) => r.data);
export const holdCandidate = (id, remarks) =>
  client.put(`/api/candidates/${id}/hold`, { remarks }).then((r) => r.data);
export const resumeToScreening = (id, remarks) =>
  client.put(`/api/candidates/${id}/resume-screening`, { remarks }).then((r) => r.data);
export const resumeToManagerReview = (id, remarks) =>
  client.put(`/api/candidates/${id}/resume-review`, { remarks }).then((r) => r.data);
export const approveInterview = (id, payload) =>
  client.put(`/api/candidates/${id}/approve-interview`, payload).then((r) => r.data);
export const technicalSelect = (id, remarks) =>
  client.put(`/api/candidates/${id}/technical-select`, { remarks }).then((r) => r.data);
export const technicalReject = (id, remarks) =>
  client.put(`/api/candidates/${id}/technical-reject`, { remarks }).then((r) => r.data);
export const hireCandidate = (id, remarks) =>
  client.put(`/api/candidates/${id}/hire`, { remarks }).then((r) => r.data);
