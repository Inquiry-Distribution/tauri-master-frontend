import { useTheme } from "@/src/contexts";
import { useGetLocationHistoryBySalesPerson } from "@/src/hooks/locations/useGetLocationHistoryBySalesPerson";
import { useEffect, useState, useMemo, useRef } from "react";
import Input from "../../form/input";
import { Button } from "../../button";
import CommonLoader from "../../loader/loader";
import { LocationHistoryMap } from "./locationHistoryMap";

type Props = {
  salespersonId: string;
};

// ───────────────────────────────
// Helpers
// ───────────────────────────────
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getDateRange = (type: string) => {
  const today = new Date();

  switch (type) {
    case "7d": {
      const from = new Date();
      from.setDate(today.getDate() - 7);
      return { from, to: today };
    }
    case "30d": {
      const from = new Date();
      from.setDate(today.getDate() - 30);
      return { from, to: today };
    }
    case "thisMonth": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from, to: today };
    }
    case "lastMonth": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from, to };
    }
    default:
      return { from: today, to: today };
  }
};

export function SalespersonLocationHistory({ salespersonId }: Props) {
  const { tokens } = useTheme();

  const { data, loading, getLocationHistoryBySalesPerson } =
    useGetLocationHistoryBySalesPerson();

  const [activeRange, setActiveRange] = useState<string>("7d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filterMode, setFilterMode] = useState<"preset" | "range">("preset");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ───────────────────────────────
  // Apply preset
  // ───────────────────────────────
  const applyRange = (type: string) => {
    const range = getDateRange(type);

    const formattedFrom = formatDate(range.from);
    const formattedTo = formatDate(range.to);

    setFrom(formattedFrom);
    setTo(formattedTo);
    setActiveRange(type);
    setFilterMode("preset");
  };

  // ───────────────────────────────
  // Fetch logic
  // ───────────────────────────────
  useEffect(() => {
    if (!salespersonId) return;

    if (!from || !to) return;

    const query = `from=${from}&to=${to}`;

    getLocationHistoryBySalesPerson(salespersonId, query);
  }, [salespersonId, from, to, getLocationHistoryBySalesPerson]);

  // default load
  useEffect(() => {
    applyRange("7d");
  }, []);

  const locations = useMemo(() => data || [], [data]);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selectedIndex != null) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIndex]);

  // ───────────────────────────────
  // UI
  // ───────────────────────────────
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
      }}
      className="rounded-2xl p-4 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ color: tokens.text }} className="font-semibold">
          Location History
        </h3>

        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{
            background: tokens.accentLight,
            color: tokens.accent,
          }}
        >
          {locations.length} points
        </span>
      </div>

      {/* Filters */}
      <div className="flex w-full flex-wrap justify-start items-center gap-2">
        <div
          className="text-sm font-medium"
          style={{ color: tokens.textMuted }}
        >
          Date Range:
        </div>

        {["7d", "30d", "thisMonth", "lastMonth"].map((range) => (
          <Button
            key={range}
            onClick={() => applyRange(range)}
            size="sm"
            variant={activeRange === range ? "primary" : "secondary"}
          >
            {range}
          </Button>
        ))}

        {/* Custom Range */}
        <div className="lg:w-full md:w-full w-full grid lg:grid-cols-10 md:grid-cols-6 grid-cols-4 gap-2">
          <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
            <Input
              placeholder="From"
              label="From"
              inputName="from"
              inputType="date"
              inputValue={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setFilterMode("range");
                setActiveRange("");
              }}
              showLabel={false}
            />
          </div>

          <div className="text-text font-semibold text-2xl flex items-center justify-center col-span-1">
            →
          </div>
          <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
            <Input
              placeholder="To"
              label="To"
              inputName="to"
              inputType="date"
              inputValue={to}
              onChange={(e) => {
                setTo(e.target.value);
                setFilterMode("range");
                setActiveRange("");
              }}
              showLabel={false}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <CommonLoader fullScreen={false} className="absolute inset-0 z-10" />
      ) : locations.length === 0 ? (
        <div
          className="h-[200px] flex items-center justify-center text-sm"
          style={{ color: tokens.textMuted }}
        >
          No location history found
        </div>
      ) : (
        <div className="mt-2">
          <LocationHistoryMap
            locations={locations}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            hoverIndex={hoverIndex}
          />
          <div className="space-y-2 max-h-[260px] overflow-y-auto overflow-x-hidden no-scrollbar">
            {locations.map((loc, index) => {
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={loc.id}
                  ref={(el) => {
                    if (el) itemRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => setSelectedIndex(index)}
                  style={{
                    background: isSelected
                      ? tokens.accentLight
                      : tokens.surfaceElevated,
                    border: `1px solid ${
                      isSelected ? tokens.accent : tokens.borderLight
                    }`,
                  }}
                  className="p-3 rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex justify-between text-sm">
                    <span style={{ color: tokens.text }}>
                      {Number(loc.lat).toFixed(4)}, {Number(loc.lng).toFixed(4)}
                    </span>

                    <span style={{ color: tokens.textMuted }}>
                      {new Date(loc.recordedAt).toLocaleString()}
                    </span>
                  </div>

                  <div
                    className="text-xs mt-1 truncate"
                    style={{ color: tokens.textSec }}
                  >
                    {loc.address || "-"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
