import client from "./client";

export const getJobs = (params = {}) =>
  client.get("/api/jobs", { params }).then((r) => r.data);

export const getJob = (id) => client.get(`/api/jobs/${id}`).then((r) => r.data);

export const getDepartments = () =>
  client.get("/api/jobs/departments").then((r) => r.data);

export const getJobCandidateSummary = (id) =>
  client.get(`/api/jobs/${id}/candidates/summary`).then((r) => r.data);

export const getJobActivity = (id) =>
  client.get(`/api/jobs/${id}/activity`).then((r) => r.data);

export const createJob = (payload) => client.post("/api/jobs", payload).then((r) => r.data);

export const updateJob = (id, payload) =>
  client.put(`/api/jobs/${id}`, payload).then((r) => r.data);

export const closeJob = (id) => client.put(`/api/jobs/${id}/close`).then((r) => r.data);

export const reopenJob = (id) => client.put(`/api/jobs/${id}/reopen`).then((r) => r.data);

export const holdJob = (id) => client.put(`/api/jobs/${id}/hold`).then((r) => r.data);

export const deleteJob = (id) => client.delete(`/api/jobs/${id}`);
