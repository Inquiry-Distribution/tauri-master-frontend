import { TableColumn } from "@/src/components/ui/table/types";
import { Device } from "@/src/types";
import { DeviceInfo, DeviceToggleButton, StatCell } from "./deviceComponents";
import { Clock, User } from "lucide-react";
import { cn } from "@/src/utils/utils";

export const INITIAL_DEVICES: Device[] = [
  {
    id: "dev-1",
    salesPersonId: "1",
    deviceName: "Samsung Galaxy S21",
    os: "Android 13",
    lastSeen: "2024-03-20T10:45:00Z",
    status: "active",
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "dev-2",
    salesPersonId: "2",
    deviceName: "iPhone 14 Pro",
    os: "iOS 16.5",
    lastSeen: "2024-03-20T10:30:00Z",
    status: "active",
    location: { lat: 34.0522, lng: -118.2437 },
  },
  {
    id: "dev-3",
    salesPersonId: "3",
    deviceName: "Google Pixel 7",
    os: "Android 14",
    lastSeen: "2024-03-19T18:20:00Z",
    status: "blocked",
    location: { lat: 41.8781, lng: -87.6298 },
  },
];

//── Column definitions ───────────────────────────────────────────────────────

export function buildColumns(
  onToggle: (id: string) => void,
): TableColumn<Device>[] {
  return [
    {
      key: "deviceName",
      label: "Device",
      sortable: true,
      render: (row) => <DeviceInfo device={row} />,
    },
    {
      key: "salesPersonId",
      label: "Agent",
      sortable: true,
      render: (row) => (
        <StatCell
          icon={User}
          primary={`Agent ${row.salesPersonId}`}
          secondary="Assigned User"
        />
      ),
    },
    {
      key: "lastSeen",
      label: "Last Seen",
      sortable: true,
      render: (row) => (
        <StatCell
          icon={Clock}
          primary={new Date(row.lastSeen).toLocaleTimeString()}
          secondary={new Date(row.lastSeen).toLocaleDateString()}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
            row.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              row.status === "active" ? "bg-green-500" : "bg-red-500",
            )}
          />
          {row.status === "active" ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => <DeviceToggleButton device={row} onToggle={onToggle} />,
    },
  ];
}
