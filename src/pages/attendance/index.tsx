import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Search, Filter, Plus, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllAttendance } from "@/src/hooks/attendance/useGetAllAttendance";
import type { Attendance } from "@/src/types/attendance";
import Tabs from "@/src/components/ui/tabs";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { getAttendanceColumns, getAttendancePersonColumns } from "./data";
import { useGetAttendanceById } from "@/src/hooks/attendance/useGetAttendanceById";
import { PersonSelector } from "@/src/components/ui/attendance/personSelector";
import { SalesPerson } from "@/src/types/users";
import { useRef } from "react";
import Input from "@/src/components/ui/form/input";
import { Button } from "@/src/components/ui/button";

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
  const [showFilters, setShowFilters] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("30d");

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

  useEffect(() => {
    if (activeTab !== "byDate") return;

    // ✅ prevent refetch if already loaded
    if (attendance1.length > 0) return;

    const query = new URLSearchParams({
      ...(date ? { date } : {}),
    }).toString();

    getAllAttendance(query).then((res) => {
      setAttendance1(res?.data || []);
    });
  }, [date, activeTab]);

  // useEffect(() => {
  //   if (activeTab !== "byPerson") return;
  //   if (!personId) return;

  //   // ✅ prevent refetch if already loaded for same person
  //   if (attendance2.length > 0 && lastPersonIdRef.current === personId) return;

  //   getAttendancePerson(personId).then((res) => {
  //     setAttendance2(res?.data || []);
  //     lastPersonIdRef.current = personId;
  //   });
  // }, [personId, activeTab]);

  useEffect(() => {
    if (activeTab !== "byPerson") return;
    if (!personId) return;

    const queryObj = {
      ...(fromDate ? { fromDate } : {}),
      ...(toDate ? { toDate } : {}),
    };

    const queryString = new URLSearchParams(queryObj).toString();

    // prevent duplicate refetch for same person + same filters
    const cacheKey = `${personId}-${queryString}`;
    if (lastQueryRef.current === cacheKey) return;

    getAttendancePerson(`${personId}?${queryString}`).then((res) => {
      setAttendance2(res?.data || []);
      lastQueryRef.current = cacheKey;
    });
  }, [personId, activeTab, fromDate, toDate]);

  const applyRange = async (type: string) => {
    return;
    // const { from, to } = getDateRange(type);

    // const f = formatDate(from);
    // const t = formatDate(to);

    // setFrom(f);
    // setTo(t);

    // await getAttendance(f, t);
  };
  // const attendance = useMemo(() => {
  //   if (personId) {
  //     return personData || [];
  //   }

  //   return data || [];
  // }, [personId, personData, data]);
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

                <DynamicTable
                  currentPage={1}
                  rowsPerPage={10}
                  totalPages={totalPages}
                  columns={columns}
                  data={attendance1}
                  loading={loading}
                  pagination={false}
                  searchable={false}
                  showSerialNumber
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
                  >
                    <Filter size={18} />
                  </Button>
                </div>
                {showFilters && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={activeFilter === "7d" ? "primary" : "ghost"}
                        onClick={() => {
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
                          setActiveFilter("lastMonth");

                          applyRange("lastMonth");
                        }}
                      >
                        Last Month
                      </Button>
                    </div>
                    <div className=" w-1/3 grid lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-2">
                      <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
                        <Input
                          label="From"
                          inputName="from"
                          inputType="date"
                          inputValue={from}
                          onChange={(e) => setFrom(e.target.value)}
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
                          onChange={(e) => setTo(e.target.value)}
                          placeholder="To date"
                          showLabel={false}
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-end">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {}}
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
                  currentPage={1}
                  rowsPerPage={10}
                  totalPages={totalPages}
                  columns={columns2}
                  data={attendance2}
                  loading={loading2}
                  pagination={false}
                  searchable={false}
                  showSerialNumber
                  onRowClick={(row) => setPersonId(row.salespersonId)}
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
