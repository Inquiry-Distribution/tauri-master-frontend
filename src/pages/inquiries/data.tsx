import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";

import { TableColumn } from "@/src/components/ui/table/types";
import { useTheme } from "@/src/contexts";

type Inquiry = {
  id: string;
  customer: string;
  product: string;
  date: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "assigned" | "unassigned" | "closed";
  assignee?: {
    name: string;
    initials: string;
  };
};

export const columns: TableColumn<Inquiry>[] = [
  {
    key: "id",
    label: "INQ ID",
  },
  {
    key: "customer",
    label: "Customer",
  },
  {
    key: "product",
    label: "Product",
  },
  {
    key: "date",
    label: "Date",
  },
  {
    key: "priority",
    label: "Priority",
    render: (row) => {
      const { isDark } = useTheme();
      const styles = {
        high: {
          backgroundColor: isDark ? "#78350f33" : "#fef3c7", // yellow-900/20 : yellow-100
          color: isDark ? "#fcd34d" : "#b45309", // yellow-300 : yellow-700
        },
        urgent: {
          backgroundColor: isDark ? "#7f1d1d33" : "#fee2e2", // red-900/20 : red-100
          color: isDark ? "#fca5a5" : "#dc2626", // red-300 : red-600
        },
        normal: {
          backgroundColor: isDark ? "#1f293733" : "#f3f4f6", // gray-800/20 : gray-100
          color: isDark ? "#d1d5db" : "#374151", // gray-300 : gray-700
        },
        low: {
          backgroundColor: isDark ? "#14532d33" : "#dcfce7", // green-900/20 : green-100
          color: isDark ? "#86efac" : "#15803d", // green-300 : green-700
        },
      };

      return (
        <span
          style={{
            ...styles[row.priority],
            padding: "2px 8px",
            fontSize: "12px",
            borderRadius: "6px",
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
      const styles = {
        assigned: {
          bg: isDark ? "#1e3a8a33" : "#dbeafe", // dark: blue-900/20, light: blue-100
          color: isDark ? "#93c5fd" : "#1d4ed8", // dark: blue-300, light: blue-700
        },
        unassigned: {
          bg: isDark ? "#7f1d1d33" : "#fee2e2", // dark: red-900/20, light: red-100
          color: isDark ? "#fca5a5" : "#dc2626", // dark: red-300, light: red-600
        },
        closed: {
          bg: isDark ? "#14532d33" : "#dcfce7", // dark: green-900/20, light: green-100
          color: isDark ? "#86efac" : "#15803d", // dark: green-300, light: green-700
        },
      };

      // const styles = {
      //   assigned: {
      //     bg: tokens.info + "20",   // light tint
      //     text: tokens.info,
      //   },
      //   unassigned: {
      //     bg: tokens.error + "20",
      //     text: tokens.error,
      //   },
      //   closed: {
      //     bg: tokens.success + "20",
      //     text: tokens.success,
      //   },
      // };

      const variant = styles[row.status] || styles.assigned;

      return (
        <span
          className="px-2 py-1 text-xs rounded font-medium"
          style={{
            backgroundColor: variant.bg,
            color: variant.color,
          }}
        >
          {row.status}
        </span>
      );
    },
  },
  {
    key: "assignee",
    label: "Assignee",
    render: (row) =>
      row.assignee ? (
        <div className="flex items-center gap-2">
          <Avatar
            name={row.assignee.name}
            size="sm"
            variant="solid"
            orientation="horizontal"
          />
          {/* <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
            {row.assignee.initials}
          </div>
          <span>{row.assignee.name}</span> */}
        </div>
      ) : (
        <span className="text-gray-400">—</span>
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

export const data: Inquiry[] = [
  {
    id: "INQ-001",
    customer: "Rajesh Kumar",
    product: "Industrial Pump",
    date: "2025-04-01",
    priority: "high",
    status: "assigned",
    assignee: { name: "Arjun", initials: "AS" },
  },
  {
    id: "INQ-002",
    customer: "Anita Singh",
    product: "Control Panel",
    date: "2025-04-02",
    priority: "urgent",
    status: "unassigned",
  },
  {
    id: "INQ-003",
    customer: "Mohan Das",
    product: "Conveyor Belt",
    date: "2025-04-02",
    priority: "normal",
    status: "assigned",
    assignee: { name: "Priya", initials: "PM" },
  },
  {
    id: "INQ-004",
    customer: "Sunita Rao",
    product: "Air Compressor",
    date: "2025-04-03",
    priority: "high",
    status: "unassigned",
  },
  {
    id: "INQ-005",
    customer: "Deepak Joshi",
    product: "Hydraulic Press",
    date: "2025-04-03",
    priority: "normal",
    status: "closed",
    assignee: { name: "Rohan", initials: "RG" },
  },
  {
    id: "INQ-006",
    customer: "Kavita Desai",
    product: "Electric Motor",
    date: "2025-04-04",
    priority: "urgent",
    status: "unassigned",
  },
  {
    id: "INQ-007",
    customer: "Suresh Iyer",
    product: "Valve Assembly",
    date: "2025-04-04",
    priority: "normal",
    status: "assigned",
    assignee: { name: "Sneha", initials: "SP" },
  },
  {
    id: "INQ-008",
    customer: "Meera Pillai",
    product: "Crane System",
    date: "2025-04-05",
    priority: "high",
    status: "unassigned",
  },
];
