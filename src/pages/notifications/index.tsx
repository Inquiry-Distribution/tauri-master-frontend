import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Plus, Radio, Speaker } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useGetInquiries } from "@/src/hooks/inquiry/useGetAllInquiry";
import { Inquiry } from "@/src/types/inquiry";
import { NotificationForm } from "@/src/components/ui/notification/notificationForm";
import { Modal } from "@/src/components/ui/modal";

import { useDeleteInquiry } from "@/src/hooks/inquiry/useDeleteInquiry";
import Swal from "sweetalert2";

import { getSalesPersonColumns } from "./data";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import {
  useSalesPerson,
  useSalesPerson1,
} from "@/src/hooks/salesPerson/useSalesPerson";
import { SalesPerson } from "@/src/types/users";
import { mapSalesPerson } from "../users";
import { BroadcastForm } from "@/src/components/ui/notification/broadcastForm";
import { useDebounce } from "@/src/utils/utils";
// import { exportInquiryExcel } from "@/src/xls-convert/inquiry.export";

export default function NotificationsPage() {
  const { tokens } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [multiNotificationOpen, setMultiNotificationOpen] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { getAllSalesPerson, loading, error } = useSalesPerson1();
  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);

  const columns = useMemo(
    () =>
      getSalesPersonColumns({
        onSendNotification: (user) => {
          setSelectedUser(user);
          setNotificationOpen(true);
        },
      }),
    [],
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : "");

    getAllSalesPerson(query);
  }, [activeTab, page, limit, debouncedSearchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSalesPerson(`page=${page}&limit=${limit}`);

        setSalesPersons(data.data);

        // ⚠️ adjust based on your API response structure
        // setSalesPersons(data?.data || data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Notifications Management
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            distribute all incoming notifications.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            onClick={() => {
              if (selectedRows.length > 0) {
                setMultiNotificationOpen(true);
              } else
                Swal.fire({
                  icon: "info",
                  title: "No users selected",
                  text: "Please select at least one user to send notifications.",
                });
            }}
          >
            <Radio size={18} />
            Send Notification
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            // onClick={() => navigate("/inquiries/create")}
          >
            <Radio size={18} />
            Broadcast Notification
          </button>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row gap-4">
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
      </div> */}

      <DynamicTable
        columns={columns}
        data={salesPersons}
        rowKey={(row) => row.id}
        totalPages={Math.ceil(salesPersons.length / limit)}
        selectedRows={selectedRows}
        onSelectChange={(rows) => setSelectedRows(rows)}
        selectable
        searchTerm={searchTerm}
        onSearchChange={(term) => setSearchTerm(term)}
        striped
        pagination
        currentPage={page}
        rowsPerPage={limit}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(r) => setLimit(r)}
        loading={loading}
      />
      {notificationOpen && (
        <Modal
          title="Send Notification"
          onClose={() => {
            setNotificationOpen(false);
            setSelectedUser(null);
          }}
          width={520}
        >
          <NotificationForm
            recipientIds={selectedUser ? [selectedUser.id] : []}
            onClose={() => {
              setNotificationOpen(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      )}
      {multiNotificationOpen && (
        <Modal
          title="Send Notification to Selected Users(s)"
          onClose={() => {
            setMultiNotificationOpen(false);
            setSelectedUser(null);
          }}
          width={520}
        >
          <NotificationForm
            recipientIds={selectedRows.map((row) => row.id)}
            onClose={() => {
              setNotificationOpen(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      )}
      {showBroadcastModal && (
        <Modal
          title="Broadcast Notification"
          onClose={() => setShowBroadcastModal(false)}
        >
          <BroadcastForm onClose={() => setShowBroadcastModal(false)} />
        </Modal>
      )}
    </div>
  );
}
