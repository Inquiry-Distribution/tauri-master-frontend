// AdminsPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts";
import { Search } from "lucide-react";

import DynamicTable from "@/src/components/ui/table/dynamicTable";

import { useDebounce } from "@/src/utils/utils";

import { AdminUser, useGetAllAdmins } from "@/src/hooks/admin/useGetAllAdmins";

import { getAdminColumns } from "./data";
import ChangePasswordModal from "./changePassword/_form";

export default function AdminsPage() {
  const { tokens } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const [total, setTotal] = useState(0);

  const { getAllAdmins, loading } = useGetAllAdmins();

  const [changePasswordUser, setChangePasswordUser] =
    useState<AdminUser | null>(null);

  const columns = useMemo(
    () =>
      getAdminColumns({
        onChangePasswordModal: (user) => {
          setChangePasswordUser(user);
        },
      }),
    [],
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
    </div>
  );
}
