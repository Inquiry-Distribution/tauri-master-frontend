// ── Sub-components ──────────────────────────────────────────────────────────

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { LiveDeviceMap } from "@/src/components/ui/leafletMap/LiveDeviceMap";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import CommonLoader from "@/src/components/ui/loader/loader";
import { useTheme } from "@/src/contexts";
import { useBlockDevice } from "@/src/hooks/device/useBlockDevice";
import { useGetAllDevicesLocations } from "@/src/hooks/device/useGetAllDeviceLocations";
import { useUnblockDevice } from "@/src/hooks/device/useUnblockDevice";
import { useGetAllLocations } from "@/src/hooks/locations/useGetAllLocations";
import { Device } from "@/src/types/devices";
import { cn, formatLat, formatLng } from "@/src/utils/utils";
import { MapPin, Shield, ShieldOff, Smartphone } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { STATUS_STYLES } from "./data";

/** Left cell: device icon + name/OS */
export function DeviceInfo({ device }: { device: Device }) {
  const { isDark: dark } = useTheme();
  const status = device.isBlocked ? "blocked" : "active";
  const s = STATUS_STYLES[status];
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        )}
        style={{
          backgroundColor: s.bg[dark ? "dark" : "light"],
          color: s.text[dark ? "dark" : "light"],
          // border: `1px solid ${s.dot}`,
        }}
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

  const {
    blockDevice,
    loading: blocking,
    error: blockError,
  } = useBlockDevice();

  const {
    unblockDevice,
    loading: unblocking,
    error: unblockError,
  } = useUnblockDevice();

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
            text: blockError || "Failed to block device.",
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
            text: unblockError || "Failed to unblock device.",
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
    <span className="text-[10px] font-bold px-2 py-0.5 text-text tabular-nums">
      {formatLat(lat)},{formatLng(lng)}
    </span>
  );
}

/** Sidebar card showing agent dot + coordinates */
// export function LiveLocationsCard() {
//   const { data, loading, error, getDeviceLocations } =
//     useGetAllDevicesLocations();

//   const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

//   // 👇 Get role from localStorage
//   const userData = JSON.parse(localStorage.getItem("userData") || "{}");
//   const isSuperUser = userData?.role === "superuser";

//   useEffect(() => {
//     if (isSuperUser) {
//       getDeviceLocations();
//     }
//   }, [getDeviceLocations, isSuperUser]);

//   const devices = data || []; // adjust if API shape differs

//   return (
//     <Card>
//       <h3 className="font-bold mb-4 flex items-center gap-2 text-(--text)">
//         <MapPin size={18} className="text-red-500" />
//         Live Locations
//       </h3>

//       {/* Map placeholder */}
//       {/* 👇 Permission check */}
//       {!isSuperUser ? (
//         <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-(--border)">
//           <p className="text-sm text-center text-(--textMuted)">
//             You don’t have permission to access live locations.
//           </p>
//         </div>
//       ) : loading ? (
//         <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-(--border)">
//           <CommonLoader fullScreen={false} overlay={true} />
//         </div>
//       ) : (
//         <LiveDeviceMap
//           devices={devices}
//           height="350px"
//           zoom={6}
//           selectedDeviceId={selectedDeviceId}
//           onSelectDevice={setSelectedDeviceId}
//         />
//       )}

//       {/* Agent list */}
//       {/* 👇 Show list only if allowed */}
//       {isSuperUser && (
//         <div className="mt-6 space-y-4">
//           {devices.map((device) => (
//             <div
//               key={device.id}
//               onClick={() => setSelectedDeviceId(device.id)}
//               className={cn(
//                 "flex items-center justify-between cursor-pointer p-2 rounded",
//                 selectedDeviceId === device.id &&
//                   "bg-gray-100 dark:bg-gray-800",
//               )}
//             >
//               <div className="flex items-center gap-2">
//                 <div
//                   className={cn(
//                     "w-2 h-2 rounded-full",
//                     device.isBlocked ? "bg-blue-500" : "bg-red-400",
//                   )}
//                 />
//                 <span className="text-xs font-medium text-(--text)">
//                   Agent {device.salesperson?.name}
//                 </span>
//               </div>

//               <CoordBadge
//                 lat={Number(device.lastLat)}
//                 lng={Number(device.lastLng)}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </Card>
//   );
// }

export function LiveLocationsCard() {
  const { tokens } = useTheme();

  const { data, loading, getLocations } = useGetAllLocations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isSuperUser = userData?.role === "superuser";

  useEffect(() => {
    if (isSuperUser) {
      getLocations();
    }
  }, [getLocations, isSuperUser]);

  // const locations = data || [];
  const locations = useMemo(() => {
    return (data || []).filter((loc) => loc.lat != null && loc.lng != null);
  }, [data]);
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        color: tokens.text,
      }}
      className="rounded-2xl p-4 shadow-sm transition-all "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <MapPin size={18} style={{ color: tokens.danger }} />
          Live Locations
        </h3>

        <span
          style={{
            background: tokens.accentLight,
            color: tokens.accent,
          }}
          className="text-xs px-2 py-1 rounded-full"
        >
          {locations.length} agents
        </span>
      </div>

      {/* Content */}
      {!isSuperUser ? (
        <div
          style={{
            background: tokens.surfaceElevated,
            color: tokens.textMuted,
            border: `1px dashed ${tokens.border}`,
          }}
          className="h-[320px] flex items-center justify-center rounded-xl"
        >
          No permission to view live locations
        </div>
      ) : loading ? (
        <div
          className="h-[320px] flex items-center justify-center rounded-xl"
          style={{ background: tokens.surfaceElevated }}
        >
          <div
            className="animate-pulse text-sm"
            style={{ color: tokens.textMuted }}
          >
            Fetching live locations...
          </div>
        </div>
      ) : (
        <>
          {/* Map */}
          <div className="rounded-xl overflow-hidden mb-4">
            <LiveDeviceMap
              locations={locations}
              height="280px"
              zoom={6}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Agent List */}
          <div className="space-y-2 max-h-[400px] rounded-2xl overflow-y-auto pr-1 overflow-x-hidden pr-4 no-scrollbar">
            {locations.map((loc) => {
              const isSelected = loc.salespersonId === selectedId;

              return (
                <div
                  key={loc.salespersonId}
                  onClick={() => setSelectedId(loc.salespersonId)}
                  style={{
                    background: isSelected
                      ? tokens.accentLight
                      : tokens.surfaceElevated,
                    border: `1px solid ${
                      isSelected ? tokens.accent : tokens.borderLight
                    }`,
                  }}
                  className="p-3 rounded-xl cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-2">
                      {/* Status dot */}
                      <div className="relative">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: loc.isOnline
                              ? tokens.success
                              : tokens.textMuted,
                          }}
                        />
                        {loc.isOnline && (
                          <div
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{
                              background: tokens.success,
                              opacity: 0.5,
                            }}
                          />
                        )}
                      </div>

                      <span className="text-sm font-medium">
                        {loc.salespersonName}
                      </span>
                    </div>

                    {/* Right */}
                    <span
                      className="text-xs"
                      style={{ color: tokens.textMuted }}
                    >
                      {loc.lat?.toFixed(2) ?? "--"},{" "}
                      {loc.lng?.toFixed(2) ?? "--"}
                    </span>
                  </div>

                  {/* Address */}
                  <div
                    className="text-xs mt-1 truncate"
                    style={{ color: tokens.textSec }}
                  >
                    {loc.address || "No address available"}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span
                      style={{
                        color: loc.isOnline ? tokens.success : tokens.textMuted,
                      }}
                    >
                      {loc.isOnline ? "Online" : "Offline"}
                    </span>

                    <span style={{ color: tokens.textMuted }}>
                      {loc.recordedAt
                        ? new Date(loc.recordedAt).toLocaleTimeString()
                        : "--"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
