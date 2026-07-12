import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBell } from "react-icons/fi";
import api from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  function loadNotifications() {
    api
      .get("/notifications")
      .then(({ data }) => setNotifications(data || []))
      .catch(() => {});
  }

  useEffect(loadNotifications, []);

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      loadNotifications();
    } catch {
      // non-critical
    }
  }

  async function markAllRead() {
    try {
      await api.patch("/notifications/read-all");
      toast.success("All notifications marked as read");
      loadNotifications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update notifications");
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 text-center shadow-sm dark:bg-slate-900">
          <FiBell size={28} className="mb-4 text-gray-400 dark:text-slate-500" />
          <p className="text-sm text-gray-500 dark:text-slate-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`cursor-pointer rounded-xl p-4 shadow-sm ${
                n.isRead
                  ? "bg-white dark:bg-slate-900"
                  : "bg-blue-50 dark:bg-blue-500/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {n.type}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-700 dark:text-slate-300">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
