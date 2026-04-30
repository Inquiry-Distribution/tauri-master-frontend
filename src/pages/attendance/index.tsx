import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import {
  Search,
  Filter,
  Plus,
  RefreshCcw,
  Calendar1,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllAttendance } from "@/src/hooks/attendance/useGetAllAttendance";

import Tabs from "@/src/components/ui/tabs";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { getAttendanceColumns, getAttendancePersonColumns } from "./data";
import { useGetAttendanceById } from "@/src/hooks/attendance/useGetAttendanceById";
import { PersonSelector } from "@/src/components/ui/attendance/personSelector";
import { SalesPerson } from "@/src/types/users";
import { useRef } from "react";
import Input from "@/src/components/ui/form/input";
import { Button } from "@/src/components/ui/button";
import { useDebounce } from "@/src/utils/utils";
import { exportAttendanceExcel } from "@/src/xls-convert/attendance.export";

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

export default function AttendancePage() {
  const { tokens } = useTheme();

  const [activeTab, setActiveTab] = useState("byDate");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default to today
  const [personId, setPersonId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<SalesPerson | null>(
    null,
  );

  const [filterMode, setFilterMode] = useState<"date" | "range">("date");
  const [showFilters1, setShowFilters1] = useState(false);
  const [activeFilter1, setActiveFilter1] = useState("30d");
  const [status1, setStatus1] = useState<string | null>(null);
  const [page1, setPage1] = useState(1);
  const [limit1, setLimit1] = useState(10);
  const [totalPages1, setTotalPages1] = useState(1);
  const [search1, setSearch1] = useState("");

  const [activeFilter, setActiveFilter] = useState("30d");

  const [attendance1, setAttendance1] = useState([]);

  // ✅ default dates
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const [from1, setFrom1] = useState(formatDate(oneMonthAgo));
  const [to1, setTo1] = useState(formatDate(today));

  const columns = useMemo(() => getAttendanceColumns(), []);

  const { data, loading, error, getAllAttendance } = useGetAllAttendance();

  const debouncedSearch = useDebounce(search1, 400);
  useEffect(() => {
    const queryObj: Record<string, string> = {
      ...(filterMode === "date" && date ? { date } : {}),
      ...(filterMode === "range" ? { from: from1, to: to1 } : {}),
      ...(status1 ? { status: status1 } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(page1 ? { page: String(page1) } : {}),
      ...(limit1 ? { limit: String(limit1) } : {}),
      ...(personId ? { salespersonId: personId } : {}),
    };

    const query = new URLSearchParams(queryObj).toString();

    getAllAttendance(query).then((res) => {
      const records = res?.data?.records || [];
      const total = res?.data?.total || 0;

      setAttendance1(records);
      setTotalPages1(Math.ceil(total / limit1));
    });
  }, [
    activeTab,
    date,
    from1, // ✅ add this
    to1, // ✅ add this
    status1,
    debouncedSearch,
    page1,
    limit1,
    personId,
  ]);

  const applyRange1 = (type: string) => {
    const { from, to } = getDateRange(type);
    setDate("");

    setFrom1(formatDate(from));
    setTo1(formatDate(to));

    setFilterMode("range"); // ✅ key
    setPage1(1);
  };
  const applyRange = (type: string) => {
    if (!personId) return; // ✅ guard

    const { from: fromDateObj, to: toDateObj } = getDateRange(type);

    const f = formatDate(fromDateObj);
    const t = formatDate(toDateObj);

    setFrom1(f);
    setTo1(t);
    setPage1(1); // ✅ reset pagination
  };

  useEffect(() => {
    if (personId) {
      setActiveFilter("30d");
      applyRange("30d");
    }
  }, [personId]);
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
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Calendar1
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
              onChange={(e) => {
                setDate(e.target.value);
                setFilterMode("date"); // ✅ key
                setPage1(1);
                setFrom1("");
                setTo1("");
                setActiveFilter1("");
              }}
            />
          </div>
          <PersonSelector
            setPersonId={setPersonId}
            setSelectedPerson={setSelectedPerson}
          />

          <Button
            variant="secondary"
            onClick={() => setShowFilters1((s) => !s)}
          >
            <Filter size={18} />
          </Button>
          <Button onClick={() => exportAttendanceExcel(attendance1)}>
            <Download size={18} />
          </Button>
        </div>
        {showFilters1 && (
          <>
            <div className="flex flex-wrap items-center justify-start gap-4">
              <div className="flex flex-wrap items-center justify-start gap-2">
                <div
                  className="text-sm font-medium"
                  style={{ color: tokens.textMuted }}
                >
                  Date Range:
                </div>
                <Button
                  size="sm"
                  variant={activeFilter1 === "7d" ? "primary" : "ghost"}
                  onClick={() => {
                    setActiveFilter1("7d");

                    applyRange1("7d");
                  }}
                >
                  Last 7 days
                </Button>

                <Button
                  size="sm"
                  variant={activeFilter1 === "30d" ? "primary" : "ghost"}
                  onClick={() => {
                    setActiveFilter1("30d");

                    applyRange1("30d");
                  }}
                >
                  Last 30 days
                </Button>

                <Button
                  size="sm"
                  variant={activeFilter1 === "thisMonth" ? "primary" : "ghost"}
                  onClick={() => {
                    setActiveFilter1("thisMonth");

                    applyRange1("thisMonth");
                  }}
                >
                  This Month
                </Button>

                <Button
                  size="sm"
                  variant={activeFilter1 === "lastMonth" ? "primary" : "ghost"}
                  onClick={() => {
                    setActiveFilter1("lastMonth");

                    applyRange1("lastMonth");
                  }}
                >
                  Last Month
                </Button>
              </div>
              {/* STATUS FILTER */}
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="text-sm font-medium"
                  style={{ color: tokens.textMuted }}
                >
                  Status:
                </div>

                <Button
                  size="sm"
                  variant={status1 === null ? "primary" : "ghost"}
                  onClick={() => {
                    setStatus1(null);
                    setPage1(1);
                  }}
                >
                  All
                </Button>

                <Button
                  size="sm"
                  variant={status1 === "present" ? "primary" : "ghost"}
                  onClick={() => {
                    setStatus1("present");
                    setPage1(1);
                  }}
                >
                  Present
                </Button>

                <Button
                  size="sm"
                  variant={status1 === "absent" ? "primary" : "ghost"}
                  onClick={() => {
                    setStatus1("absent");
                    setPage1(1);
                  }}
                >
                  Absent
                </Button>

                <Button
                  size="sm"
                  variant={status1 === "half_day" ? "primary" : "ghost"}
                  onClick={() => {
                    setStatus1("half_day");
                    setPage1(1);
                  }}
                >
                  Half Day
                </Button>
              </div>
            </div>
            <div className=" lg:w-1/3 md:w-1/2 w-full grid lg:grid-cols-10 md:grid-cols-6 grid-cols-4 gap-2">
              <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
                <Input
                  label="From"
                  inputName="from"
                  inputType="date"
                  inputValue={from1}
                  onChange={(e) => {
                    setFrom1(e.target.value);
                    setFilterMode("range"); // ✅ key
                    setActiveFilter1("");
                    setPage1(1);
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
                  inputValue={to1}
                  onChange={(e) => {
                    setTo1(e.target.value);
                    setFilterMode("range"); // ✅ key
                    setActiveFilter1("");
                    setPage1(1);
                  }}
                  placeholder="To date"
                  showLabel={false}
                />
              </div>
              {/* <div className="col-span-1 flex items-end justify-end">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setPage1(1); // trigger refetch
                          }}
                          disabled={loading}
                        >
                          
                          <RefreshCcw
                            className={loading ? "animate-spin" : ""}
                          />
                        </Button>
                      </div> */}
            </div>
          </>
        )}

        <DynamicTable
          currentPage={page1}
          rowsPerPage={limit1}
          totalPages={totalPages1}
          columns={columns}
          data={attendance1}
          loading={loading}
          pagination={true}
          searchable={true}
          showSerialNumber
          searchTerm={search1}
          onSearchChange={(val) => {
            setSearch1(val);
            setPage1(1);
          }}
          onPageChange={(p) => setPage1(p)}
          onRowsPerPageChange={(l) => {
            setLimit1(l);
            setPage1(1);
          }}
          striped
          // onRowClick={(row) => setPersonId(row.salespersonId)}
        />
      </div>
    </div>
  );
}

// const abcdtabcs=<Tabs
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         tabs={[
//           {
//             label: "By Date",
//             key: "byDate",
//             content: (
//               <>
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="relative flex-1">
//                     <Search
//                       size={18}
//                       className="absolute left-3 top-1/2 -translate-y-1/2"
//                       style={{ color: tokens.textMuted }}
//                     />
//                     <input
//                       type="date"
//                       placeholder="Search by date..."
//                       className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all"
//                       style={{
//                         backgroundColor: tokens.surface,
//                         borderColor: tokens.border,
//                         color: tokens.text,
//                       }}
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all"
//                     style={{
//                       backgroundColor: tokens.surface,
//                       borderColor: tokens.border,
//                       color: tokens.text,
//                     }}
//                   >
//                     <Filter size={18} />
//                     Filters
//                   </button>
//                 </div>

//                 {/* Table */}
//                 <DynamicTable<Attendance>
//                   columns={columns}
//                   data={attendance}
//                   loading={loading}
//                   currentPage={1}
//                   rowsPerPage={10}
//                   showRowsPerPage={false}
//                   totalPages={totalPages}
//                   searchable={false}
//                   pagination={false} // 👈 IMPORTANT (no pagination)
//                   striped
//                   showSerialNumber
//                   onRowClick={(row) => setSelectedUserId(row.salespersonId)}
//                 />
//               </>
//             ),
//           },
//           {
//             label: "By Person",
//             key: "byPerson",
//             content:(
//                 <>
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="relative flex-1">
//                     <Search
//                       size={18}
//                       className="absolute left-3 top-1/2 -translate-y-1/2"
//                       style={{ color: tokens.textMuted }}
//                     />
//                     <input
//                       type="date"
//                       placeholder="Search by date..."
//                       className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all"
//                       style={{
//                         backgroundColor: tokens.surface,
//                         borderColor: tokens.border,
//                         color: tokens.text,
//                       }}
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all"
//                     style={{
//                       backgroundColor: tokens.surface,
//                       borderColor: tokens.border,
//                       color: tokens.text,
//                     }}
//                   >
//                     <Filter size={18} />
//                     Filters
//                   </button>
//                 </div>

//                 {/* Table */}
//                 <DynamicTable<Attendance>
//                   columns={columns}
//                   data={attendance}
//                   loading={loading}
//                   currentPage={1}
//                   rowsPerPage={10}
//                   showRowsPerPage={false}
//                   totalPages={totalPages}
//                   searchable={false}
//                   pagination={false} // 👈 IMPORTANT (no pagination)
//                   striped
//                   showSerialNumber
//                   onRowClick={(row) => setSelectedUserId(row.salespersonId)}
//                 />
//               </>
//             ),
//         }

//         ]}
//       />
