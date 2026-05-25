import React, { useEffect, useState } from "react";
import { useTheme } from "@/src/contexts";
import { Search, MessageSquareWarning } from "lucide-react";
import { Modal } from "@/src/components/ui/modal";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { useGetAllComplaints } from "@/src/hooks/complaint/useGetAllComplaints";
import { useReviewComplaint } from "@/src/hooks/complaint/useReviewComplaint";
import type { Complaint, ComplaintStatus, ComplaintType } from "@/src/types/complaint";
import { formatDateTime, useDebounce } from "@/src/utils/utils";
import Swal from "sweetalert2";

const TYPE_TABS: { key: string; label: string; value: ComplaintType | "" }[] = [
  { key: "all", label: "All", value: "" },
  { key: "complaint", label: "Complaints", value: "complaint" },
  { key: "suggestion", label: "Suggestions", value: "suggestion" },
];

const STATUS_OPTIONS: { label: string; value: ComplaintStatus | "" }[] = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Resolved", value: "resolved" },
];

const statusStyle: Record<ComplaintStatus, { bg: string; color: string }> = {
  pending:  { bg: "#FEF3C7", color: "#92400E" },
  reviewed: { bg: "#DBEAFE", color: "#1E40AF" },
  resolved: { bg: "#D1FAE5", color: "#065F46" },
};

const typeStyle: Record<ComplaintType, { bg: string; color: string }> = {
  complaint:  { bg: "#FEE2E2", color: "#991B1B" },
  suggestion: { bg: "#EDE9FE", color: "#5B21B6" },
};

export default function ComplaintsPage() {
  const { tokens, isDark } = useTheme();

  const [records, setRecords] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ComplaintType | "">("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");

  const [detailItem, setDetailItem] = useState<Complaint | null>(null);
  const [reviewItem, setReviewItem] = useState<Complaint | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"reviewed" | "resolved">("reviewed");
  const [reviewNote, setReviewNote] = useState("");

  const { getAllComplaints, loading } = useGetAllComplaints();
  const { reviewComplaint, loading: reviewLoading } = useReviewComplaint();

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (activeTab) params.set("type", activeTab);
      if (statusFilter) params.set("status", statusFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const result = await getAllComplaints(params.toString());
      setRecords(result?.records || []);
      setTotal(result?.total || 0);
    } catch {
      // error handled in hook
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, activeTab, statusFilter, debouncedSearch]);

  const handleReviewSubmit = async () => {
    if (!reviewItem) return;
    try {
      const updated = await reviewComplaint(reviewItem.id, {
        status: reviewStatus,
        reviewNote: reviewNote.trim() || undefined,
      });
      Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
      setReviewItem(null);
      setReviewNote("");
      // update in-place
      setRecords((prev) =>
        prev.map((r) => (r.id === reviewItem.id ? { ...r, ...updated } : r)),
      );
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || "Something went wrong" });
    }
  };

  const columns = [
    {
      key: "subject",
      label: "Subject",
      render: (row: Complaint) => (
        <button
          className="text-left max-w-[220px]"
          onClick={() => setDetailItem(row)}
        >
          <p className="text-sm font-medium text-(--text) line-clamp-1">{row.subject}</p>
          <p className="text-xs text-(--textMuted) line-clamp-1">{row.message}</p>
        </button>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (row: Complaint) => {
        const s = typeStyle[row.type];
        return (
          <span
            className="px-2 py-1 text-xs rounded font-medium capitalize"
            style={{ backgroundColor: s.bg, color: s.color }}
          >
            {row.type}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: Complaint) => {
        const s = statusStyle[row.status];
        return (
          <span
            className="px-2 py-1 text-xs rounded font-medium capitalize"
            style={{ backgroundColor: s.bg, color: s.color }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "submittedBy",
      label: "Submitted By",
      render: (row: Complaint) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.submittedBy?.name || "?"} size="sm" variant="solid" />
          <div>
            <p className="text-sm font-medium text-(--text)">{row.submittedBy?.name}</p>
            <p className="text-xs text-(--textMuted)">{row.submittedBy?.employeeId || row.submittedBy?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row: Complaint) => (
        <span className="text-xs text-(--textMuted)">{formatDateTime(row.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (row: Complaint) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setDetailItem(row)}>
            View
          </Button>
          {row.status === "pending" && (
            <Button
              variant="primary"
              onClick={() => {
                setReviewItem(row);
                setReviewStatus("reviewed");
                setReviewNote("");
              }}
            >
              Review
            </Button>
          )}
          {row.status === "reviewed" && (
            <Button
              variant="success"
              onClick={() => {
                setReviewItem(row);
                setReviewStatus("resolved");
                setReviewNote(row.reviewNote || "");
              }}
            >
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: tokens.text }}>
            Complaints & Suggestions
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            Review and resolve submitted complaints and suggestions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}` }}
      >
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => { setActiveTab(tab.value); setPage(1); }}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.value ? tokens.accent : "transparent",
              color: activeTab === tab.value ? "#fff" : tokens.textSec,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Status filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: tokens.textMuted }}
          />
          <input
            type="text"
            placeholder="Search by subject, message or name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none text-sm transition-all"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
              color: tokens.text,
            }}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="px-3 py-2.5 rounded-xl border outline-none text-sm"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
            color: tokens.text,
          }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as ComplaintStatus | ""); setPage(1); }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DynamicTable
        columns={columns}
        data={records}
        rowKey={(row) => row.id}
        totalPages={Math.ceil(total / limit)}
        currentPage={page}
        rowsPerPage={limit}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(r) => { setLimit(r); setPage(1); }}
        loading={loading}
        striped
      />

      {/* Detail Modal */}
      {detailItem && (
        <Modal
          title="Complaint / Suggestion Detail"
          onClose={() => setDetailItem(null)}
          width={560}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-1 text-xs rounded font-medium capitalize"
                style={{ backgroundColor: typeStyle[detailItem.type].bg, color: typeStyle[detailItem.type].color }}
              >
                {detailItem.type}
              </span>
              <span
                className="px-2 py-1 text-xs rounded font-medium capitalize"
                style={{ backgroundColor: statusStyle[detailItem.status].bg, color: statusStyle[detailItem.status].color }}
              >
                {detailItem.status}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-(--textMuted) mb-1">Subject</p>
              <p className="text-sm font-semibold text-(--text)">{detailItem.subject}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-(--textMuted) mb-1">Message</p>
              <p className="text-sm text-(--text) leading-relaxed whitespace-pre-wrap">{detailItem.message}</p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Avatar name={detailItem.submittedBy?.name || "?"} size="sm" variant="solid" />
              <div>
                <p className="text-sm font-medium text-(--text)">{detailItem.submittedBy?.name}</p>
                <p className="text-xs text-(--textMuted)">{detailItem.submittedBy?.email}</p>
              </div>
              <span className="text-xs text-(--textMuted) ml-auto">{formatDateTime(detailItem.createdAt)}</span>
            </div>

            {detailItem.reviewNote && (
              <div
                className="p-3 rounded-lg border"
                style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
              >
                <p className="text-xs uppercase tracking-widest font-semibold text-(--textMuted) mb-1">Review Note</p>
                <p className="text-sm text-(--text)">{detailItem.reviewNote}</p>
                {detailItem.reviewedBy && (
                  <p className="text-xs text-(--textMuted) mt-1">
                    by {detailItem.reviewedBy.name} · {formatDateTime(detailItem.reviewedAt || "")}
                  </p>
                )}
              </div>
            )}

            {detailItem.status === "pending" && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    setDetailItem(null);
                    setReviewItem(detailItem);
                    setReviewStatus("reviewed");
                    setReviewNote("");
                  }}
                >
                  Review
                </Button>
              </div>
            )}
            {detailItem.status === "reviewed" && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="success"
                  onClick={() => {
                    setDetailItem(null);
                    setReviewItem(detailItem);
                    setReviewStatus("resolved");
                    setReviewNote(detailItem.reviewNote || "");
                  }}
                >
                  Resolve
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      {reviewItem && (
        <Modal
          title={reviewStatus === "resolved" ? "Resolve Complaint" : "Review Complaint"}
          onClose={() => setReviewItem(null)}
          width={480}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-(--text) mb-1">{reviewItem.subject}</p>
              <p className="text-sm text-(--textMuted) line-clamp-2">{reviewItem.message}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--textMuted) uppercase tracking-widest mb-2">
                Mark as
              </label>
              <div className="flex gap-2">
                {(["reviewed", "resolved"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewStatus(s)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize"
                    style={{
                      backgroundColor: reviewStatus === s ? tokens.accent : tokens.surface,
                      borderColor: reviewStatus === s ? tokens.accent : tokens.border,
                      color: reviewStatus === s ? "#fff" : tokens.text,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--textMuted) uppercase tracking-widest mb-2">
                Review Note (optional)
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all"
                style={{
                  backgroundColor: tokens.surface,
                  borderColor: tokens.border,
                  color: tokens.text,
                }}
                placeholder="Add a note or response..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" onClick={() => setReviewItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReviewSubmit}>
                {reviewLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
