import React from "react";
import { useTheme } from "@/src/contexts";
import { Bell, Check, Clock, X } from "lucide-react";
import { cn } from "@/src/utils/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "danger";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Inquiry",
    message: "A new inquiry from John Doe has been received.",
    time: "2 mins ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Agent Blocked",
    message: "Agent Emma Wilson has been blocked due to inactivity.",
    time: "1 hour ago",
    read: true,
    type: "danger",
  },
  {
    id: "3",
    title: "System Update",
    message: "The system will undergo maintenance at 12:00 AM.",
    time: "3 hours ago",
    read: false,
    type: "warning",
  },
];

interface NotificationBoxProps {
  onClose: () => void;
}

export default function NotificationBox({ onClose }: NotificationBoxProps) {
  const { tokens } = useTheme();

  return (
    <div
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: tokens.border }}
      >
        <h3 className="font-bold" style={{ color: tokens.text }}>
          Notifications
        </h3>
        <div className="flex items-center gap-2">
          <button className="text-xs font-bold text-blue-600 hover:underline">
            Mark all as read
          </button>
          <button
            title="Close"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-opacity-10"
            style={{ color: tokens.textSec }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <div className="divide-y" style={{ divideColor: tokens.border }}>
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-opacity-50 transition-colors cursor-pointer relative",
                  !notification.read && "bg-blue-500/5",
                )}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                )}
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      notification.type === "info" &&
                        "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                      notification.type === "success" &&
                        "bg-green-100 text-green-600 dark:bg-green-900/30",
                      notification.type === "warning" &&
                        "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
                      notification.type === "danger" &&
                        "bg-red-100 text-red-600 dark:bg-red-900/30",
                    )}
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
                      {notification.message}
                    </p>
                    <div
                      className="flex items-center gap-1.5 mt-2 text-[10px]"
                      style={{ color: tokens.textMuted }}
                    >
                      <Clock size={10} />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell size={48} className="mx-auto mb-4 opacity-10" />
            <p
              className="text-sm font-medium"
              style={{ color: tokens.textSec }}
            >
              No notifications yet
            </p>
          </div>
        )}
      </div>

      <div
        className="p-3 border-t text-center"
        style={{ borderColor: tokens.border }}
      >
        <button className="text-xs font-bold text-blue-600 hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
}
