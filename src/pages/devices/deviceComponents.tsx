// ── Sub-components ──────────────────────────────────────────────────────────

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { LiveDeviceMap } from "@/src/components/ui/leafletMap/LiveDeviceMap";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import CommonLoader from "@/src/components/ui/loader/loader";
import { useBlockDevice } from "@/src/hooks/device/useBlockDevice";
import { useGetAllDevicesLocations } from "@/src/hooks/device/useGetAllDeviceLocations";
import { useUnblockDevice } from "@/src/hooks/device/useUnblockDevice";
import { Device } from "@/src/types/devices";
import { cn, formatLat, formatLng } from "@/src/utils/utils";
import { MapPin, Shield, ShieldOff, Smartphone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

/** Left cell: device icon + name/OS */
export function DeviceInfo({ device }: { device: Device }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          device.isBlocked
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
            : "bg-red-100 text-red-600 dark:bg-red-900/30",
        )}
      >
        <Smartphone size={20} />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight">{device.platform}</p>
        <p className="text-xs text-(--textMuted)">
          {device.appVersion} · {device.id}
        </p>
      </div>
    </div>
  );
}

/** Labelled icon stat (agent / last-seen) */
export function StatCell({
  icon: Icon,
  primary,
  secondary,
}: {
  icon: React.ElementType;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-gray-400 shrink-0" />
      <div className="text-xs">
        <p className="font-semibold text-(--text)">{primary}</p>
        <p className="text-(--textMuted)">{secondary}</p>
      </div>
    </div>
  );
}

/** Block / Unblock toggle button */
export function DeviceToggleButton({
  device,
  onToggle,
}: {
  device: Device;
  onToggle?: (id: string, nextState: boolean) => void;
}) {
  const isActive = !device.isBlocked;

  const { blockDevice, loading: blocking } = useBlockDevice();

  const { unblockDevice, loading: unblocking } = useUnblockDevice();

  const loading = blocking || unblocking;

  const handleToggle = useCallback(async () => {
    try {
      if (isActive) {
        try {
          await blockDevice(device.id);
          onToggle?.(device.id, false); // now blocked
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "Failed to block device.",
            icon: "error",
          });
          console.error("Error", err);
        }
      } else {
        try {
          await unblockDevice(device.id);
          onToggle?.(device.id, true); // now unblocked
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "Failed to unblock device.",
            icon: "error",
          });
          console.error("Error", err);
        }
      }
    } catch (err) {
      // optional: toast or logging
      console.error(err);
    }
  }, [isActive, device.id, blockDevice, unblockDevice, onToggle]);

  return (
    <Button
      size="sm"
      variant={isActive ? "danger" : "secondary"}
      icon={isActive ? ShieldOff : Shield}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? <ButtonLoader /> : isActive ? "Block" : "Unblock"}
    </Button>
  );
}

/** Coordinate badge used in the map sidebar */
export function CoordBadge({ lat, lng }: { lat: number; lng: number }) {
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-(--textMuted) tabular-nums">
      {formatLat(lat)},{formatLng(lng)}
    </span>
  );
}

/** Sidebar card showing agent dot + coordinates */
export function LiveLocationsCard() {
  const { data, loading, error, getDeviceLocations } =
    useGetAllDevicesLocations();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // 👇 Get role from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isSuperUser = userData?.role === "superuser";

  useEffect(() => {
    if (isSuperUser) {
      getDeviceLocations();
    }
  }, [getDeviceLocations, isSuperUser]);

  const devices = data || []; // adjust if API shape differs

  return (
    <Card>
      <h3 className="font-bold mb-4 flex items-center gap-2 text-(--text)">
        <MapPin size={18} className="text-red-500" />
        Live Locations
      </h3>

      {/* Map placeholder */}
      {/* 👇 Permission check */}
      {!isSuperUser ? (
        <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-(--border)">
          <p className="text-sm text-center text-(--textMuted)">
            You don’t have permission to access live locations.
          </p>
        </div>
      ) : loading ? (
        <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-(--border)">
          <CommonLoader fullScreen={false} overlay={true} />
        </div>
      ) : (
        <LiveDeviceMap
          devices={devices}
          height="350px"
          zoom={6}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={setSelectedDeviceId}
        />
      )}

      {/* Agent list */}
      {/* 👇 Show list only if allowed */}
      {isSuperUser && (
        <div className="mt-6 space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDeviceId(device.id)}
              className={cn(
                "flex items-center justify-between cursor-pointer p-2 rounded",
                selectedDeviceId === device.id &&
                  "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    device.isBlocked ? "bg-blue-500" : "bg-red-400",
                  )}
                />
                <span className="text-xs font-medium text-(--text)">
                  Agent {device.salesperson?.name}
                </span>
              </div>

              <CoordBadge
                lat={Number(device.lastLat)}
                lng={Number(device.lastLng)}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
