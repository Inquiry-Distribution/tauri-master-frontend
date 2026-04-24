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

export const formatDeviceForExport = (data: Device[]) => {
  return data.map((d) => ({
    id: d.deviceId,
    salesperson: d.salesperson?.name || "",
    email: d.salesperson?.email || "",
    phone: d.salesperson?.phone || "",
    employeeId: d.salesperson?.employeeId || "",

    mobileNumber: d.mobileNumber || "",

    platform: d.platform,
    appVersion: d.appVersion,

    status: d.isBlocked ? "Blocked" : "Active",

    blockReason: d.blockReason || "",
    blockedAt: d.blockedAt ? new Date(d.blockedAt).toLocaleString() : "",

    lastSeen: d.lastSeen ? new Date(d.lastSeen).toLocaleString() : "",

    location: `${d.lastLat || ""}, ${d.lastLng || ""}`,

    address: d.lastAddress || "",

    createdAt: new Date(d.createdAt).toLocaleDateString(),
  }));
};
