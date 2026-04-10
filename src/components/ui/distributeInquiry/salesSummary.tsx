import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  text: string;
  textSec: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentText: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarActive: string;
  sidebarActiveBg: string;
  chartGrid: string;
  tooltipBg: string;
  sidebarBorder: string;
  sidebarHeading: string;
  sidebarHover: string;
}

interface SalesSummaryRow {
  id: string;
  label: string;
  thisMonth: number | string;
  lastMonth: number | string;
  delta?: number; // % change
  format?: "currency" | "number" | "percent" | "text";
}

interface SalesSummaryTableProps {
  t: ThemeTokens;
  salesPersonName?: string;
  avatarColor?: string;
  initials?: string;
  month?: string; // e.g. "April 2026"
  rows?: SalesSummaryRow[];
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const DUMMY_ROWS: SalesSummaryRow[] = [
  {
    id: "1",
    label: "Total Inquiries Assigned",
    thisMonth: 48,
    lastMonth: 41,
    delta: 17.1,
    format: "number",
  },
  {
    id: "2",
    label: "Inquiries Closed (Won)",
    thisMonth: 18,
    lastMonth: 14,
    delta: 28.6,
    format: "number",
  },
  {
    id: "3",
    label: "Inquiries Lost",
    thisMonth: 5,
    lastMonth: 8,
    delta: -37.5,
    format: "number",
  },
  {
    id: "4",
    label: "Revenue Generated",
    thisMonth: 1420000,
    lastMonth: 1180000,
    delta: 20.3,
    format: "currency",
  },
  {
    id: "5",
    label: "Avg. Deal Size",
    thisMonth: 78889,
    lastMonth: 84286,
    delta: -6.4,
    format: "currency",
  },
  {
    id: "6",
    label: "Conversion Rate",
    thisMonth: 37.5,
    lastMonth: 34.1,
    delta: 3.4,
    format: "percent",
  },
  {
    id: "7",
    label: "Follow-up Calls Made",
    thisMonth: 134,
    lastMonth: 119,
    delta: 12.6,
    format: "number",
  },
  {
    id: "8",
    label: "Pending Inquiries",
    thisMonth: 25,
    lastMonth: 19,
    delta: 31.6,
    format: "number",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatVal(val: number | string, format?: string): string {
  if (typeof val === "string") return val;
  switch (format) {
    case "currency":
      return `₹${val.toLocaleString("en-IN")}`;
    case "percent":
      return `${val}%`;
    default:
      return val.toLocaleString("en-IN");
  }
}

function DeltaBadge({ delta, t }: { delta?: number; t: ThemeTokens }) {
  if (delta === undefined) return null;
  const up = delta >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontSize: 10.5,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
        background: up ? t.successLight : t.dangerLight,
        color: up ? t.success : t.danger,
      }}
    >
      {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function SalesSummaryTable({
  t,
  salesPersonName = "Arjun Mehta",
  avatarColor = "#4F7DF3",
  initials = "AM",
  month = "April 2026",
  rows = DUMMY_ROWS,
}: SalesSummaryTableProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        border: `1.5px solid ${t.border}`,
        borderRadius: 12,
        overflow: "hidden",
        background: t.surface,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          background: t.surfaceElevated,
          borderBottom: `1.5px solid ${t.border}`,
        }}
      >
        {/* Mini avatar */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `${avatarColor}22`,
            border: `1.5px solid ${avatarColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: avatarColor,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
          {salesPersonName}
        </span>
        <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 2 }}>
          — Sales Summary
        </span>

        {/* Month pill */}
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 600,
            color: t.accentText,
            background: t.accentLight,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          {month}
        </span>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 140px 140px 100px",
          padding: "7px 16px",
          borderBottom: `1px solid ${t.borderLight}`,
          background: t.bg,
        }}
      >
        {["Metric", "This Month", "Last Month", "Change"].map((col) => (
          <span
            key={col}
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: t.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textAlign: col !== "Metric" ? "right" : "left",
            }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, idx) => (
        <div
          key={row.id}
          onMouseEnter={() => setHovered(row.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 140px 100px",
            padding: "10px 16px",
            borderBottom:
              idx < rows.length - 1 ? `1px solid ${t.borderLight}` : "none",
            background: hovered === row.id ? t.accentLight : "transparent",
            transition: "background 0.12s ease",
            alignItems: "center",
          }}
        >
          {/* Label */}
          <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>
            {row.label}
          </span>

          {/* This month */}
          <span
            style={{
              fontSize: 13,
              color: t.text,
              fontWeight: 600,
              textAlign: "right",
            }}
          >
            {formatVal(row.thisMonth, row.format)}
          </span>

          {/* Last month */}
          <span style={{ fontSize: 13, color: t.textSec, textAlign: "right" }}>
            {formatVal(row.lastMonth, row.format)}
          </span>

          {/* Delta badge */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <DeltaBadge delta={row.delta} t={t} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SalesSummaryTable;
