import client from "./client";

export const getUsers = () => client.get("/api/users").then((r) => r.data);
export const getUser = (id) => client.get(`/api/users/${id}`).then((r) => r.data);
export const createUser = (payload) => client.post("/api/users", payload).then((r) => r.data);
export const updateUser = (id, payload) => client.put(`/api/users/${id}`, payload).then((r) => r.data);
export const deleteUser = (id) => client.delete(`/api/users/${id}`);
