import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { DeviceLocation } from "@/src/types/devices";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

// Fix default marker icon issue in React Leaflet
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  devices: DeviceLocation[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
};

// function FitBounds({ devices }: { devices: DeviceLocation[] }) {
//   const map = useMap();

//   useEffect(() => {
//     const points: [number, number][] = devices
//       .map((d) => [Number(d.lastLat), Number(d.lastLng)])
//       .filter(([lat, lng]) => lat && lng);

//     if (points.length === 0) return;

//     const bounds = L.latLngBounds(points);

//     map.fitBounds(bounds, {
//       padding: [50, 50],
//       maxZoom: 15,
//       animate: true,
//     });
//   }, [devices, map]);

//   return null;
// }

export function LiveDeviceMap({
  devices,
  height = "400px",
  center = [20.5937, 78.9629], // default: India
  zoom = 5,
  selectedDeviceId,
  onSelectDevice,
}: Props) {
  function FitBounds({ devices }: { devices: DeviceLocation[] }) {
    const map = useMap();

    useEffect(() => {
      const points: [number, number][] = devices
        .map((d) => {
          const lat = Number(d.lastLat);
          const lng = Number(d.lastLng);

          return [lat, lng] as [number, number];
        })
        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

      if (points.length === 0) return;

      const bounds = L.latLngBounds(points);

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
      });
    }, [devices, map]);

    return null;
  }
  function FlyToSelected({
    devices,
    selectedDeviceId,
  }: {
    devices: DeviceLocation[];
    selectedDeviceId: string | null;
  }) {
    const map = useMap();

    useEffect(() => {
      if (!selectedDeviceId) return;

      const device = devices.find((d) => d.id === selectedDeviceId);
      if (!device) return;

      const lat = Number(device.lastLat);
      const lng = Number(device.lastLng);

      if (lat && lng) {
        map.flyTo([lat, lng], 14, {
          duration: 0.8,
        });
      }
    }, [selectedDeviceId, devices, map]);

    return null;
  }
  return (
    <div
      style={{ height, width: "100%" }}
      className="rounded-xl overflow-hidden"
    >
      <MapContainer
        center={[0, 0]}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <FitBounds devices={devices} />
        <FlyToSelected devices={devices} selectedDeviceId={selectedDeviceId} />
        {/* Base map layer */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Device markers */}
        {devices.map((device) => {
          const lat = Number(device.lastLat);
          const lng = Number(device.lastLng);
          const isSelected = device.id === selectedDeviceId;
          const selectedIcon = new L.Icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            iconSize: [32, 32],
          });
          if (!lat || !lng) return null;

          return (
            <Marker
              key={device.id}
              position={[lat, lng]}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => onSelectDevice(device.id),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">
                    Agent: {device.salesperson?.name}
                  </p>
                  <p>Status: {device.isBlocked ? "Blocked" : "Active"}</p>
                  <p className="text-xs text-gray-500">
                    {device.lastAddress || "No address"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
