// utils/deviceMapper.ts

import { Device } from "../types/devices";

export type UIDevice = {
  id: string;
  deviceName: string;
  os: string;
  lastSeen: string;
  status: "active" | "blocked";
  salesPersonId: string;
  location: { lat: number; lng: number };
};

export function mapApiToUIDevice(api: Device): UIDevice {
  return {
    id: api.deviceId ?? api.id,
    deviceName: api.platform ?? "—",
    os: [api.platform, api.appVersion].filter(Boolean).join(" ") || "—",
    lastSeen: api.lastSeen ?? api.lastLocatedAt,
    status: api.isBlocked ? "blocked" : "active",
    salesPersonId: api.salesperson?.id ?? "—",
    location: {
      lat: Number(api.lastLat),
      lng: Number(api.lastLng),
    },
  };
}
