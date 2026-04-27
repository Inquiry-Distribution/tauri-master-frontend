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
} from "lucide-react";
import { cn } from "../../utils/utils";
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
import EditInquiryForm from "./edit/_form";
// import { exportInquiryExcel } from "@/src/xls-convert/inquiry.export";

export default function InquiriesPage() {
  const { tokens } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

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
        <Button onClick={() => exportInquiryStyled(inquiries)}>
          <Download size={18} />
        </Button>
      </div>

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
