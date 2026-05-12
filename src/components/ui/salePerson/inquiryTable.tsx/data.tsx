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

import DOMPurify from "dompurify";
import { formatDateTime } from "@/src/utils/utils";

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
          <p
            className="text-sm font-medium text-(--text) line-clamp-1"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(row.description || "—"),
            }}
          />
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
          <div
            className="px-2 py-1 text-xs text-center rounded font-medium capitalize"
            style={{
              backgroundColor: variant.bg,
              color: variant.color,
            }}
          >
            {row.status.replace("_", " ")}
          </div>
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
        <div className="text-xs w-[120px] text-(--textMuted)">
          {/* {new Date(row.createdAt).toLocaleDateString()} */}
          {formatDateTime(row.createdAt)}
        </div>
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

  {
    key: "unassigned",
    label: "Unassigned",
    status: "unassigned",
    hideWhenAssignedPersonSelected: true,
  },

  { key: "assigned", label: "Assigned", status: "assigned" },
  { key: "in_progress", label: "In Progress", status: "in_progress" },
  { key: "follow_up", label: "Follow Up", status: "follow_up" },
  { key: "converted", label: "Converted", status: "converted" },
  { key: "not_interested", label: "Not Interested", status: "not_interested" },
  { key: "closed", label: "Closed", status: "closed" },
];
