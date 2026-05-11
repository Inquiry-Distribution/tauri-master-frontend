// AdminsPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Plus, Search } from "lucide-react";

import DynamicTable from "@/src/components/ui/table/dynamicTable";

import { useDebounce } from "@/src/utils/utils";

import { AdminUser, useGetAllAdmins } from "@/src/hooks/admin/useGetAllAdmins";

import { getAdminColumns } from "./data";
import ChangePasswordModal from "./changePassword/_form";
import CreateAdminForm from "./create/_form";
import { Modal } from "@/src/components/ui/modal";
import { useToggleActiveStatus } from "@/src/hooks/salesPerson/useToggleActive";
import { useDeleteAdmin } from "@/src/hooks/admin/useDeleteAdmin";
import Swal from "sweetalert2";

export default function AdminsPage() {
  const { tokens } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const [total, setTotal] = useState(0);

  const { getAllAdmins, loading } = useGetAllAdmins();
  const { toggleActiveStatus, loading: toggleLoading } =
    useToggleActiveStatus();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    deleteAdmin,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteAdmin();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [changePasswordUser, setChangePasswordUser] =
    useState<AdminUser | null>(null);

  const [createAdminOpen, setCreateAdminOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This admin will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: deleteLoading ? "Deleting..." : "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdmin(id);

      Swal.fire({
        icon: "success",
        title: "Admin deleted successfully",
      });

      // remove instantly from table
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete admin",
        text: err?.response?.data?.message || "Unknown error",
      });
    }
  };
  const columns = useMemo(
    () =>
      getAdminColumns({
        onChangePasswordModal: (user) => {
          setChangePasswordUser(user);
        },

        onStatusChange: async (updatedUser) => {
          try {
            setTogglingId(updatedUser.id);

            await toggleActiveStatus(updatedUser.id);

            setAdmins((prev) =>
              prev.map((admin) =>
                admin.id === updatedUser.id
                  ? {
                      ...admin,
                      isActive: updatedUser.isActive,
                    }
                  : admin,
              ),
            );
          } finally {
            setTogglingId(null);
          }
        },
        togglingId,
        onDelete: handleDelete,
        deleteLoading,
        deleteId,
      }),
    [toggleLoading],
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const query =
          `page=${page}&limit=${limit}` +
          (debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : "");

        const response = await getAllAdmins(query);

        setAdmins(response.data.users);

        setTotal(response.data.total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdmins();
  }, [page, limit, debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Admin Management
          </h1>

          <p className="text-sm" style={{ color: tokens.textSec }}>
            Manage all admin accounts.
          </p>
        </div>

        <button
          onClick={() => setCreateAdminOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          Add Admin
        </button>
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
            placeholder="Search by admin name, email or phone..."
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
      </div>

      <DynamicTable
        columns={columns}
        data={admins}
        rowKey={(row) => row.id}
        totalPages={Math.ceil(total / limit)}
        selectedRows={selectedRows}
        onSelectChange={(rows) => setSelectedRows(rows)}
        // selectable
        searchTerm={searchTerm}
        onSearchChange={(term) => setSearchTerm(term)}
        striped
        searchable={false}
        currentPage={page}
        rowsPerPage={limit}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(r) => setLimit(r)}
        loading={loading}
      />
      {changePasswordUser && (
        <ChangePasswordModal
          adminUser={changePasswordUser}
          onClose={() => setChangePasswordUser(null)}
        />
      )}
      {/* ✅ Create Admin Modal */}
      {createAdminOpen && (
        <Modal title="Create Admin" onClose={() => setCreateAdminOpen(false)}>
          <CreateAdminForm
            onSuccess={(user: any) => {
              setAdmins((prev) => {
                const exists = prev.some((p) => p.id === user.id);
                if (exists) return prev;
                return [user, ...prev];
              });
              setCreateAdminOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
