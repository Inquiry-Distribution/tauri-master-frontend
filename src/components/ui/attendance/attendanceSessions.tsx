import { useTheme } from "@/src/contexts";
import type { AttendanceSessions } from "@/src/types/attendance";

type Props = {
  sessions: AttendanceSessions[];
};

export default function AttendanceSessions({ sessions }: Props) {
  const { isDark, tokens: t } = useTheme();

  if (!sessions?.length) {
    return (
      <div style={{ fontSize: 12, color: t.textMuted }}>
        No sessions available
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sessions.map((s, i) => {
        const checkIn = s.checkInTime
          ? new Date(s.checkInTime).toLocaleTimeString()
          : "—";

        const checkOut = s.checkOutTime
          ? new Date(s.checkOutTime).toLocaleTimeString()
          : "—";

        return (
          <div
            key={s.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 12px",
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              background: t.surface,
            }}
          >
            <div style={{ fontSize: 13, color: t.text }}>Session {i + 1}</div>

            <div style={{ fontSize: 13, color: t.textSec }}>
              {checkIn} → {checkOut}
            </div>
          </div>
        );
      })}
    </div>
  );
}
