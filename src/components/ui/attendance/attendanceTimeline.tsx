import { useTheme } from "@/src/contexts";
import { AttendanceSessions } from "@/src/types/attendance";
import { MapPin } from "lucide-react";

export default function AttendanceTimeline({
  sessions,
}: {
  sessions: AttendanceSessions[];
}) {
  const { tokens: t } = useTheme();

  if (!sessions?.length) {
    return <div style={{ color: t.textMuted }}>No sessions</div>;
  }

  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      {/* vertical line */}
      <div
        style={{
          position: "absolute",
          left: 13,
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
          : "Ongoing";

        const duration = s.durationMinutes
          ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m`
          : s.checkOutTime
            ? "0m"
            : "Running";

        return (
          <div
            key={s.id}
            style={{
              position: "relative",
              marginBottom: 18,
              paddingLeft: 12,
            }}
          >
            {/* Dot */}
            <div
              style={{
                position: "absolute",
                left: -16,
                top: 6,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: t.accent,
                border: `2px solid ${t.surface}`,
              }}
            />

            {/* Card */}
            <div
              style={{
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                padding: 12,
                background: t.surface,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: t.textMuted,
                  }}
                >
                  Session {i + 1}
                </span>

                <span
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                  }}
                >
                  {duration}
                </span>
              </div>

              {/* Time */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: t.text,
                }}
              >
                {checkIn} → {checkOut}
              </div>

              {/* Addresses */}
              <div
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                <MapPin className="inline-block " size={14} /> In:{" "}
                {s.checkInAddress || "No address"}
                <br />
                <MapPin className="inline-block " size={14} /> Out:{" "}
                {s.checkOutAddress || "—"}
              </div>

              {/* Flags */}
              {(s.isLate ||
                s.isEarlyExit ||
                s.autoFinalized ||
                s.adminNote) && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {s.isLate && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 6,
                        background: t.warningLight,
                        color: t.warning,
                      }}
                    >
                      Late
                    </span>
                  )}

                  {s.isEarlyExit && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 6,
                        background: t.dangerLight,
                        color: t.danger,
                      }}
                    >
                      Early Exit
                    </span>
                  )}

                  {s.autoFinalized && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 6,
                        background: t.accentLight,
                        color: t.accent,
                      }}
                    >
                      Auto Closed
                    </span>
                  )}
                </div>
              )}

              {/* Admin Note */}
              {s.adminNote && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    padding: 8,
                    borderRadius: 8,
                    background: t.surfaceElevated,
                    color: t.textSec,
                  }}
                >
                  📝 {s.adminNote}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
