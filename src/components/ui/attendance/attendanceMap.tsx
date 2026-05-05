import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AttendanceSessions } from "@/src/types/attendance";

export default function AttendanceMap({
  sessions,
}: {
  sessions: AttendanceSessions[];
}) {
  const validPoints = sessions.filter((s) => s.checkInLat && s.checkInLng);

  if (!validPoints.length) {
    return <div>No location data</div>;
  }

  const center = [
    parseFloat(validPoints[0].checkInLat!),
    parseFloat(validPoints[0].checkInLng!),
  ];

  return (
    <MapContainer
      center={center as any}
      zoom={13}
      style={{ height: 300, borderRadius: 10 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validPoints.map((s) => (
        <Marker
          key={s.id}
          position={[parseFloat(s.checkInLat!), parseFloat(s.checkInLng!)]}
        >
          <Popup>
            Check-in: {new Date(s.checkInTime).toLocaleTimeString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
