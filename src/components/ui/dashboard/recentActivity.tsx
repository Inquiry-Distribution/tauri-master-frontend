import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { RecentActivityLog } from "@/src/types/dashboard";
import { useGetRecentActivityLogs } from "@/src/hooks/dashboard/useGetRecentAct";
import { useTheme } from "@/src/contexts";

const ITEMS_PER_PAGE = 10;

const RecentActivity = () => {
  const { data, loading, getRecentActivityLogs } = useGetRecentActivityLogs();
  const { tokens } = useTheme();

  const [page, setPage] = useState(1);

  // 🔥 Fetch when page changes
  useEffect(() => {
    getRecentActivityLogs(`page=${page}&limit=${ITEMS_PER_PAGE}`);
  }, [page]);

  const logs = data?.logs || [];
  const totalPages = data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1;

  return (
    <div
      className="p-6 rounded-2xl border "
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }}
    >
      {/* Header */}
      <h3 className="font-bold text-lg mb-4" style={{ color: tokens.text }}>
        Recent Activity
      </h3>

      {/* Scrollable Content */}
      <div className="space-y-6 h-90 max-h-full overflow-y-auto no-scrollbar pr-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-(--border)" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-(--border) rounded" />
                <div className="h-3 w-24 bg-(--border) rounded" />
              </div>
            </div>
          ))
        ) : logs.length > 0 ? (
          logs.map((item: RecentActivityLog) => (
            <div key={item.id} className="flex gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-blue-600" />
              </div>

              {/* Content */}
              <div>
                <p className="text-sm font-bold" style={{ color: tokens.text }}>
                  {formatAction(item.action)}
                </p>

                <p className="text-xs" style={{ color: tokens.textSec }}>
                  {item.performedBy?.name || "System"} •{" "}
                  {formatTime(item.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p
            className="text-sm text-center py-6"
            style={{ color: tokens.textSec }}
          >
            No activity found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
          className="px-3 py-1 text-sm rounded-md border disabled:opacity-50"
          style={{ borderColor: tokens.border, color: tokens.text }}
        >
          Prev
        </button>

        <span className="text-sm" style={{ color: tokens.textSec }}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || loading}
          className="px-3 py-1 text-sm rounded-md border disabled:opacity-50"
          style={{ borderColor: tokens.border, color: tokens.text }}
        >
          Next
        </button>
      </div>

      {/* Footer */}
      {/* <button
        className="w-full mt-4 py-2 text-sm font-bold rounded-xl transition-colors"
        style={{
          backgroundColor: tokens.borderLight,
          color: tokens.accent,
        }}
      >
        View All Activity
      </button> */}
    </div>
  );
};

export default RecentActivity;

// ── Helpers ─────────────────────────────

function formatTime(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return past.toLocaleDateString();
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
