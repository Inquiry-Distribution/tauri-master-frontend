// attendance.columns.tsx
import { TableColumn } from "@/src/components/ui/table/types";
import { useTheme } from "@/src/contexts";
import { Attendance, AttendancePerson } from "@/src/types/attendance";
import { Link } from "react-router-dom";
import { getAttendanceStatusStyleMap } from "./attendanceStyles";
import { SalesPerson } from "@/src/types/users";

type ColumnDeps = {
  setSelectedUserId: (id: string) => void;
};
type ColumnDeps2 = {
  setSelectedUserId: (id: string) => void;
  selectedPerson: SalesPerson | null;
};

export const getAttendanceColumns = ({
  setSelectedUserId,
}: ColumnDeps): TableColumn<Attendance>[] => {
  return [
    {
      key: "id",
      label: "Attendance ID",
      render: (row) => (
        <span className="text-xs font-mono text-(--textMuted)">
          {row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },

    {
      key: "salesperson",
      label: "Salesperson",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-(--text)">
            {row.salesperson?.name}
          </span>
          <span className="text-xs text-(--textMuted)">
            {row.salesperson?.email}
          </span>
        </div>
      ),
    },

    {
      key: "checkInTime",
      label: "Check In",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-(--text)">
            {row.checkInTime
              ? new Date(row.checkInTime).toLocaleTimeString()
              : "—"}
          </span>
          <span className="text-xs text-(--textMuted)">
            {row.checkInAddress || "No address"}
          </span>
        </div>
      ),
    },

    {
      key: "checkOutTime",
      label: "Check Out",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-(--text)">
            {row.checkOutTime
              ? new Date(row.checkOutTime).toLocaleTimeString()
              : "—"}
          </span>
          <span className="text-xs text-(--textMuted)">
            {row.checkOutAddress || "Not checked out"}
          </span>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => {
        const { isDark } = useTheme();
        const styles = getAttendanceStatusStyleMap(isDark);

        const variant = styles[row.status as keyof typeof styles] || {
          backgroundColor: isDark ? "#1f293733" : "#f3f4f6",
          color: isDark ? "#9ca3af" : "#374151",
        };

        return (
          <span
            style={{
              ...variant,
              padding: "2px 8px",
              fontSize: "12px",
              borderRadius: "999px",
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {row.status.replace("_", " ")}
          </span>
        );
      },
    },

    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="text-xs text-(--textMuted)">
          {new Date(row.date).toDateString()}
        </span>
      ),
    },

    // {
    //   key: "actions",
    //   label: "Action",
    //   render: (row) => (
    //     <button
    //       onClick={() => setSelectedUserId(row.salespersonId)}
    //       className="text-xs px-3 py-1 rounded-md bg-(--primary) text-white hover:opacity-80"
    //     >
    //       View
    //     </button>
    //   ),
    // },
  ];
};

export const getAttendancePersonColumns = ({
  setSelectedUserId,
  selectedPerson,
}: ColumnDeps2): TableColumn<AttendancePerson>[] => {
  return [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="text-xs font-mono text-(--textMuted)">
          {row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },

    {
      key: "salespersonId",
      label: "Salesperson",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {selectedPerson ? selectedPerson.name : "-"}
          </span>
          <span className="text-xs text-(--textMuted)">
            {row.salespersonId.slice(0, 6)} Device: {row.deviceId}
          </span>
        </div>
      ),
    },

    {
      key: "checkInTime",
      label: "Check In",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-(--text)">
            {row.checkInTime
              ? new Date(row.checkInTime).toLocaleTimeString()
              : "—"}
          </span>
          <span className="text-xs text-(--textMuted)">
            {row.checkInAddress || "No address"}
          </span>
        </div>
      ),
    },

    {
      key: "checkOutTime",
      label: "Check Out",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-(--text)">
            {row.checkOutTime
              ? new Date(row.checkOutTime).toLocaleTimeString()
              : "—"}
          </span>
          <span className="text-xs text-(--textMuted)">
            {row.checkOutAddress || "Not checked out"}
          </span>
        </div>
      ),
    },

    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="text-sm text-(--textMuted)">
          {new Date(row.date).toDateString()}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => {
        const { isDark } = useTheme();
        const styles = getAttendanceStatusStyleMap(isDark);

        const variant = styles[row.status as keyof typeof styles] || {
          backgroundColor: isDark ? "#1f293733" : "#f3f4f6",
          color: isDark ? "#9ca3af" : "#374151",
        };

        return (
          <span
            style={{
              ...variant,
              padding: "2px 10px",
              fontSize: "12px",
              borderRadius: "999px",
              textTransform: "capitalize",
              fontWeight: 500,
              display: "inline-block",
            }}
          >
            {row.status.replace("_", " ")}
          </span>
        );
      },
    },

    {
      key: "actions",
      label: "Action",
      render: (row) =>
        setSelectedUserId ? (
          <button
            onClick={() => setSelectedUserId(row.salespersonId)}
            className="px-3 py-1 text-xs rounded-md bg-(--primary) text-white hover:opacity-80"
          >
            View
          </button>
        ) : (
          <span className="text-xs text-(--textMuted)">—</span>
        ),
    },
  ];
};
