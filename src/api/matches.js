import client from "./client";

export const getMatchesByJob = (jobId) =>
  client.get(`/api/Match/job/${jobId}`).then((r) => r.data);

export const getMatch = (jobId, candidateId) =>
  client.get(`/api/Match/job/${jobId}/candidate/${candidateId}`).then((r) => r.data);
