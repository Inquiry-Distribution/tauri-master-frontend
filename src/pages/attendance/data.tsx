// attendance.columns.tsx
import { TableColumn } from "@/src/components/ui/table/types";
import { useTheme } from "@/src/contexts";
import { Attendance, AttendancePerson } from "@/src/types/attendance";
import { Link } from "react-router-dom";
import { getAttendanceStatusStyleMap } from "./attendanceStyles";
import { SalesPerson } from "@/src/types/users";
import { useState } from "react";

type ColumnDeps = {};
type ColumnDeps2 = {
  setSelectedUserId: (id: string) => void;
  selectedPerson: SalesPerson | null;
};

export const getAttendanceColumns = ({
  selectedAttendance,
  setSelectedAttendance,
}: {
  selectedAttendance: Attendance | null;
  setSelectedAttendance: React.Dispatch<
    React.SetStateAction<Attendance | null>
  >;
}): TableColumn<Attendance>[] => {
  // const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  return [
    {
      key: "id",
      label: "Attendance ID",
      render: (row) => (
        <span style={{ fontSize: 12, fontFamily: "monospace", opacity: 0.7 }}>
          {row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },

    {
      key: "salesperson",
      label: "Salesperson",
      render: (row) => {
        const { isDark, tokens: t } = useTheme();

        return (
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>
              {row.salesperson?.name}
            </div>
            <div style={{ fontSize: 12, color: t.textMuted }}>
              {row.salesperson?.email}
            </div>
          </div>
        );
      },
    },

    // ✅ FIRST CHECK-IN
    {
      key: "checkIn",
      label: "First Check In",
      render: (row) => {
        const session = row.sessions?.[0];
        const time = session?.checkInTime;

        return <span>{time ? new Date(time).toLocaleTimeString() : "—"}</span>;
      },
    },

    // ✅ LAST CHECK-OUT
    {
      key: "checkOut",
      label: "Last Check Out",
      render: (row) => {
        const session = row.sessions?.[row.sessions.length - 1];
        const time = session?.checkOutTime;

        return <span>{time ? new Date(time).toLocaleTimeString() : "—"}</span>;
      },
    },

    // ✅ TOTAL TIME (NEW)
    {
      key: "totalMinutes",
      label: "Work Duration",
      render: (row) => {
        const mins = row.totalMinutes;

        const hrs = Math.floor(mins / 60);
        const rem = mins % 60;

        return <span>{mins ? `${hrs}h ${rem}m` : "0h"}</span>;
      },
    },

    // ✅ SESSION COUNT (NEW)
    {
      key: "sessionsCount",
      label: "Sessions",
      render: (row) => <span>{row.sessionsCount}</span>,
    },

    // ✅ STATUS WITH THEME TOKENS
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const { isDark, tokens: t } = useTheme();

        const map = {
          present: {
            bg: t.successLight,
            color: t.success,
          },
          absent: {
            bg: t.dangerLight,
            color: t.danger,
          },
          late: {
            bg: t.warningLight,
            color: t.warning,
          },
        };

        const variant = map[row.status as keyof typeof map] || {
          bg: t.borderLight,
          color: t.textMuted,
        };

        return (
          <span
            style={{
              backgroundColor: variant.bg,
              color: variant.color,
              padding: "2px 10px",
              fontSize: 12,
              borderRadius: 999,
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {row.status}
          </span>
        );
      },
    },

    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span style={{ fontSize: 12, opacity: 0.7 }}>
          {new Date(row.date).toDateString()}
        </span>
      ),
    },

    {
      key: "view",
      label: "",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAttendance(row);
          }}
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          View
        </button>
      ),
    },
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

    // {
    //   key: "actions",
    //   label: "Action",
    //   render: (row) =>
    //     setSelectedUserId ? (
    //       <button
    //         onClick={() => setSelectedUserId(row.salespersonId)}
    //         className="px-3 py-1 text-xs rounded-md bg-(--primary) text-white hover:opacity-80"
    //       >
    //         View
    //       </button>
    //     ) : (
    //       <span className="text-xs text-(--textMuted)">—</span>
    //     ),
    // },
  ];
};
