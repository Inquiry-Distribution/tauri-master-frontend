import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";

import { TableColumn } from "@/src/components/ui/table/types";
import { useTheme } from "@/src/contexts";
import { Inquiry } from "@/src/types/inquiry";

import { Link } from "react-router-dom";
import { useState } from "react";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { Edit, Recycle, Trash } from "lucide-react";
import {
  getPriorityStyleMap,
  getStatusStyleMap,
} from "../create/inquiryStyles";
import DOMPurify from "dompurify";

type ColumnDeps = {
  setSelectedUserId: (id: string) => void;
  setSelectedInquiry: (inquiry: Inquiry | null) => void;
  deleteLoading: boolean;
  onDelete: (inquiry: Inquiry) => Promise<void>; // 👈 add this
  deletingId: string | null;
  restoringId: string | null;
  restoreLoading: boolean;
  onRestore: (inquiry: Inquiry) => Promise<void>; // 👈 add this
  tokens?: any;
  setEditInquiry: (inquiry: Inquiry | null) => void;
};

export const getInquiryColumns = ({
  setSelectedUserId,
  setSelectedInquiry,
  deleteLoading,
  onDelete,
  setEditInquiry,
  deletingId,
  restoringId,
  restoreLoading,
  onRestore,
}: ColumnDeps): TableColumn<Inquiry>[] => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isSuperUser = userData?.role === "superuser";
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
        <>
          <p
            className="text-sm font-medium text-(--text) line-clamp-1"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(row.description || "—"),
            }}
          ></p>
          <p className="text-xs text-(--textMuted)">
            {row.mobile || "No contact"}
          </p>
        </>
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

    {
      key: "assignedTo",
      label: "Assignee",
      render: (row) =>
        row.assignedTo ? (
          <button
            title="Send Notification to Assignee"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedUserId(row.assignedTo!.id)}
          >
            <Avatar name={row.assignedTo.name} size="sm" variant="solid" />
          </button>
        ) : (
          <span className="text-xs text-(--textMuted)">Unassigned</span>
        ),
    },

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
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div className="flex w-full items-center justify-start gap-2">
          {/* <Button
            variant={row.status !== "unassigned" ? "secondary" : "primary"}
            onClick={() => setSelectedInquiry(row)}
          >
            {row.status !== "unassigned" ? "Reassign" : "Assign"}
          </Button>
          <Button variant="secondary" onClick={() => setEditInquiry(row)}>
            <Edit size={16} />
          </Button> */}
          {isSuperUser && (
            <Button variant="success" onClick={() => onRestore(row)}>
              {restoringId === row.id ? (
                <ButtonLoader />
              ) : (
                <Recycle size={16} />
              )}
            </Button>
          )}
          {isSuperUser && (
            <Button variant="danger" onClick={() => onDelete(row)}>
              {deletingId === row.id ? <ButtonLoader /> : <Trash size={16} />}
            </Button>
          )}
        </div>
      ),
    },
  ];
};

export const tabFilters = [
  { key: "all", label: "All", status: "" },
  { key: "unassigned", label: "Unassigned", status: "unassigned" },
  { key: "assigned", label: "Assigned", status: "assigned" },
  { key: "in_progress", label: "In Progress", status: "in_progress" },
  { key: "closed", label: "Closed", status: "closed" },
];
// export const data: Inquiry[] = [
//   {
//     id: "INQ-001",
//     customer: "Rajesh Kumar",
//     product: "Industrial Pump",
//     date: "2025-04-01",
//     priority: "high",
//     status: "assigned",
//     assignee: { name: "Arjun", initials: "AS" },
//   },
//   {
//     id: "INQ-002",
//     customer: "Anita Singh",
//     product: "Control Panel",
//     date: "2025-04-02",
//     priority: "urgent",
//     status: "unassigned",
//   },
//   {
//     id: "INQ-003",
//     customer: "Mohan Das",
//     product: "Conveyor Belt",
//     date: "2025-04-02",
//     priority: "normal",
//     status: "assigned",
//     assignee: { name: "Priya", initials: "PM" },
//   },
//   {
//     id: "INQ-004",
//     customer: "Sunita Rao",
//     product: "Air Compressor",
//     date: "2025-04-03",
//     priority: "high",
//     status: "unassigned",
//   },
//   {
//     id: "INQ-005",
//     customer: "Deepak Joshi",
//     product: "Hydraulic Press",
//     date: "2025-04-03",
//     priority: "normal",
//     status: "closed",
//     assignee: { name: "Rohan", initials: "RG" },
//   },
//   {
//     id: "INQ-006",
//     customer: "Kavita Desai",
//     product: "Electric Motor",
//     date: "2025-04-04",
//     priority: "urgent",
//     status: "unassigned",
//   },
//   {
//     id: "INQ-007",
//     customer: "Suresh Iyer",
//     product: "Valve Assembly",
//     date: "2025-04-04",
//     priority: "normal",
//     status: "assigned",
//     assignee: { name: "Sneha", initials: "SP" },
//   },
//   {
//     id: "INQ-008",
//     customer: "Meera Pillai",
//     product: "Crane System",
//     date: "2025-04-05",
//     priority: "high",
//     status: "unassigned",
//   },
// ];
