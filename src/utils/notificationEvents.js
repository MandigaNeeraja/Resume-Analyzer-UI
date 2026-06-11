export const NOTIFICATIONS_REFRESH_EVENT = "notifications-refresh";

export function refreshNotifications() {
  window.dispatchEvent(new Event(NOTIFICATIONS_REFRESH_EVENT));
}
