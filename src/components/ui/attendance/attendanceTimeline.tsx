import { useTheme } from "@/src/contexts";
import { AttendanceSessions } from "@/src/types/attendance";

export default function AttendanceTimeline({
  sessions,
}: {
  sessions: AttendanceSessions[];
}) {
  const { isDark, tokens: t } = useTheme();

  if (!sessions?.length) {
    return <div style={{ color: t.textMuted }}>No sessions</div>;
  }

  return (
    <div style={{ position: "relative", paddingLeft: 20 }}>
      {/* vertical line */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          bottom: 0,
          width: 2,
          background: t.border,
        }}
      />

      {sessions.map((s, i) => {
        const checkIn = s.checkInTime
          ? new Date(s.checkInTime).toLocaleTimeString()
          : "—";

        const checkOut = s.checkOutTime
          ? new Date(s.checkOutTime).toLocaleTimeString()
          : "—";

        const duration = s.durationMinutes
          ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m`
          : "—";

        return (
          <div
            key={s.id}
            style={{
              position: "relative",
              marginBottom: 16,
              paddingLeft: 12,
            }}
          >
            {/* dot */}
            <div
              style={{
                position: "absolute",
                left: -14,
                top: 4,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: t.accent,
              }}
            />

            <div
              style={{
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                padding: 10,
                background: t.surface,
              }}
            >
              <div style={{ fontSize: 13, color: t.text }}>
                {checkIn} → {checkOut}
              </div>

              <div style={{ fontSize: 12, color: t.textMuted }}>
                Duration: {duration}
              </div>

              <div style={{ fontSize: 11, marginTop: 4 }}>
                {s.isLate && (
                  <span style={{ color: t.warning, marginRight: 8 }}>Late</span>
                )}
                {s.isEarlyExit && (
                  <span style={{ color: t.danger }}>Early Exit</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
