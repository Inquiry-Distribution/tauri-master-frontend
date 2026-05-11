import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/src/contexts";
import type { LocationHistory } from "@/src/types/locationHistory";
import { Button } from "../../button";
import { PauseIcon, PlayIcon, Square, SquareStopIcon } from "lucide-react";

type Props = {
  locations: LocationHistory[];
  selectedIndex: number | null;
  onSelectIndex: (index: number) => void;
  hoverIndex: number | null;
};

const ghostIcon = new L.DivIcon({
  className: "",
  html: `<div style="
    width:14px;
    height:14px;
    border-radius:50%;
    background:#4F7DF3;
    opacity:0.4;
    box-shadow:0 0 10px rgba(79,125,243,0.6);
  "></div>`,
});
export function LocationHistoryMap({
  locations,
  selectedIndex,
  onSelectIndex,
  hoverIndex,
}: Props) {
  const { tokens } = useTheme();

  const [mode, setMode] = useState<"latest" | "playback">("latest");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ───────────────────────────────
  // Convert points
  // ───────────────────────────────
  const points = useMemo(() => {
    return locations
      .map((l) => ({
        lat: Number(l.lat),
        lng: Number(l.lng),
        time: l.recordedAt,
      }))
      .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));
  }, [locations]);

  const lastPoint = points[points.length - 1];

  // ───────────────────────────────
  // Playback logic
  // ───────────────────────────────
  useEffect(() => {
    if (!isPlaying || mode !== "playback") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= points.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 0.1;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isPlaying, points.length, mode]);

  const currentIndex = Math.floor(progress);

  const interpolatedPosition = useMemo(() => {
    if (mode !== "playback" || points.length < 2) return null;

    const i = Math.floor(progress);
    const next = Math.min(i + 1, points.length - 1);

    const p1 = points[i];
    const p2 = points[next];

    const t = progress - i;

    return [p1.lat + (p2.lat - p1.lat) * t, p1.lng + (p2.lng - p1.lng) * t] as [
      number,
      number,
    ];
  }, [progress, points, mode]);

  // ───────────────────────────────
  // Fit bounds
  // ───────────────────────────────
  function FitBounds() {
    const map = useMap();

    useEffect(() => {
      if (!points.length) return;

      const boundsPoints: [number, number][] =
        mode === "latest"
          ? [[lastPoint.lat, lastPoint.lng]]
          : points.map((p) => [p.lat, p.lng] as [number, number]);

      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [40, 40],
        maxZoom: mode === "latest" ? 16 : 20,
        animate: true,
      });
    }, [map, mode, points, lastPoint]);

    return null;
  }
  function FlyToSelected() {
    const map = useMap();

    useEffect(() => {
      if (selectedIndex == null || !points[selectedIndex]) return;

      const p = points[selectedIndex];

      map.flyTo([p.lat, p.lng], 15, { duration: 0.8 });
    }, [selectedIndex, map]);

    return null;
  }
  useEffect(() => {
    if (mode === "playback") {
      onSelectIndex(currentIndex);
    }
  }, [currentIndex, mode]);
  return (
    <div className="w-full z-10">
      {/* Map */}
      <div className="h-[320px] rounded-xl overflow-hidden">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="h-full w-full"
        >
          <FlyToSelected />
          <FitBounds />
          {hoverIndex != null && points[hoverIndex] && (
            <Marker
              position={[points[hoverIndex].lat, points[hoverIndex].lng]}
              icon={ghostIcon}
            />
          )}

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* ───────── Latest Mode ───────── */}
          {mode === "latest" && lastPoint && (
            <Marker
              position={[lastPoint.lat, lastPoint.lng]}
              eventHandlers={{
                click: () => onSelectIndex(points.length - 1),
              }}
            />
          )}

          {/* ───────── Playback Mode ───────── */}
          {mode === "playback" && (
            <>
              <Polyline
                positions={points.map((p) => [p.lat, p.lng] as [number, number])}
                color={tokens.textMuted}
                weight={3}
              />

              <Polyline
                positions={points
                  .slice(0, currentIndex + 1)
                  .map((p) => [p.lat, p.lng] as [number, number])}
                color={tokens.success}
                weight={5}
              />

              {interpolatedPosition && (
                <Marker
                  position={interpolatedPosition}
                  eventHandlers={{
                    click: () => onSelectIndex(currentIndex),
                  }}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>
      {/* Playback Controls */}
      {mode === "playback" && (
        <>
          <input
            type="range"
            min={0}
            max={points.length - 1}
            step={0.01}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{
              accentColor: tokens.accent,
            }}
            className="w-full mt-3"
          />
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsPlaying(true)}
                style={{ background: tokens.success, color: "#fff" }}
                className="px-2 py-1 rounded"
              >
                <PlayIcon size={12} />
              </Button>

              <Button
                size="sm"
                onClick={() => setIsPlaying(false)}
                style={{ background: tokens.warning, color: "#fff" }}
                className="px-2 py-1 rounded"
              >
                <PauseIcon size={12} />
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(false);
                }}
                style={{ background: tokens.danger, color: "#fff" }}
                className="px-2 py-1 rounded"
              >
                <Square size={12} />
              </Button>
            </div>

            <div style={{ color: tokens.textMuted }}>
              {points[currentIndex]?.time
                ? new Date(points[currentIndex].time).toLocaleString()
                : "--"}
            </div>
          </div>
        </>
      )}
      {/* Mode Switch */}
      <div className="flex gap-2 mb-2 mt-2">
        <Button
          size="sm"
          onClick={() => {
            setMode("latest");
            setIsPlaying(false);
          }}
        >
          Latest
        </Button>

        <Button
          size="sm"
          onClick={() => {
            setMode("playback");
            setProgress(0);
            setIsPlaying(true);
          }}
        >
          Playback
        </Button>
      </div>
    </div>
  );
}
