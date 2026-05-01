import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Location } from "@/src/types/locationHistory";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  locations: Location[];
  height?: string;
  zoom?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LiveDeviceMap({
  locations,
  height = "400px",
  zoom = 5,
  selectedId,
  onSelect,
}: Props) {
  function FitBounds({ locations }: { locations: Location[] }) {
    const map = useMap();

    useEffect(() => {
      const points = locations
        .map((l) => [l.lat, l.lng] as [number, number])
        .filter(([lat, lng]) => lat != null && lng != null);

      if (!points.length) return;

      map.fitBounds(L.latLngBounds(points), {
        padding: [50, 50],
        maxZoom: 15,
      });
    }, [locations, map]);

    return null;
  }

  function FlyToSelected({
    locations,
    selectedId,
  }: {
    locations: Location[];
    selectedId: string | null;
  }) {
    const map = useMap();

    useEffect(() => {
      if (!selectedId) return;

      const loc = locations.find((l) => l.salespersonId === selectedId);

      if (!loc || loc.lat == null || loc.lng == null) return;

      map.flyTo([loc.lat, loc.lng], 14, { duration: 0.8 });
    }, [selectedId, locations, map]);

    return null;
  }

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={zoom}
        className="h-full w-full"
      >
        <FitBounds locations={locations} />
        <FlyToSelected locations={locations} selectedId={selectedId} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc) => {
          if (loc.lat == null || loc.lng == null) return null;

          const isSelected = loc.salespersonId === selectedId;

          const selectedIcon = new L.Icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            iconSize: [32, 32],
          });

          return (
            <Marker
              key={loc.salespersonId}
              position={[loc.lat, loc.lng]}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => onSelect(loc.salespersonId),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Agent: {loc.salespersonName}</p>
                  <p>Status: {loc.isOnline ? "Online" : "Offline"}</p>
                  <p className="text-xs text-gray-500">
                    {loc.address || "No address"}
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
