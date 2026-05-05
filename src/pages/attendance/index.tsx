import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Filter, Calendar1, Download } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetAllAttendance } from "@/src/hooks/attendance/useGetAllAttendance";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { getAttendanceColumns } from "./data";
import { PersonSelector } from "@/src/components/ui/attendance/personSelector";
import { Button } from "@/src/components/ui/button";
import Input from "@/src/components/ui/form/input";
import { useDebounce } from "@/src/utils/utils";
import { exportAttendanceExcel } from "@/src/xls-convert/attendance.export";
import { Attendance } from "@/src/types/attendance";
import { Modal } from "@/src/components/ui/modal";
import { AttendanceDetails } from "@/src/components/ui/attendance/attendanceDetails";

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

const getDefaultDates = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  return { defaultFrom: formatDate(oneMonthAgo), defaultTo: formatDate(today) };
};

export default function AttendancePage() {
  const { tokens } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  // ─── All state derived from URL ───────────────────────────────────────────
  const { defaultFrom, defaultTo } = getDefaultDates();

  const date = searchParams.get("date") ?? formatDate(new Date());
  const filterMode =
    (searchParams.get("filterMode") as "date" | "range") ?? "date";
  const from = searchParams.get("from") ?? defaultFrom;
  const to = searchParams.get("to") ?? defaultTo;
  const activeRange = searchParams.get("range") ?? "";
  const status = searchParams.get("status") ?? null;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") ?? "";
  const personId = searchParams.get("salespersonId") ?? null;
  const showFilters = searchParams.get("showFilters") === "true";

  // ─── Helper: patch URL params ─────────────────────────────────────────────
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

  const columns = useMemo(
    () => getAttendanceColumns({ selectedAttendance, setSelectedAttendance }),
    [selectedAttendance, setSelectedAttendance],
  );
  const { data, loading, getAllAttendance } = useGetAllAttendance();

  const debouncedSearch = useDebounce(search, 400);

  // ─── Fetch on any filter change ───────────────────────────────────────────
  const [attendance, setAttendance] = React.useState<any[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);

  useEffect(() => {
    const queryObj: Record<string, string> = {
      ...(filterMode === "date" && date ? { date } : {}),
      ...(filterMode === "range" ? { from, to } : {}),
      ...(status ? { status } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page: String(page),
      limit: String(limit),
      ...(personId ? { salespersonId: personId } : {}),
    };

    getAllAttendance(new URLSearchParams(queryObj).toString()).then((res) => {
      const records = res?.data?.records ?? [];
      const total = res?.data?.total ?? 0;
      setAttendance(records);
      setTotalPages(Math.ceil(total / limit));
    });
  }, [
    date,
    filterMode,
    from,
    to,
    status,
    debouncedSearch,
    page,
    limit,
    personId,
  ]);

  // ─── Quick-range helper ───────────────────────────────────────────────────
  const applyRange = (type: string) => {
    const { from, to } = getDateRange(type);
    patchParams({
      from: formatDate(from),
      to: formatDate(to),
      range: type,
      filterMode: "range",
      date: null,
      page: "1",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
      </div>

      <div className="space-y-4">
        {/* Top controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Calendar1
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: tokens.textMuted }}
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
                color: tokens.text,
              }}
              value={date}
              onChange={(e) =>
                patchParams({
                  date: e.target.value,
                  filterMode: "date",
                  from: null,
                  to: null,
                  range: null,
                  page: "1",
                })
              }
            />
          </div>

          <PersonSelector
            value={personId}
            setPersonId={(id) => patchParams({ salespersonId: id, page: "1" })}
            setSelectedPerson={() => {}}
          />

          <Button
            variant="secondary"
            onClick={() =>
              patchParams({ showFilters: showFilters ? null : "true" })
            }
          >
            <Filter size={18} />
          </Button>

          <Button onClick={() => exportAttendanceExcel(attendance)}>
            <Download size={18} />
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <>
            <div className="flex flex-wrap items-center justify-start gap-4">
              {/* Date range quick-selects */}
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

              {/* Status filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="text-sm font-medium"
                  style={{ color: tokens.textMuted }}
                >
                  Status:
                </div>
                {([null, "present", "absent", "half_day"] as const).map((s) => (
                  <Button
                    key={s ?? "all"}
                    size="sm"
                    variant={status === s ? "primary" : "ghost"}
                    onClick={() => patchParams({ status: s, page: "1" })}
                  >
                    {s
                      ? s === "half_day"
                        ? "Half Day"
                        : s.charAt(0).toUpperCase() + s.slice(1)
                      : "All"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom date range inputs */}
            <div className="lg:w-1/3 md:w-1/2 w-full grid lg:grid-cols-10 md:grid-cols-6 grid-cols-4 gap-2">
              <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
                <Input
                  label="From"
                  inputName="from"
                  inputType="date"
                  inputValue={from}
                  onChange={(e) =>
                    patchParams({
                      from: e.target.value,
                      filterMode: "range",
                      range: null,
                      date: null,
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
                  onChange={(e) =>
                    patchParams({
                      to: e.target.value,
                      filterMode: "range",
                      range: null,
                      date: null,
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

        {/* Table */}
        <DynamicTable
          currentPage={page}
          rowsPerPage={limit}
          totalPages={totalPages}
          columns={columns}
          data={attendance}
          loading={loading}
          pagination={true}
          searchable={true}
          showSerialNumber
          searchTerm={search}
          onSearchChange={(val) =>
            patchParams({ search: val || null, page: "1" })
          }
          onPageChange={(p) => patchParams({ page: String(p) })}
          onRowsPerPageChange={(l) =>
            patchParams({ limit: String(l), page: "1" })
          }
          striped
        />
      </div>
      {selectedAttendance && (
        <Modal
          title={`Attendance - ${selectedAttendance.salesperson.name}`}
          onClose={() => setSelectedAttendance(null)}
          width={700} // 👈 increase for better layout
        >
          <AttendanceDetails sessions={selectedAttendance.sessions} />
        </Modal>
      )}
    </div>
  );
}
