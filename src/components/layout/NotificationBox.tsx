import React, { useEffect, useState } from "react";
import { useTheme } from "@/src/contexts";
import { Bell, Check, Clock, X } from "lucide-react";
import { cn } from "@/src/utils/utils";
import { useGetMyNotifications } from "@/src/hooks/notification/useGetMyNotifications";
import { useMarkAsRead } from "@/src/hooks/notification/useMarkAsRead";
import { useMarkAllAsRead } from "@/src/hooks/notification/useMarkAllAsRead";

function mapType(type: string): "info" | "success" | "warning" | "danger" {
  switch (type) {
    case "alert":
      return "warning";
    case "error":
      return "danger";
    case "success":
      return "success";
    default:
      return "info";
  }
}

function formatTime(date: string) {
  return new Date(date).toLocaleString(); // replace with dayjs if needed
}

function NotificationItem({ notification }: any) {
  const { tokens } = useTheme();

  const typeStyles = {
    info: {
      bg: tokens.accentLight,
      color: tokens.accent,
    },
    success: {
      bg: tokens.successLight,
      color: tokens.success,
    },
    warning: {
      bg: tokens.warningLight,
      color: tokens.warning,
    },
    danger: {
      bg: tokens.dangerLight,
      color: tokens.danger,
    },
  };

  const uiType = mapType(notification.type);

  return (
    <div
      className={cn(
        "p-4 transition-colors cursor-pointer relative",
        !notification.isRead && "opacity-100",
      )}
      style={{
        backgroundColor: !notification.isRead
          ? tokens.accentLight + "40"
          : "transparent",
      }}
    >
      {!notification.isRead && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: tokens.accent }}
        />
      )}

      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: typeStyles[uiType].bg,
            color: typeStyles[uiType].color,
          }}
        >
          <Bell size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold truncate"
            style={{ color: tokens.text }}
          >
            {notification.title}
          </p>

          <p
            className="text-xs mt-0.5 line-clamp-2"
            style={{ color: tokens.textSec }}
          >
            {notification.body}
          </p>

          <div
            className="flex items-center gap-1.5 mt-2 text-[10px]"
            style={{ color: tokens.textMuted }}
          >
            <Clock size={10} />
            {formatTime(notification.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
interface NotificationBoxProps {
  onClose: () => void;
}

export default function NotificationBox({ onClose }: any) {
  const { tokens } = useTheme();

  const { data, loading, error, getMyNotifications } = useGetMyNotifications();

  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead, loading: markAllLoading } = useMarkAllAsRead();

  const [notifications, setNotifications] = useState(data);

  useEffect(() => {
    getMyNotifications();
  }, []);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);

      // ✅ optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (e) {}
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();

      // ✅ optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  return (
    <div
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
      }}
    >
      {/* HEADER */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: tokens.border }}
      >
        <h3 className="font-bold" style={{ color: tokens.text }}>
          Notifications
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAll}
            disabled={markAllLoading}
            className="text-xs font-bold cursor-pointer"
            style={{ color: tokens.accent }}
          >
            Mark all as read
          </button>

          <button onClick={onClose} style={{ color: tokens.textSec }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center" style={{ color: tokens.danger }}>
            {error}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              title={!n.isRead ? "Mark as read" : "Already read."}
              onClick={() => handleMarkAsRead(n.id)}
              className={cn(
                "p-4 cursor-pointer relative",
                !n.isRead && "opacity-100",
              )}
              style={{
                backgroundColor: !n.isRead
                  ? tokens.accentLight + "40"
                  : "transparent",
              }}
            >
              {!n.isRead && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: tokens.accent }}
                />
              )}

              <div className="flex gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: tokens.warningLight,
                    color: tokens.warning,
                  }}
                >
                  <Bell size={18} />
                </div>

                <div className="flex-1">
                  <p
                    className="text-sm font-bold"
                    style={{ color: tokens.text }}
                  >
                    {n.title}
                  </p>

                  <p
                    className="text-xs mt-0.5"
                    style={{ color: tokens.textSec }}
                  >
                    {n.body}
                  </p>

                  <div
                    className="flex items-center gap-1.5 mt-2 text-[10px]"
                    style={{ color: tokens.textMuted }}
                  >
                    <Clock size={10} />
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell size={48} className="opacity-10 mx-auto mb-4" />
            <p style={{ color: tokens.textSec }}>No notifications yet</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        className="p-3 border-t text-center"
        style={{ borderColor: tokens.border }}
      >
        <button className="text-xs font-bold" style={{ color: tokens.accent }}>
          View all notifications
        </button>
      </div>
    </div>
  );
}
