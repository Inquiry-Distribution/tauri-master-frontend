// ── Sub-components ──────────────────────────────────────────────────────────

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { useBlockDevice } from "@/src/hooks/device/useBlockDevice";
import { useUnblockDevice } from "@/src/hooks/device/useUnblockDevice";
import { Device } from "@/src/types/devices";
import { cn, formatLat, formatLng } from "@/src/utils/utils";
import { MapPin, Shield, ShieldOff, Smartphone } from "lucide-react";
import { useCallback } from "react";

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
        await blockDevice(device.id);
        onToggle?.(device.id, false); // now blocked
      } else {
        await unblockDevice(device.id);
        onToggle?.(device.id, true); // now unblocked
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
export function LiveLocationsCard({ devices }: { devices: Device[] }) {
  return (
    <Card>
      <h3 className="font-bold mb-4 flex items-center gap-2 text-(--text)">
        <MapPin size={18} className="text-red-500" />
        Live Locations
      </h3>

      {/* Map placeholder */}
      <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-(--border)">
        <div className="text-center p-6">
          <MapPin size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm font-medium text-(--textSec)">
            Interactive Map View
          </p>
          <p className="text-xs mt-1 text-(--textMuted)">
            Click to expand and view all device locations in real-time.
          </p>
        </div>
      </div>

      {/* Agent list */}
      <div className="mt-6 space-y-4">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  device.isBlocked ? "bg-blue-500" : "bg-red-400",
                )}
              />
              <span className="text-xs font-medium text-(--text)">
                Agent {device.salespersonId}
              </span>
            </div>
            <CoordBadge
              lat={Number(device.lastLat)}
              lng={Number(device.lastLng)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
