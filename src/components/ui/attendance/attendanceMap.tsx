import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AttendanceSessions } from "@/src/types/attendance";
import { Clock, MapPin } from "lucide-react";
import { useTheme } from "@/src/contexts";

const createMarker = (color: string, label: string) =>
  L.divIcon({
    html: `
      <div style="
        background:${color};
        color:white;
        width:28px;
        height:28px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:12px;
        font-weight:600;
        border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.2);
      ">
        ${label}
      </div>
    `,
    className: "",
    iconSize: [28, 28],
  });

export default function AttendanceMap({
  sessions,
}: {
  sessions: AttendanceSessions[];
}) {
  const { tokens: t } = useTheme();
  const checkOutIcon = (i: number) => createMarker(t.danger, `${i + 1}`); // Number matches session
  const validSessions = sessions.filter((s) => s.checkInLat && s.checkInLng);

  if (!validSessions.length) return <div>No location data</div>;

  const path = validSessions.map((s) => [
    parseFloat(s.checkInLat!),
    parseFloat(s.checkInLng!),
  ]);

  const center = path[0];

  const checkInIcon = (i: number) => createMarker(t.success, `${i + 1}`);

  return (
    <MapContainer
      center={center as any}
      zoom={13}
      style={{ height: 350, borderRadius: 12 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Movement Path */}
      <Polyline positions={path as any} color={t.accent} weight={3} />

      {/* Check-in Markers */}
      {validSessions.map((s, i) => {
        const checkIn = new Date(s.checkInTime).toLocaleTimeString();
        const checkOut = s.checkOutTime
          ? new Date(s.checkOutTime).toLocaleTimeString()
          : "—";

        const duration = s.durationMinutes
          ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m`
          : "—";

        return (
          <Marker
            key={`in-${s.id}`}
            icon={checkInIcon(i)}
            position={[parseFloat(s.checkInLat!), parseFloat(s.checkInLng!)]}
          >
            <Popup className="bg-bg! rounded-2xl!">
              <div style={{ minWidth: 200, fontSize: 12, color: t.text }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  Session {i + 1} (Check-in)
                </div>
                <div style={{ marginBottom: 6, color: t.textSec }}>
                  ⏱ {checkIn} → {checkOut}
                </div>
                <div style={{ color: t.textMuted, marginBottom: 6 }}>
                  Duration: {duration}
                </div>
                <div style={{ fontSize: 11, marginBottom: 6 }}>
                  <MapPin
                    className="inline-block text-md text-success"
                    size={14}
                  />{" "}
                  {s.checkInAddress || "No address"}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.isLate && (
                    <span
                      style={{
                        background: t.warningLight,
                        color: t.warning,
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontSize: 10,
                      }}
                    >
                      Late
                    </span>
                  )}
                  {s.isEarlyExit && (
                    <span
                      style={{
                        background: t.dangerLight,
                        color: t.danger,
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontSize: 10,
                      }}
                    >
                      Early Exit
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Check-out Markers */}
      {validSessions
        .filter((s) => s.checkOutLat && s.checkOutLng)
        .map((s, i) => (
          <Marker
            key={`out-${s.id}`}
            icon={checkOutIcon(i)} // Numbered to match session
            position={[parseFloat(s.checkOutLat!), parseFloat(s.checkOutLng!)]}
          >
            <Popup className="bg-bg! rounded-2xl!">
              <div style={{ fontSize: 12, color: t.text }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  Session {i + 1} (Check-out)
                </div>
                <div style={{ color: t.textSec, marginBottom: 6 }}>
                  ⏱ {new Date(s.checkOutTime!).toLocaleTimeString()}
                </div>
                <div style={{ fontSize: 11 }}>
                  <MapPin
                    className="inline-block text-md text-danger"
                    size={14}
                  />{" "}
                  {s.checkOutAddress || "No address"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
