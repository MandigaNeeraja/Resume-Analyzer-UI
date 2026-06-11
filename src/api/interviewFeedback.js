import client from "./client";

export const createFeedback = (payload) =>
  client.post("/api/interview-feedback", payload).then((r) => r.data);
export const getFeedbackByCandidate = (candidateId) =>
  client.get(`/api/interview-feedback/${candidateId}`).then((r) => r.data);
