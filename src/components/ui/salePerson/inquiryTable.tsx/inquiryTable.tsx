import React, { useEffect, useMemo, useState } from "react";

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
} from "lucide-react";

// import { Inquiry } from "../../types";
import { TableColumn } from "@/src/components/ui/table/types";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { useNavigate } from "react-router-dom";
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

import Input from "@/src/components/ui/form/input";
import { PersonSelector } from "@/src/components/ui/attendance/personSelector";
import { useTheme } from "@/src/contexts";
import { useDebounce } from "@/src/utils/utils";
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
export default function InquiriesTable({ personId }: { personId: string }) {
  const { tokens } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<"range" | "none">("none");
  const [activeRange, setActiveRange] = useState<string>("30d");

  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [from, setFrom] = useState(formatDate(oneMonthAgo));
  const [to, setTo] = useState(formatDate(today));

  const [priority, setPriority] = useState<string | null>(null);

  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data, loading, setData, error, getInquiries } = useGetInquiries();
  const { deleteInquiry, loading: deleteLoading } = useDeleteInquiry();
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const handleDelete = async (id: string) => {
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
      await deleteInquiry(id);

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
  const columns = useMemo(
    () => getInquiryColumns(),
    [
      setSelectedUserId,
      setSelectedInquiry,
      handleDelete,
      deleteLoading,
      setEditingInquiry,
    ],
  );
  const debouncedSearch = useDebounce(searchTerm, 500);
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

    const query = new URLSearchParams(queryObj).toString();

    getInquiries(query);
  }, [activeTab, page, limit, debouncedSearch, priority, from, to, personId]);

  const handlePageChange = (newPage: number) => {
    getInquiries(`page=${newPage}&limit=${limit}`);
  };

  const applyRange = (type: string) => {
    const { from, to } = getDateRange(type);

    setFrom(formatDate(from));
    setTo(formatDate(to));

    setActiveRange(type);
    setFilterMode("range");
    setPage(1);
  };

  const inquiries = data?.inquiries || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 10));
  return (
    <div className=" bg-surface space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-warningLight font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Inquiries
          </h1>
          {/* <p className="text-sm" style={{ color: tokens.textSec }}>
            View, distribute and track all incoming inquiries.
          </p> */}
        </div>
        {/* <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            onClick={() => navigate("/inquiries/create")}
          >
            <Plus size={18} />
            Add Inquiry
          </button>
        </div> */}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={() => setShowFilters((s) => !s)}>
          <Filter size={18} />
        </Button>
        <Button onClick={() => exportInquiryStyled(inquiries)}>
          <Download size={18} />
        </Button>
      </div>
      {showFilters && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            {/* DATE RANGE */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="text-sm font-medium"
                style={{ color: tokens.textMuted }}
              >
                Date Range:
              </div>

              <Button
                size="sm"
                variant={activeRange === "7d" ? "primary" : "ghost"}
                onClick={() => applyRange("7d")}
              >
                Last 7 days
              </Button>

              <Button
                size="sm"
                variant={activeRange === "30d" ? "primary" : "ghost"}
                onClick={() => applyRange("30d")}
              >
                Last 30 days
              </Button>

              <Button
                size="sm"
                variant={activeRange === "thisMonth" ? "primary" : "ghost"}
                onClick={() => applyRange("thisMonth")}
              >
                This Month
              </Button>

              <Button
                size="sm"
                variant={activeRange === "lastMonth" ? "primary" : "ghost"}
                onClick={() => applyRange("lastMonth")}
              >
                Last Month
              </Button>
            </div>

            {/* PRIORITY FILTER */}
            <div className="flex items-center gap-2">
              <div
                className="text-sm font-medium"
                style={{ color: tokens.textMuted }}
              >
                Priority:
              </div>

              <Button
                size="sm"
                variant={priority === null ? "primary" : "ghost"}
                onClick={() => {
                  setPriority(null);
                  setPage(1);
                }}
              >
                All
              </Button>

              <Button
                size="sm"
                variant={priority === "high" ? "primary" : "ghost"}
                onClick={() => {
                  setPriority("high");
                  setPage(1);
                }}
              >
                High
              </Button>

              <Button
                size="sm"
                variant={priority === "medium" ? "primary" : "ghost"}
                onClick={() => {
                  setPriority("medium");
                  setPage(1);
                }}
              >
                Medium
              </Button>

              <Button
                size="sm"
                variant={priority === "low" ? "primary" : "ghost"}
                onClick={() => {
                  setPriority("low");
                  setPage(1);
                }}
              >
                Low
              </Button>
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
                onChange={(e) => {
                  setFrom(e.target.value);
                  setFilterMode("range"); // ✅ key
                  setActiveRange("");
                  setPage(1);
                }}
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
                onChange={(e) => {
                  setTo(e.target.value);
                  setFilterMode("range"); // ✅ key
                  setActiveRange("");
                  setPage(1);
                }}
                placeholder="To date"
                showLabel={false}
              />
            </div>
          </div>
        </>
      )}

      <Tabs
        variant="solid"
        onChange={(key) => {
          setActiveTab(key);
          setPage(1); // reset pagination on tab change
        }}
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
              onPageChange={(p) => setPage(p)}
              onRowsPerPageChange={(r) => {
                setLimit(r);
                setPage(1);
              }}
              loading={loading}
            />
          ),
        }))}
      />
    </div>
  );
}
