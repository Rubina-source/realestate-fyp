import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Check, CheckCircle2 } from "lucide-react";
import { notificationService } from "../services/apiService";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString();
};

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getMyNotifications({
        limit: 50,
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read",
      );
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllRead();
      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        })),
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark all notifications",
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex justify-center items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              {unreadCount} unread
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={markingAll || unreadCount === 0}
          className="px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {markingAll ? "Marking..." : "Mark all read"}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center text-neutral-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`rounded-xl border p-4 ${
                item.isRead
                  ? "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  : "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                    {item.message}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(item._id)}
                    className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
