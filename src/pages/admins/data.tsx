// data.tsx

import { Button } from "@/src/components/ui/button";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { TableColumn } from "@/src/components/ui/table/types";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

export type AdminColumnDeps = {
  onChangePasswordModal: (user: any) => void;
  onStatusChange?: (updatedUser: any) => void;
  togglingId?: string | null;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
  deleteId?: string | null;
};

export const getAdminColumns = ({
  onChangePasswordModal,
  onStatusChange,
  togglingId,
  onDelete,
  deleteLoading,
  deleteId,
}: AdminColumnDeps): TableColumn<any>[] => {
  return [
    {
      key: "name",
      label: "Admin",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-(--text)">{row.name}</span>

          <span className="text-xs text-(--textMuted)">
            {row.role} • {row.createdBy?.name || "—"}
          </span>
        </div>
      ),
    },

    {
      key: "email",
      label: "Email",
      render: (row) => (
        <span className="text-sm text-(--textMuted)">{row.email}</span>
      ),
    },

    {
      key: "phone",
      label: "Phone",
      render: (row) => (
        <span className="text-sm text-(--textMuted)">{row.phone || "—"}</span>
      ),
    },

    {
      key: "status",
      label: "Status",
      align: "center",

      render: (row) => {
        const handleToggleStatus = async () => {
          try {
            await onStatusChange?.({
              ...row,
              isActive: !row.isActive,
            });
          } catch {
            Swal.fire({
              icon: "error",
              title: "Failed to toggle status",
            });
          }
        };

        return (
          <Button
            type="button"
            variant="ghost"
            onClick={handleToggleStatus}
            style={{
              background: row.isActive
                ? "var(--successLight)"
                : "var(--dangerLight)",

              color: row.isActive ? "var(--success)" : "var(--danger)",
            }}
          >
            {togglingId === row.id ? (
              <ButtonLoader />
            ) : row.isActive ? (
              "Active"
            ) : (
              "Inactive"
            )}
          </Button>
        );
      },
    },

    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-(--textMuted)">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      align: "center",
      render: (row) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                onChangePasswordModal(row);
              }}
              variant="secondary"
            >
              Change Password
            </Button>
            <Button
              onClick={() => {
                onDelete(row.id);
              }}
              variant="danger"
              disabled={deleteId === row.id}
            >
              <Trash size={18} />
            </Button>
          </div>
        );
      },
    },
  ];
};
