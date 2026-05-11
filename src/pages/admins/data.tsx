// data.tsx

import { Button } from "@/src/components/ui/button";
import { TableColumn } from "@/src/components/ui/table/types";

export type AdminColumnDeps = {
  onChangePasswordModal: (user: any) => void;
};

export const getAdminColumns = ({
  onChangePasswordModal,
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
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-md font-medium ${
            row.isActive
              ? "bg-(--successLight) text-(--success)"
              : "bg-(--dangerLight) text-(--danger)"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
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
          </div>
        );
      },
    },
  ];
};
