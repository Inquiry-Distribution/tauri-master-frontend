import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Search, Filter, Plus } from "lucide-react";
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

export default function AttendancePage() {
  const { tokens } = useTheme();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("byDate");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default to today
  const [personId, setPersonId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<SalesPerson | null>(
    null,
  );
  const lastPersonIdRef = useRef<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const shouldFetch = Boolean(date || personId);
  const [attendance1, setAttendance1] = useState([]);
  const [attendance2, setAttendance2] = useState([]);
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
  // Fetch once + when date changes
  //   useEffect(() => {
  //     const query = new URLSearchParams({
  //       ...(date ? { date } : {}),
  //     }).toString();

  //     getAllAttendance(query);
  //   }, [date]);
  // useEffect(() => {
  //   if (!shouldFetch) return;

  //   const query = new URLSearchParams({
  //     ...(date ? { date } : {}),
  //   }).toString();

  //   if (personId) {
  //     getAttendancePerson(personId);
  //   } else {
  //     getAllAttendance(query);
  //   }
  // }, [date, personId]);

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

  useEffect(() => {
    if (activeTab !== "byPerson") return;
    if (!personId) return;

    // ✅ prevent refetch if already loaded for same person
    if (attendance2.length > 0 && lastPersonIdRef.current === personId) return;

    getAttendancePerson(personId).then((res) => {
      setAttendance2(res?.data || []);
      lastPersonIdRef.current = personId;
    });
  }, [personId, activeTab]);

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
                <PersonSelector
                  setPersonId={setPersonId}
                  setSelectedPerson={setSelectedPerson}
                />

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
