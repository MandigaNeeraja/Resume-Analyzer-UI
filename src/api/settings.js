import api from "./client";

export async function getSettings() {
  const { data } = await api.get("/api/Settings");
  return data;
}

export async function updateProfile(profile) {
  const { data } = await api.put("/api/Settings/profile", profile);
  return data;
}

export async function updatePreferences(preferences) {
  const { data } = await api.put("/api/Settings/preferences", preferences);
  return data;
}
