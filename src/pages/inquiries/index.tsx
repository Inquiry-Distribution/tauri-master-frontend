import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { cn } from "../../utils/utils";
// import { Inquiry } from "../../types";
import { TableColumn } from "@/src/components/ui/table/types";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { useNavigate } from "react-router-dom";
import Tabs from "@/src/components/ui/tabs";
import { columns, tabFilters } from "./data";
import { useGetInquiries } from "@/src/hooks/inquiry/useGetAllInquiry";
import { Inquiry } from "@/src/types/inquiry";

// type InquiryRow = {
//   id: number;
//   customerName: string;
//   email: string;
//   phone: string;
//   source: string;
//   status: "assigned" | "unassigned";
//   description: string;
//   location: { lat: number; lng: number; address: string };
//   assignedTo?: string | null;
//   createdAt: string;
// };

// const mockInquiries: InquiryRow[] = [
//   {
//     id: 1,
//     customerName: "Alice Johnson",
//     email: "alice@example.com",
//     phone: "+1 234 567 890",
//     source: "Website",
//     status: "unassigned",
//     createdAt: "2024-03-20T10:00:00Z",
//     description: "Interested in premium plan",
//     location: { lat: 40.7128, lng: -74.006, address: "New York, NY" },
//   },
//   {
//     id: 2,
//     customerName: "Bob Smith",
//     email: "bob@example.com",
//     phone: "+1 987 654 321",
//     source: "Referral",
//     status: "assigned",
//     assignedTo: "sales-1",
//     createdAt: "2024-03-19T15:30:00Z",
//     description: "Needs a demo of the dashboard",
//     location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
//   },
//   {
//     id: 3,
//     customerName: "Charlie Brown",
//     email: "charlie@example.com",
//     phone: "+1 555 000 111",
//     source: "Social Media",
//     status: "unassigned",
//     createdAt: "2024-03-20T09:15:00Z",
//     description: "Pricing inquiry for enterprise",
//     location: { lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
//   },
// ];

// const inquiryColumns: TableColumn<InquiryRow>[] = [
//   {
//     key: "customerName",
//     label: "Customer",
//     sortable: true,
//     render: (row) => (
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
//           {row.customerName.charAt(0)}
//         </div>
//         <div>
//           <p className="font-bold text-sm text-(--text)">{row.customerName}</p>
//           <p className="text-xs text-(--textSec)">{row.email}</p>
//         </div>
//       </div>
//     ),
//   },

//   {
//     key: "source",
//     label: "Source",
//     sortable: true,
//     render: (row) => (
//       <span className="text-sm text-(--textSec)">{row.source}</span>
//     ),
//   },

//   {
//     key: "status",
//     label: "Status",
//     sortable: true,
//     render: (row) =>
//       row.status === "unassigned" ? (
//         <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-(--warningLight) text-(--warning)">
//           <AlertCircle size={12} />
//           Unassigned
//         </span>
//       ) : (
//         <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-(--successLight) text-(--success)">
//           <CheckCircle size={12} />
//           Assigned
//         </span>
//       ),
//   },

//   {
//     key: "assignedTo",
//     label: "Assigned To",
//     render: (row) =>
//       row.assignedTo ? (
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
//           <span className="text-sm font-medium text-(--text)">
//             Sales Agent {row.assignedTo.split("-")[1]}
//           </span>
//         </div>
//       ) : (
//         <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
//           <UserPlus size={14} />
//           Assign Now
//         </button>
//       ),
//   },

//   {
//     key: "createdAt",
//     label: "Date",
//     sortable: true,
//     render: (row) => (
//       <div className="flex items-center gap-1.5 text-sm text-(--textSec)">
//         <Clock size={14} />
//         {new Date(row.createdAt).toLocaleDateString()}
//       </div>
//     ),
//   },

//   {
//     key: "actions",
//     label: "Actions",
//     align: "right",
//     render: () => (
//       <button
//         title="More Actions"
//         className="p-2 rounded-lg hover:bg-(--borderLight) transition-colors"
//       >
//         <MoreHorizontal size={18} className="text-(--textMuted)" />
//       </button>
//     ),
//   },
// ];
export default function InquiriesPage() {
  const { tokens } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, loading, error, getInquiries } = useGetInquiries();
  useEffect(() => {
    const selected = tabFilters.find((t) => t.key === activeTab);

    const query =
      `page=${page}&limit=${limit}` +
      (selected?.status ? `&status=${selected.status}` : "") +
      (searchTerm ? `&search=${searchTerm}` : "");

    getInquiries(query);
  }, [activeTab, page, limit, searchTerm]);

  const handlePageChange = (newPage: number) => {
    getInquiries(`page=${newPage}&limit=${limit}`);
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
        </div>
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

      {/* <Tabs
        variant="solid"
        tabs={[
          {
            key: "all",
            label: "All",
            content: (
              <div className="overflow-x-auto">
                <DynamicTable
                  searchable={false}
                  columns={columns}
                  data={data}
                  currentPage={1}
                  rowsPerPage={10}
                  totalPages={1}
                />
              </div>
            ),
          },
          {
            key: "assigned",
            label: "Assigned",
            content: (
              <div className="overflow-x-auto">
                <DynamicTable
                  searchable={false}
                  columns={columns}
                  data={data.filter((item) => item.status === "assigned")}
                  currentPage={1}
                  rowsPerPage={10}
                  totalPages={1}
                />
              </div>
            ),
          },
          {
            key: "unassigned",
            label: "Unassigned",
            content: (
              <div className="overflow-x-auto">
                <DynamicTable
                  searchable={false}
                  columns={columns}
                  data={data.filter((item) => item.status === "unassigned")}
                  currentPage={1}
                  rowsPerPage={10}
                  totalPages={1}
                />
              </div>
            ),
          },
          {
            key: "closed",
            label: "Closed",
            content: (
              <div className="overflow-x-auto">
                <DynamicTable
                  searchable={false}
                  columns={columns}
                  data={data.filter((item) => item.status === "closed")}
                  currentPage={1}
                  rowsPerPage={10}
                  totalPages={1}
                />
              </div>
            ),
          },
        ]}
      /> */}

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

      {/* <div
        className="rounded-2xl p-4 border overflow-hidden"
        style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
      >
        <div className="overflow-x-auto">
          <DynamicTable
            columns={inquiryColumns}
            data={mockInquiries}
            currentPage={1}
            rowsPerPage={10}
            totalPages={1}
          />
          
        </div>
      </div> */}
    </div>
  );
}
