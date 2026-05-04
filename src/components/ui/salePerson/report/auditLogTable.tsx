import { useEffect, useMemo, useState } from "react";

import { AuditLogUser } from "@/src/types/dashboard";
import { useTheme } from "@/src/contexts";
import { useGetRecentActivityLogsByUser } from "@/src/hooks/salesPerson/useGetRecentActByUser";
import DynamicTable from "../../table/dynamicTable";
import { TableColumn } from "../../table/types";

interface Props {
  userId: string;
}

export default function UserAuditLogTable({ userId }: Props) {
  const { tokens } = useTheme();

  const { data, loading, error, getRecentActivityLogsByUser } =
    useGetRecentActivityLogsByUser();

  // ── Pagination State ─────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ── Search State ────────────────────────────────
  const [search, setSearch] = useState("");

  // ── Fetch Data ──────────────────────────────────
  useEffect(() => {
    const query = `page=${currentPage}&limit=${rowsPerPage}`;
    getRecentActivityLogsByUser(userId, query);
  }, [userId, currentPage, rowsPerPage]);

  // ── Columns ─────────────────────────────────────
  const columns = useMemo(
    (): TableColumn<AuditLogUser>[] => [
      {
        key: "action",
        label: "Action",
        sortable: true,
      },
      {
        key: "targetModel",
        label: "Model",
        sortable: true,
      },
      {
        key: "meta",
        label: "Role",
        render: (row: AuditLogUser) => row.meta?.role || "—",
      },
      {
        key: "ipAddress",
        label: "IP Address",
      },
      {
        key: "createdAt",
        label: "Date",
        sortable: true,
        render: (row: AuditLogUser) => new Date(row.createdAt).toLocaleString(),
      },
    ],
    [],
  );

  // ── Derived Data ────────────────────────────────
  const logs = data?.logs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className=" bg-surface space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-warningLight font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Audit Logs
          </h1>
        </div>
      </div>
      {/* Error */}
      {error && (
        <div
          className="mb-3 text-sm px-3 py-2 rounded-md"
          style={{
            background: tokens.dangerLight,
            color: tokens.danger,
          }}
        >
          {error}
        </div>
      )}

      <DynamicTable<AuditLogUser>
        columns={columns}
        data={logs}
        loading={loading}
        emptyMessage="No audit logs found"
        // Pagination
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(val) => {
          setRowsPerPage(val);
          setCurrentPage(1);
        }}
        searchable={false}
        // Search
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        // UX
        striped
        showSerialNumber
      />
    </div>
  );
}
