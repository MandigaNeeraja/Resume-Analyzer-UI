import client from "./client";

export const getInterviews = () => client.get("/api/interviews").then((r) => r.data);
export const getInterview = (id) => client.get(`/api/interviews/${id}`).then((r) => r.data);
export const createInterview = (payload) => client.post("/api/interviews", payload).then((r) => r.data);
export const updateInterview = (id, payload) => client.put(`/api/interviews/${id}`, payload).then((r) => r.data);
export const completeInterview = (id) => client.put(`/api/interviews/${id}/complete`).then((r) => r.data);
