import client from "./client";

export const getDashboard = () => client.get("/api/dashboard").then((r) => r.data);
export const getAdminDashboard = () => client.get("/api/dashboard/admin").then((r) => r.data);
export const getHRDashboard = () => client.get("/api/dashboard/hr").then((r) => r.data);
export const getManagerDashboard = () => client.get("/api/dashboard/manager").then((r) => r.data);
export const getNotifications = () => client.get("/api/dashboard/notifications").then((r) => r.data);
