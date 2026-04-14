import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";

import { TableColumn } from "@/src/components/ui/table/types";
import { useTheme } from "@/src/contexts";
import { Inquiry } from "@/src/types/inquiry";
import { getPriorityStyleMap, getStatusStyleMap } from "./create/inquiryStyles";

export const columns: TableColumn<Inquiry>[] = [
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
      <div className="max-w-[260px]">
        <p className="text-sm font-medium text-(--text) line-clamp-1">
          {row.description || "—"}
        </p>
        <p className="text-xs text-(--textMuted)">
          {row.mobile || "No contact"}
        </p>
      </div>
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
        <div className="flex items-center gap-2">
          <Avatar name={row.assignedTo.name} size="sm" variant="solid" />
          {/* <span className="text-sm text-(--text)">{row.assignedTo.name}</span> */}
        </div>
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

  {
    key: "actions",
    label: "Action",
    render: (row) =>
      row.status === "assigned" ? (
        <Button variant="secondary">Reassign</Button>
      ) : (
        <Button variant="primary">Assign</Button>
      ),
  },
];

export const tabFilters = [
  { key: "all", label: "All", status: "" },
  { key: "assigned", label: "Assigned", status: "assigned" },
  { key: "unassigned", label: "Unassigned", status: "unassigned" },
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
