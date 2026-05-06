import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Trash2,
} from "lucide-react";
import { cn, useDebounce } from "../../utils/utils";
// import { Inquiry } from "../../types";
import { TableColumn } from "@/src/components/ui/table/types";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import Tabs from "@/src/components/ui/tabs";
import { getInquiryColumns, tabFilters } from "./data";
import { useGetInquiries } from "@/src/hooks/inquiry/useGetAllInquiry";
import { Inquiry } from "@/src/types/inquiry";
import { NotificationForm } from "@/src/components/ui/notification/notificationForm";
import { Modal } from "@/src/components/ui/modal";
import ReassignInquiryModal from "@/src/components/ui/distributeInquiry/reassignInquiry/reassignInquiry";
import { useDeleteInquiry } from "@/src/hooks/inquiry/useDeleteInquiry";
import Swal from "sweetalert2";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { Button } from "@/src/components/ui/button";
import { exportInquiryStyled } from "@/src/xls-convert/inquiry.export";
import EditInquiryForm from "./edit/_form";
import Input from "@/src/components/ui/form/input";
import { PersonSelector } from "@/src/components/ui/attendance/personSelector";
// import { exportInquiryExcel } from "@/src/xls-convert/inquiry.export";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getDateRange = (type: string) => {
  const today = new Date();

  switch (type) {
    case "7d": {
      const from = new Date();
      from.setDate(today.getDate() - 7);
      return { from, to: today };
    }

    case "30d": {
      const from = new Date();
      from.setDate(today.getDate() - 30);
      return { from, to: today };
    }

    case "thisMonth": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from, to: today };
    }

    case "lastMonth": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from, to };
    }

    default:
      return { from: today, to: today };
  }
};
// Helper to compute default date values (used as fallback when not in URL)
const getDefaultDates = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  return { defaultFrom: formatDate(oneMonthAgo), defaultTo: formatDate(today) };
};
export default function InquiriesPage() {
  const { tokens } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  // ─── Derive ALL state directly from URL ───────────────────────────────────
  const { defaultFrom, defaultTo } = getDefaultDates();

  const activeTab = searchParams.get("tab") ?? "all";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchTerm = searchParams.get("search") ?? "";
  const priority = searchParams.get("priority") ?? null;
  const from = searchParams.get("from") ?? defaultFrom;
  const to = searchParams.get("to") ?? defaultTo;
  const filterMode =
    (searchParams.get("filterMode") as "range" | "none") ?? "none";
  const activeRange = searchParams.get("range") ?? "30d";
  const personId = searchParams.get("assignedToId") ?? null;
  const showFilters = searchParams.get("showFilters") === "true";

  // ─── Helper: patch a subset of params, preserving the rest ───────────────
  const patchParams = (patches: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patches).forEach(([key, value]) => {
        if (value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      return next;
    });
  };

  // ─── Local-only UI state (not worth persisting) ────────────────────────
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const { data, loading, setData, error, getInquiries } = useGetInquiries();
  const { deleteInquiry, loading: deleteLoading } = useDeleteInquiry();

  const handleDelete = async (inquiry: Inquiry) => {
    if (inquiry.assignedToId) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Inquiry already assigned",
        text: "You must reassign this inquiry before deleting it.",
        showCancelButton: true,
        // showDenyButton: true,
        confirmButtonText: "Reassign",
        // denyButtonText: "Cancel",
        cancelButtonText: "Close",
        confirmButtonColor: "#2563eb", // blue
        // denyButtonColor: "#6b7280",
        cancelButtonColor: "#d33",
      });

      // 🔁 Reassign clicked
      if (result.isConfirmed) {
        setSelectedInquiry(inquiry); // opens your ReassignInquiryModal
      }

      return;
    }

    // 2. Confirm delete
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This inquiry will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: deleteLoading ? "Deleting..." : "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteInquiry(inquiry.id);

      Swal.fire({
        icon: "success",
        title: "Inquiry deleted successfully",
      });

      // refresh list
      getInquiries(`page=${page}&limit=${limit}`);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete inquiry",
      });
    }
  };
  // const handleDelete = async (id: string) => {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "This inquiry will be permanently deleted.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#6b7280",
  //     confirmButtonText: deleteLoading ? "Deleting..." : "Yes, delete it",
  //   });

  //   if (!result.isConfirmed) return;

  //   try {
  //     await deleteInquiry(id);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Inquiry deleted successfully",
  //     });

  //     // refresh list
  //     getInquiries(`page=${page}&limit=${limit}`);
  //   } catch (err) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed to delete inquiry",
  //     });
  //   }
  // };
  const columns = useMemo(
    () =>
      getInquiryColumns({
        setSelectedUserId,
        setSelectedInquiry,
        deleteLoading,
        onDelete: handleDelete,
        setEditInquiry: setEditingInquiry,
      }),
    [
      setSelectedUserId,
      setSelectedInquiry,
      handleDelete,
      deleteLoading,
      setEditingInquiry,
    ],
  );
  const debouncedSearch = useDebounce(searchTerm, 500);
  // ─── Fetch whenever URL-derived state changes ──────────────────────────
  useEffect(() => {
    const selected = tabFilters.find((t) => t.key === activeTab);

    const queryObj: Record<string, string> = {
      page: String(page),
      limit: String(limit),
      ...(selected?.status ? { status: selected.status } : {}),
      ...(personId ? { assignedToId: personId } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(priority ? { priority } : {}),
      ...(filterMode === "range" && from && to ? { from, to } : {}),
    };

    getInquiries(new URLSearchParams(queryObj).toString());
  }, [
    activeTab,
    page,
    limit,
    debouncedSearch,
    priority,
    from,
    to,
    personId,
    filterMode,
  ]);

  // ─── Quick-range helper ────────────────────────────────────────────────
  const applyRange = (type: string) => {
    const { from, to } = getDateRange(type);
    patchParams({
      from: formatDate(from),
      to: formatDate(to),
      range: type,
      filterMode: "range",
      page: "1",
    });
  };

  const inquiries = data?.inquiries || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 10));
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Inquiries Management
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            View, distribute and track all incoming inquiries.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            onClick={() => navigate("/inquiries/create")}
          >
            <Plus size={18} />
            Add Inquiry
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-blue-600/20"
            onClick={() => navigate("/inquiries/trash")}
          >
            <Trash2 size={18} />
            View Trash
          </button>
        </div>
        {/* <div className="flex gap-3">
        </div> */}
      </div>

      <div className="flex  md:flex-row gap-4">
        <div className="relative flex grow">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: tokens.textMuted }}
          />
          <input
            type="text"
            placeholder="Search by customer name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
              color: tokens.text,
            }}
            value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            onChange={(e) =>
              patchParams({ search: e.target.value || null, page: "1" })
            }
          />
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            patchParams({ showFilters: showFilters ? null : "true" })
          }
          // onClick={() => setShowFilters((s) => !s)}
        >
          <Filter size={18} />
        </Button>
        <Button onClick={() => exportInquiryStyled(inquiries)}>
          <Download size={18} />
        </Button>
      </div>
      {showFilters && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <PersonSelector
              value={personId}
              // setPersonId={setPersonId}
              setPersonId={(id) =>
                patchParams({ assignedToId: id ?? null, page: "1" })
              }
              setSelectedPerson={setSelectedPerson}
            />
            {/* DATE RANGE */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="text-sm font-medium"
                style={{ color: tokens.textMuted }}
              >
                Date Range:
              </div>

              {(["7d", "30d", "thisMonth", "lastMonth"] as const).map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={activeRange === r ? "primary" : "ghost"}
                  onClick={() => applyRange(r)}
                >
                  {
                    {
                      "7d": "Last 7 days",
                      "30d": "Last 30 days",
                      thisMonth: "This Month",
                      lastMonth: "Last Month",
                    }[r]
                  }
                </Button>
              ))}
            </div>

            {/* PRIORITY FILTER */}
            <div className="flex items-center gap-2">
              <div
                className="text-sm font-medium"
                style={{ color: tokens.textMuted }}
              >
                Priority:
              </div>

              {([null, "high", "medium", "low"] as const).map((p) => (
                <Button
                  key={p ?? "all"}
                  size="sm"
                  variant={priority === p ? "primary" : "ghost"}
                  onClick={() => patchParams({ priority: p, page: "1" })}
                >
                  {p ? p.charAt(0).toUpperCase() + p.slice(1) : "All"}
                </Button>
              ))}
            </div>
          </div>

          {/* CUSTOM RANGE */}
          <div className=" lg:w-1/3 md:w-1/2 w-full grid lg:grid-cols-10 md:grid-cols-6 grid-cols-4 gap-2">
            <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
              <Input
                label="From"
                inputName="from"
                inputType="date"
                inputValue={from}
                // onChange={(e) => {
                //   setFrom(e.target.value);
                //   setFilterMode("range"); // ✅ key
                //   setActiveRange("");
                //   setPage(1);
                // }}
                onChange={(e) =>
                  patchParams({
                    from: e.target.value,
                    filterMode: "range",
                    range: "",
                    page: "1",
                  })
                }
                placeholder="From date"
                showLabel={false}
              />
            </div>
            <div className="text-text font-semibold text-2xl w-full flex items-center justify-center col-span-1">
              →
            </div>
            <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
              <Input
                label="To"
                inputName="to"
                inputType="date"
                inputValue={to}
                // onChange={(e) => {
                //   setTo(e.target.value);
                //   setFilterMode("range"); // ✅ key
                //   setActiveRange("");
                //   setPage(1);
                // }}
                onChange={(e) =>
                  patchParams({
                    to: e.target.value,
                    filterMode: "range",
                    range: "",
                    page: "1",
                  })
                }
                placeholder="To date"
                showLabel={false}
              />
            </div>
          </div>
        </>
      )}

      <Tabs
        variant="solid"
        value={activeTab}
        // onChange={(key) => {
        //   setActiveTab(key);
        //   setPage(1); // reset pagination on tab change
        // }}
        onChange={(key) => patchParams({ tab: key, page: "1" })}
        tabs={tabFilters.map((tab) => ({
          key: tab.key,
          label: tab.label,
          content: (
            <DynamicTable
              columns={columns}
              data={data?.inquiries || []}
              currentPage={page}
              rowsPerPage={limit}
              searchable={false}
              totalPages={Math.ceil((data?.total || 0) / limit)}
              // onPageChange={(p) => setPage(p)}
              // onRowsPerPageChange={(r) => {
              //   setLimit(r);
              //   setPage(1);
              // }}
              onPageChange={(p) => patchParams({ page: String(p) })}
              onRowsPerPageChange={(r) =>
                patchParams({ limit: String(r), page: "1" })
              }
              loading={loading}
              striped={true}
            />
          ),
        }))}
      />
      {selectedUserId && (
        <Modal
          title="Send Notification"
          onClose={() => setSelectedUserId(null)}
          width={520}
        >
          <NotificationForm
            recipientIds={selectedUserId!}
            onClose={() => setSelectedUserId(null)}
          />
        </Modal>
      )}

      {editingInquiry && (
        <Modal
          title="Edit Inquiry"
          onClose={() => setEditingInquiry(null)}
          width={600}
        >
          <EditInquiryForm
            initialData={editingInquiry}
            onSuccess={(updated) => {
              setData((prev: any) => ({
                ...prev,
                inquiries: prev.inquiries.map((inq: Inquiry) =>
                  inq.id === updated.id ? updated : inq,
                ),
              }));
              setEditingInquiry(null);
            }}
          />
        </Modal>
      )}

      {selectedInquiry && (
        <ReassignInquiryModal
          inquiryId={selectedInquiry.id}
          assignedTo={selectedInquiry.assignedTo}
          onClose={() => setSelectedInquiry(null)}
          onSuccess={() => {
            getInquiries(`page=${page}&limit=${limit}`);
          }}
        />
      )}
    </div>
  );
}
