import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Search, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllAttendance } from "@/src/hooks/attendance/useGetAllAttendance";
import type { Attendance } from "@/src/types/attendance";
import Tabs from "@/src/components/ui/tabs";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { getAttendanceColumns } from "./data";

export default function AttendancePage() {
  const { tokens } = useTheme();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default to today

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const columns = useMemo(
    () =>
      getAttendanceColumns({
        setSelectedUserId,
      }),
    [setSelectedUserId],
  );
  const { data, loading, error, getAllAttendance } = useGetAllAttendance();
  // Fetch once + when date changes
  useEffect(() => {
    const query = new URLSearchParams({
      ...(date ? { date } : {}),
    }).toString();

    getAllAttendance(query);
  }, [date]);

  const attendance = data || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 10));
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Attendance
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            View, manage all attendance records.
          </p>
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
            type="date"
            placeholder="Search by date..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
              color: tokens.text,
            }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
            color: tokens.text,
          }}
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Table */}
      <DynamicTable<Attendance>
        columns={columns}
        data={attendance}
        loading={loading}
        currentPage={1}
        rowsPerPage={10}
        showRowsPerPage={false}
        totalPages={totalPages}
        searchable={false}
        pagination={false} // 👈 IMPORTANT (no pagination)
        striped
        showSerialNumber
        onRowClick={(row) => setSelectedUserId(row.salespersonId)}
      />
    </div>
  );
}
