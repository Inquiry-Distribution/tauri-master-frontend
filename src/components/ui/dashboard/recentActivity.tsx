import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

import { RecentActivityLog } from "@/src/types/dashboard";
import { useGetRecentActivityLogs } from "@/src/hooks/dashboard/useGetRecentAct";
import { useTheme } from "@/src/contexts";
import { formatDateTime } from "@/src/utils/utils";
import {
  formatAction,
  formatKey,
  formatValue,
  getActionBg,
  hasMeta,
} from "./recentAct";

const ITEMS_PER_PAGE = 10;

const RecentActivity = ({ className }: { className?: string }) => {
  const { data, loading, getRecentActivityLogs } = useGetRecentActivityLogs();
  const { tokens } = useTheme();

  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getRecentActivityLogs(`page=${page}&limit=${ITEMS_PER_PAGE}`);
  }, [page]);

  const logs: RecentActivityLog[] = data?.logs ?? [];
  const totalPages = data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1;

  const toggleExpand = (item: RecentActivityLog) => {
    if (!hasMeta(item.meta)) return;

    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  return (
    <div
      className={`p-6 rounded-2xl border ${className}`}
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }}
    >
      {/* HEADER */}
      <h3 className="font-bold text-lg mb-4" style={{ color: tokens.text }}>
        Recent Activity
      </h3>

      {/* TIMELINE */}
      <div className="space-y-6 relative h-90 max-h-full overflow-y-auto no-scrollbar pr-2">
        {/* vertical line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-px opacity-30"
          style={{ backgroundColor: tokens.border }}
        />

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-(--border)" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-(--border) rounded" />
                <div className="h-3 w-24 bg-(--border) rounded" />
              </div>
            </div>
          ))
        ) : logs.length > 0 ? (
          logs.map((item) => {
            const isOpen = expandedId === item.id;

            return (
              <div key={item.id} className="flex gap-3 relative">
                {/* DOT */}
                <div className="relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border`}
                    style={{
                      borderColor: tokens.border,
                      backgroundColor: getActionBg(item.action),
                    }}
                  >
                    <FileText size={14} className="text-blue-600" />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 pb-4">
                  {/* HEADER ROW */}
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleExpand(item)}
                  >
                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{ color: tokens.text }}
                      >
                        {formatAction(item.action)}
                      </p>

                      <p className="text-xs" style={{ color: tokens.textSec }}>
                        {item.performedBy?.name ?? "System"} •{" "}
                        {formatDateTime(item.createdAt)}
                      </p>
                    </div>

                    {hasMeta(item.meta) ? (
                      <button className="mt-1">
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    ) : (
                      <div className="w-4" /> // keeps alignment clean
                    )}
                  </div>

                  {/* EXPANDED META */}
                  {isOpen && item.meta && (
                    <div
                      className="mt-3 p-3 rounded-lg border text-xs space-y-1"
                      style={{
                        borderColor: tokens.border,
                        color: tokens.textSec,
                      }}
                    >
                      <p
                        className="font-semibold mb-2"
                        style={{ color: tokens.text }}
                      >
                        Activity Details
                      </p>

                      {Object.entries(item.meta).map(([key, value]) => (
                        <div key={key} className="flex gap-2 flex-wrap">
                          <span className="font-medium capitalize">
                            {formatKey(key)}:
                          </span>
                          <span>{formatValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p
            className="text-sm text-center py-6"
            style={{ color: tokens.textSec }}
          >
            No activity found.
          </p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
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
    </div>
  );
};

export default RecentActivity;
