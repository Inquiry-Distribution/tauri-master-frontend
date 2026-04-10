import { useTheme } from "@/src/contexts";
import { PersonWorkload, SalesPerson, WorkloadStatus } from "./types";

export function getWorkload(person: SalesPerson): PersonWorkload {
  const s = parseInt(person.id, 10);
  const r = (base: number, v: number) =>
    Math.round(base + ((s * 7) % v) - v / 2);

  const open = r(10, 8);
  const limit = r(15, 4);
  const capUsed = r(10, 6);
  const capLimit = 15;
  const ratio = capUsed / capLimit;

  const status: WorkloadStatus =
    ratio < 0.6 ? "Available" : ratio < 0.85 ? "Busy" : "Overloaded";

  return {
    status,
    inquiriesOpen: open,
    inquiriesLimit: limit,
    capacityUsed: capUsed,
    capacityLimit: capLimit,
    avgResponseMin: r(10, 10),
    conversionRate: r(32, 20),
    lastActive:
      s % 3 === 0 ? "5 min ago" : s % 3 === 1 ? "2 min ago" : "12 min ago",
    lastActiveType: s % 2 === 0 ? "online" : "away",
  };
}

export function statusColor(status: WorkloadStatus) {
  return status === "Available"
    ? "#34D399"
    : status === "Busy"
      ? "#FB923C"
      : "#F87171";
}

export function statusBg(status: WorkloadStatus) {
  const dark = useTheme();
  if (status === "Available") return dark ? "#052E1C" : "#ECFDF5";
  if (status === "Busy") return dark ? "#2D1500" : "#FFF7ED";
  return dark ? "#2D0A0A" : "#FEF2F2";
}

/* ---------------- Progress Bar ---------------- */

export function ProgressBar({
  value,
  max,
  color,
  bg,
}: {
  value: number;
  max: number;
  color: string;
  bg: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      className="h-[5px] rounded-full overflow-hidden"
      style={{ background: bg }}
    >
      <div
        className="h-full rounded-full transition-all duration-400 ease-in-out"
        style={{
          width: `${pct}%`,
          background: color,
        }}
      />
    </div>
  );
}

/* ---------------- Row ---------------- */

export function Row({
  icon,
  label,
  value,
  sub,
  t,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  t: any;
}) {
  return (
    <div
      className="flex items-start gap-2.5 py-[9px] border-b"
      style={{ borderColor: t.borderLight }}
    >
      <span className="text-[16px] shrink-0 mt-[1px]">{icon}</span>

      <div className="flex-1">
        <span className="text-[12.5px]" style={{ color: t.textSec }}>
          {label}
        </span>
      </div>

      <div className="text-right">
        <span className="text-[13px] font-semibold" style={{ color: t.text }}>
          {value}
        </span>

        {sub && (
          <div className="text-[11px] mt-[1px]" style={{ color: t.textMuted }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
