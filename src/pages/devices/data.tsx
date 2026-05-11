import { TableColumn } from "@/src/components/ui/table/types";
import { Device } from "@/src/types/devices";
import {
  CoordBadge,
  DeviceInfo,
  DeviceToggleButton,
  StatCell,
} from "./deviceComponents";
import { Clock, User } from "lucide-react";
import { cn, formatTimeHM } from "@/src/utils/utils";
import { useTheme } from "@/src/contexts";

export const DUMMY_API_DEVICES: Device[] = [
  {
    id: "1",
    deviceId: "DEV-001",
    mobileNumber: "9876543210",
    salespersonId: "SP-101",
    isBlocked: false,
    blockedAt: null,
    blockedById: null,
    blockReason: null,
    lastSeen: "2026-04-23T10:15:00Z",
    lastLat: "28.6139",
    lastLng: "77.2090",
    lastAddress: null,
    lastLocatedAt: "2026-04-23T10:10:00Z",
    platform: "Android",
    appVersion: "1.2.3",
    createdAt: "2026-04-01T09:00:00Z",
    updatedAt: "2026-04-23T10:15:00Z",
    salesperson: {
      id: "SP-101",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "9876543210",
      employeeId: "0001",
    },
    blockedBy: null,
  },
  {
    id: "2",
    deviceId: "DEV-002",
    mobileNumber: "9123456780",
    salespersonId: "SP-102",
    isBlocked: true,
    blockedAt: "2026-04-22T14:00:00Z",
    blockedById: "ADMIN-1",
    blockReason: "Suspicious activity",
    lastSeen: "2026-04-22T13:50:00Z",
    lastLat: "19.0760",
    lastLng: "72.8777",
    lastAddress: null,
    lastLocatedAt: "2026-04-22T13:45:00Z",
    platform: "iOS",
    appVersion: "2.0.1",
    createdAt: "2026-03-28T11:30:00Z",
    updatedAt: "2026-04-22T14:00:00Z",
    salesperson: {
      id: "SP-102",
      name: "Priya Verma",
      email: "priya.verma@example.com",
      phone: "9123456780",
      employeeId: "0002",
    },
    blockedBy: "Admin User",
  },
  {
    id: "3",
    deviceId: "DEV-003",
    mobileNumber: null,
    salespersonId: "SP-103",
    isBlocked: false,
    blockedAt: null,
    blockedById: null,
    blockReason: null,
    lastSeen: "2026-04-23T08:30:00Z",
    lastLat: "12.9716",
    lastLng: "77.5946",
    lastAddress: null,
    lastLocatedAt: "2026-04-23T08:25:00Z",
    platform: "Android",
    appVersion: "1.5.0",
    createdAt: "2026-04-10T08:00:00Z",
    updatedAt: "2026-04-23T08:30:00Z",
    salesperson: {
      id: "SP-103",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "9988776655",
      employeeId: "0003",
    },
    blockedBy: null,
  },
  {
    id: "4",
    deviceId: "DEV-004",
    mobileNumber: "9001122334",
    salespersonId: "SP-104",
    isBlocked: false,
    blockedAt: null,
    blockedById: null,
    blockReason: null,
    lastSeen: "2026-04-23T11:00:00Z",
    lastLat: "26.9124",
    lastLng: "75.7873",
    lastAddress: null,
    lastLocatedAt: "2026-04-23T10:55:00Z",
    platform: "Android",
    appVersion: "1.3.2",
    createdAt: "2026-04-15T10:00:00Z",
    updatedAt: "2026-04-23T11:00:00Z",
    salesperson: {
      id: "SP-104",
      name: "Neha Singh",
      email: "neha.singh@example.com",
      phone: "9001122334",
      employeeId: "0004",
    },
    blockedBy: null,
  },
];

//── Column definitions ───────────────────────────────────────────────────────

// export function buildColumns(
//   onToggle: (id: string) => void,
// ): TableColumn<Device>[] {
//   return [
//     {
//       key: "deviceName",
//       label: "Device",
//       sortable: true,
//       render: (row) => <DeviceInfo device={row} />,
//     },
//     {
//       key: "salesPersonId",
//       label: "Agent",
//       sortable: true,
//       render: (row) => (
//         <StatCell
//           icon={User}
//           primary={`Agent ${row.salesPersonId}`}
//           secondary="Assigned User"
//         />
//       ),
//     },
//     {
//       key: "lastSeen",
//       label: "Last Seen",
//       sortable: true,
//       render: (row) => (
//         <StatCell
//           icon={Clock}
//           primary={new Date(row.lastSeen).toLocaleTimeString()}
//           secondary={new Date(row.lastSeen).toLocaleDateString()}
//         />
//       ),
//     },
//     {
//       key: "status",
//       label: "Status",
//       sortable: true,
//       render: (row) => (
//         <span
//           className={cn(
//             "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
//             row.status === "active"
//               ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//               : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
//           )}
//         >
//           <span
//             className={cn(
//               "w-1.5 h-1.5 rounded-full",
//               row.status === "active" ? "bg-green-500" : "bg-red-500",
//             )}
//           />
//           {row.status === "active" ? "Active" : "Blocked"}
//         </span>
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       align: "right",
//       render: (row) => <DeviceToggleButton device={row} onToggle={onToggle} />,
//     },
//   ];
// }

export const STATUS_STYLES = {
  active: {
    bg: {
      light: "#E8F5E9", // cleaner green than green-200
      dark: "rgba(52, 211, 153, 0.12)",
    },
    text: {
      light: "#166534", // stronger green (better contrast than green-800)
      dark: "#34D399",
    },
    dot: "#16A34A",
    label: "Active",
  },

  blocked: {
    bg: {
      light: "#FDECEC", // softer, less aggressive than red-200
      dark: "rgba(248, 113, 113, 0.12)",
    },
    text: {
      light: "#991B1B", // deeper red for readability
      dark: "#F87171",
    },
    dot: "#DC2626",
    label: "Blocked",
  },
} as const;

export function buildColumns(
  onToggle: (id: string) => void,
): TableColumn<Device>[] {
  return [
    // {
    //   key: "deviceId",
    //   label: "Device ID",
    //   sortable: true,
    //   render: (row) => (
    //     <div className="text-sm font-medium text-(--text)">{row.deviceId}</div>
    //   ),
    // },

    {
      key: "platform",
      label: "Device",
      sortable: true,
      render: (row) => (
        <DeviceInfo
          device={{
            ...row,
            id: row.deviceId,
            appVersion: row.appVersion,
            platform: row.platform,
          }}
        />
      ),
    },

    {
      key: "salesperson",
      label: "Agent",
      sortable: true,
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium text-(--text)">
            {row.salesperson?.name || "Unassigned"}
          </p>
          {/* <p className="text-xs text-(--textMuted)">
            {row.salesperson?.employeeId || "—"}
          </p> */}
        </div>
      ),
    },

    {
      key: "mobileNumber",
      label: "Mobile",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-(--text)">
          {row.salesperson.phone || "—"}
        </span>
      ),
    },

    {
      key: "lastSeen",
      label: "Last Seen",
      sortable: true,
      render: (row) => (
        <StatCell
          icon={Clock}
          primary={formatTimeHM(row.lastSeen)}
          secondary={new Date(row.lastSeen).toLocaleDateString()}
        />
      ),
    },

    {
      key: "lastLat",
      label: "Location",
      sortable: false,
      render: (row) => (
        <div className="flex flex-col gap-1">
          <CoordBadge lat={Number(row.lastLat)} lng={Number(row.lastLng)} />
        </div>
      ),
    },

    {
      key: "isBlocked",
      label: "Status",
      sortable: true,
      render: (row) => {
        const { isDark: dark } = useTheme();
        const status = row.isBlocked ? "blocked" : "active";
        const s = STATUS_STYLES[status];

        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
            )}
            style={{
              backgroundColor: dark ? s.bg.dark : s.bg.light,
              color: dark ? s.text.dark : s.text.light,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: s.dot }}
            />
            {s.label}
          </span>
        );
      },
    },

    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => <DeviceToggleButton device={row} onToggle={onToggle} />,
    },
  ];
}

// export function buildColumns(
//   onToggle: (id: string) => void,
// ): TableColumn<Device>[] {
//   return [
//     {
//       key: "deviceId",
//       label: "Device ID",
//       sortable: true,
//       render: (row) => (
//         <div className="text-sm font-medium text-(--text)">{row.deviceId}</div>
//       ),
//     },

//     {
//       key: "platform",
//       label: "Device",
//       sortable: true,
//       render: (row) => (
//         <div>
//           <p className="text-sm font-semibold text-(--text)">
//             {row.platform || "—"}
//           </p>
//           <p className="text-xs text-(--textMuted)">v{row.appVersion || "—"}</p>
//         </div>
//       ),
//     },

//     {
//       key: "salesperson",
//       label: "Agent",
//       sortable: true,
//       render: (row) => (
//         <div className="text-sm">
//           <p className="font-medium text-(--text)">
//             {row.salesperson?.name || "Unassigned"}
//           </p>
//           <p className="text-xs text-(--textMuted)">
//             {row.salesperson?.id || "—"}
//           </p>
//         </div>
//       ),
//     },

//     {
//       key: "mobileNumber",
//       label: "Mobile",
//       sortable: true,
//       render: (row) => (
//         <span className="text-sm text-(--text)">{row.mobileNumber || "—"}</span>
//       ),
//     },

//     {
//       key: "lastSeen",
//       label: "Last Seen",
//       sortable: true,
//       render: (row) => (
//         <StatCell
//           icon={Clock}
//           primary={new Date(row.lastSeen).toLocaleTimeString()}
//           secondary={new Date(row.lastSeen).toLocaleDateString()}
//         />
//       ),
//     },

//     {
//       key: "lastLat",
//       label: "Location",
//       sortable: false,
//       render: (row) => (
//         <div className="text-xs text-(--textMuted)">
//           <p>Lat: {row.lastLat ?? "—"}</p>
//           <p>Lng: {row.lastLng ?? "—"}</p>
//         </div>
//       ),
//     },

//     {
//       key: "isBlocked",
//       label: "Status",
//       sortable: true,
//       render: (row) => (
//         <span
//           className={cn(
//             "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
//             row.isBlocked
//               ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
//               : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//           )}
//         >
//           <span
//             className={cn(
//               "w-1.5 h-1.5 rounded-full",
//               row.isBlocked ? "bg-red-500" : "bg-green-500",
//             )}
//           />
//           {row.isBlocked ? "Blocked" : "Active"}
//         </span>
//       ),
//     },

//     {
//       key: "actions",
//       label: "Actions",
//       align: "right",
//       render: (row) => <DeviceToggleButton device={row} onToggle={onToggle} />,
//     },
//   ];
// }
