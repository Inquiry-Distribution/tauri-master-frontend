import { TableColumn } from "@/src/components/ui/table/types";
import { SalesPerson } from "@/src/types/users";

export type SalesPersonColumnDeps = {
  onSendNotification: (user: any) => void;
};

export const getSalesPersonColumns = ({
  onSendNotification,
}: SalesPersonColumnDeps): TableColumn<any>[] => {
  return [
    {
      key: "name",
      label: "Salesperson",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-(--text)">{row.name}</span>
          <span className="text-xs text-(--textMuted)">
            {row.employeeId} • {row.assignedArea || "—"}
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
      key: "assignedArea",
      label: "Area",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-(--text)">
          {row.assignedArea || "Unassigned"}
        </span>
      ),
    },

    // {
    //   key: "inquiries",
    //   label: "Inquiries",
    //   align: "center",
    //   render: (row) => (
    //     <div className="flex flex-col items-center">
    //       <span className="font-medium text-(--text)">
    //         {row.inquiries?.total ?? 0}
    //       </span>
    //       <span className="text-xs text-(--textMuted)">
    //         Conv: {row.inquiries?.conversionRate ?? "0%"}
    //       </span>
    //     </div>
    //   ),
    // },

    // {
    //   key: "status",
    //   label: "Status",
    //   align: "center",
    //   render: (row) => (
    //     <span
    //       className={`px-2 py-1 text-xs rounded-md font-medium ${
    //         row.isActive
    //           ? "bg-(--successLight) text-(--success)"
    //           : "bg-(--dangerLight) text-(--danger)"
    //       }`}
    //     >
    //       {row.isActive ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },

    // {
    //   key: "createdAt",
    //   label: "Created",
    //   sortable: true,
    //   render: (row) => (
    //     <span className="text-xs text-(--textMuted)">
    //       {new Date(row.createdAt).toLocaleDateString()}
    //     </span>
    //   ),
    // },

    // ─────────────────────────────────────────────
    // ACTIONS COLUMN (fully functional)
    // ─────────────────────────────────────────────
    {
      key: "actions",
      label: "Actions",
      align: "center",
      render: (row) => {
        return (
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSendNotification(row);
              }}
              className="px-2 py-1 text-xs rounded-md bg-(--accentLight) text-(--accentText)"
            >
              Notify
            </button>
          </div>
        );
      },
    },
  ];
};
