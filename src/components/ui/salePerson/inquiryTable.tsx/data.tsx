import { Inquiry } from "@/src/types/inquiry";
import { TableColumn } from "../../table/types";
import { Link } from "react-router-dom";
import { useTheme } from "@/src/contexts";
import {
  getPriorityStyleMap,
  getStatusStyleMap,
} from "@/src/pages/inquiries/create/inquiryStyles";
import { Avatar } from "../../avatar";
import { Button } from "../../button";
import ButtonLoader from "../../loader/buttonLoader";

export const getInquiryColumns = (): TableColumn<Inquiry>[] => {
  return [
    {
      key: "id",
      label: "INQ ID",
      render: (row) => (
        <span className="text-xs text-(--textMuted)">
          {row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },

    {
      key: "description",
      label: "Inquiry",
      render: (row) => (
        <Link
          className="max-w-[260px] cursor-pointer"
          to={`/inquiries/${row.id}`}
        >
          <p className="text-sm font-medium text-(--text) line-clamp-1">
            {row.description || "—"}
          </p>
          <p className="text-xs text-(--textMuted)">
            {row.mobile || "No contact"}
          </p>
        </Link>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        const { isDark } = useTheme();
        const styles = getPriorityStyleMap(isDark);

        const variant = styles[row.priority as keyof typeof styles];

        return (
          <span
            style={{
              ...variant,
              padding: "2px 8px",
              fontSize: "12px",
              borderRadius: "6px",
              textTransform: "capitalize",
            }}
          >
            {row.priority}
          </span>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      render: (row) => {
        const { isDark } = useTheme();
        const styles = getStatusStyleMap(isDark);

        const variant = styles[row.status as keyof typeof styles];

        return (
          <span
            className="px-2 py-1 text-xs rounded font-medium capitalize"
            style={{
              backgroundColor: variant.bg,
              color: variant.color,
            }}
          >
            {row.status.replace("_", " ")}
          </span>
        );
      },
    },

    // {
    //   key: "assignedTo",
    //   label: "Assignee",
    //   render: (row) =>
    //     row.assignedTo ? (
    //       <button
    //         title="Send Notification to Assignee"
    //         className="flex items-center gap-2 cursor-pointer"
    //         onClick={() => setSelectedUserId(row.assignedTo!.id)}
    //       >
    //         <Avatar name={row.assignedTo.name} size="sm" variant="solid" />
    //       </button>
    //     ) : (
    //       <span className="text-xs text-(--textMuted)">Unassigned</span>
    //     ),
    // },

    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <span className="text-xs text-(--textMuted)">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },

    // {
    //   key: "actions",
    //   label: "Action",
    //   render: (row) =>
    //     row.status === "assigned" ? (
    //       <Button variant="secondary">Reassign</Button>
    //     ) : (
    //       <Button variant="primary">Assign</Button>
    //     ),
    // },
    // {
    //   key: "actions",
    //   label: "Action",
    //   render: (row) => (
    //     <div className="flex w-full items-center justify-start gap-2">
    //       <Button
    //         variant={row.status === "assigned" ? "secondary" : "primary"}
    //         onClick={() => setSelectedInquiry(row)}
    //       >
    //         {row.status === "assigned" ? "Reassign" : "Assign"}
    //       </Button>
    //       <Button variant="secondary" onClick={() => setEditInquiry(row)}>
    //         <Edit size={16} />
    //       </Button>
    //       <Button variant="danger" onClick={() => onDelete(row.id)}>
    //         {deleteLoading ? <ButtonLoader /> : <Trash size={16} />}
    //       </Button>
    //     </div>
    //   ),
    // },
  ];
};

export const tabFilters = [
  { key: "all", label: "All", status: "" },
  { key: "assigned", label: "Assigned", status: "assigned" },
  // { key: "unassigned", label: "Unassigned", status: "unassigned" },
  { key: "in_progress", label: "In Progress", status: "in_progress" },
  { key: "closed", label: "Closed", status: "closed" },
];
