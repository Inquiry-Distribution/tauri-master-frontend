import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Search, Filter, Plus, RefreshCcw, Calendar1 } from "lucide-react";
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

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("byDate");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default to today
  const [personId, setPersonId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<SalesPerson | null>(
    null,
  );
  const [showFilters1, setShowFilters1] = useState(false);
  const [status1, setStatus1] = useState<string | null>(null);
  const [page1, setPage1] = useState(1);
  const [limit1, setLimit1] = useState(10);
  const [totalPages1, setTotalPages1] = useState(1);
  const [search1, setSearch1] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("30d");
  const [status2, setStatus2] = useState<string | null>(null);
  const [page2, setPage2] = useState(1);
  const [limit2, setLimit2] = useState(10);
  const [totalPagesPerson2, setTotalPagesPerson2] = useState(1);

  const lastQueryRef = useRef<string | null>(null);
  const lastPersonIdRef = useRef<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const shouldFetch = Boolean(date || personId);
  const [attendance1, setAttendance1] = useState([]);
  const [attendance2, setAttendance2] = useState([]);
  // ✅ default dates
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [from, setFrom] = useState(formatDate(oneMonthAgo));
  const [to, setTo] = useState(formatDate(today));
  const columns = useMemo(
    () =>
      getAttendanceColumns({
        setSelectedUserId,
      }),
    [setSelectedUserId],
  );
  const columns2 = useMemo(
    () =>
      getAttendancePersonColumns({
        setSelectedUserId,
        selectedPerson,
      }),
    [setSelectedUserId, selectedPerson],
  );
  const { data, loading, error, getAllAttendance } = useGetAllAttendance();
  const {
    getAttendancePerson,
    data: personData,
    loading: loading2,
  } = useGetAttendanceById();

  const debouncedSearch = useDebounce(search1, 400);
  useEffect(() => {
    if (activeTab !== "byDate") return;

    const queryObj: Record<string, string> = {
      ...(date ? { date } : {}),
      ...(status1 ? { status: status1 } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(page1 ? { page: String(page1) } : {}),
      ...(limit1 ? { limit: String(limit1) } : {}),
    };

    const query = new URLSearchParams(queryObj).toString();

    getAllAttendance(query).then((res) => {
      const records = res?.data?.records || [];
      const total = res?.data?.total || 0;

      setAttendance1(records);
      setTotalPages1(Math.ceil(total / limit1));
    });
  }, [activeTab, date, status1, debouncedSearch, page1, limit1]);
  // useEffect(() => {
  //   if (activeTab !== "byPerson") return;
  //   if (!personId) return;

  //   const queryObj = {
  //     ...(fromDate ? { fromDate } : {}),
  //     ...(toDate ? { toDate } : {}),
  //   };

  //   const queryString = new URLSearchParams(queryObj).toString();

  //   // prevent duplicate refetch for same person + same filters
  //   const cacheKey = `${personId}-${queryString}`;
  //   if (lastQueryRef.current === cacheKey) return;

  //   getAttendancePerson(`${personId}?${queryString}`).then((res) => {
  //     setAttendance2(res?.data || []);
  //     lastQueryRef.current = cacheKey;
  //   });
  // }, [personId, activeTab, fromDate, toDate]);

  useEffect(() => {
    if (activeTab !== "byPerson") return;
    if (!personId) return;

    const queryObj: Record<string, string> = {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(status2 ? { status: status2 } : {}),
      ...(page2 ? { page: String(page2) } : {}),
      ...(limit2 ? { limit: String(limit2) } : {}),
    };

    const queryString = new URLSearchParams(queryObj).toString();

    const cacheKey = `${personId}-${queryString}`;
    if (lastQueryRef.current === cacheKey) return;

    getAttendancePerson(personId, queryString).then((res) => {
      setAttendance2(res?.data?.records || []);

      // ✅ IMPORTANT: update total pages
      const total = res?.data?.total || 0;
      const lim = limit2;

      setTotalPagesPerson2(Math.ceil(total / lim));

      lastQueryRef.current = cacheKey;
    });
  }, [personId, activeTab, from, to, status2, page2, limit2]);
  const applyRange = (type: string) => {
    if (!personId) return; // ✅ guard

    const { from: fromDateObj, to: toDateObj } = getDateRange(type);

    const f = formatDate(fromDateObj);
    const t = formatDate(toDateObj);

    setFrom(f);
    setTo(t);
    setPage2(1); // ✅ reset pagination
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
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            label: "By Date",
            key: "byDate",
            content: (
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
                        setPage1(1);
                      }}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowFilters1((s) => !s)}
                  >
                    <Filter size={18} />
                  </Button>
                </div>
                {showFilters1 && (
                  <>
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
                  // onRowClick={(row) => setPersonId(row.salespersonId)}
                />
              </div>
            ),
          },

          {
            label: "By Person",
            key: "byPerson",
            content: (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <PersonSelector
                    setPersonId={setPersonId}
                    setSelectedPerson={setSelectedPerson}
                  />

                  <Button
                    variant="secondary"
                    onClick={() => setShowFilters((s) => !s)}
                    disabled={!personId || personId === ""}
                  >
                    <Filter size={18} />
                  </Button>
                </div>
                {showFilters && !(!personId || personId === "") && (
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
                          variant={activeFilter === "7d" ? "primary" : "ghost"}
                          onClick={() => {
                            if (!personId) return; // ✅ guard
                            setActiveFilter("7d");

                            applyRange("7d");
                          }}
                        >
                          Last 7 days
                        </Button>

                        <Button
                          size="sm"
                          variant={activeFilter === "30d" ? "primary" : "ghost"}
                          onClick={() => {
                            if (!personId) return; // ✅ guard
                            setActiveFilter("30d");

                            applyRange("30d");
                          }}
                        >
                          Last 30 days
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            activeFilter === "thisMonth" ? "primary" : "ghost"
                          }
                          onClick={() => {
                            if (!personId) return; // ✅ guard
                            setActiveFilter("thisMonth");

                            applyRange("thisMonth");
                          }}
                        >
                          This Month
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            activeFilter === "lastMonth" ? "primary" : "ghost"
                          }
                          onClick={() => {
                            if (!personId) return; // ✅ guard
                            setActiveFilter("lastMonth");

                            applyRange("lastMonth");
                          }}
                        >
                          Last Month
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center justify-start gap-2">
                        <div
                          className="text-sm font-medium"
                          style={{ color: tokens.textMuted }}
                        >
                          Status:
                        </div>
                        <Button
                          size="sm"
                          variant={status2 === null ? "primary" : "ghost"}
                          onClick={() => setStatus2(null)}
                        >
                          All
                        </Button>

                        <Button
                          size="sm"
                          variant={status2 === "present" ? "primary" : "ghost"}
                          onClick={() => setStatus2("present")}
                        >
                          Present
                        </Button>

                        <Button
                          size="sm"
                          variant={status2 === "absent" ? "primary" : "ghost"}
                          onClick={() => setStatus2("absent")}
                        >
                          Absent
                        </Button>

                        <Button
                          size="sm"
                          variant={status2 === "half_day" ? "primary" : "ghost"}
                          onClick={() => setStatus2("half_day")}
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
                          inputValue={from}
                          onChange={(e) => {
                            if (!personId) return;
                            setFrom(e.target.value);
                            setActiveFilter(""); // ✅ unset preset
                            setPage2(1);
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
                            if (!personId) return;
                            setTo(e.target.value);
                            setActiveFilter(""); // ✅ unset preset
                            setPage2(1);
                          }}
                          placeholder="To date"
                          showLabel={false}
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-end">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setPage2(1); // trigger refetch
                          }}
                          disabled={loading}
                        >
                          {/* {loading ? <ButtonLoader/> : <RefreshCcw/>} */}
                          <RefreshCcw
                            className={loading ? "animate-spin" : ""}
                          />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <DynamicTable
                  currentPage={page2}
                  rowsPerPage={limit2}
                  totalPages={totalPagesPerson2}
                  columns={columns2}
                  data={attendance2}
                  loading={loading2}
                  pagination={true}
                  searchable={false}
                  showSerialNumber
                  onRowClick={(row) => setPersonId(row.salespersonId)}
                  onPageChange={(p) => setPage2(p)} // ✅ important
                  onRowsPerPageChange={(l) => {
                    setLimit2(l);
                    setPage2(1); // reset page
                  }}
                />
              </div>
            ),
          },
        ]}
      />
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
