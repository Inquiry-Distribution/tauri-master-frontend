import React, { useContext } from "react";
import { ShareInquiryModalProps } from "./types";
import { ThemeContext } from "@/src/contexts";
import {
  getWorkload,
  ProgressBar,
  Row,
  statusBg,
  statusColor,
} from "./helpers";
import ButtonLoader from "../../loader/buttonLoader";

const ShareInquiry = ({
  person,
  // workload: workloadProp,
  onClose,
  onConfirm,
  loading,
}: ShareInquiryModalProps) => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { tokens } = ctx;
  const w = person.workload ?? {
    inquiriesOpen: 0,
    inquiriesLimit: 0,
    avgResponseMin: 0,
    conversionRate: 0,
    lastActive: "",
    lastActiveType: "away",
    capacityUsed: 0,
    capacityLimit: 0,
    status: "active",
  };
  // const w = workloadProp ?? getWorkload(person);
  const sColor = statusColor(w.status);
  const sBg = statusBg(w.status);
  const capPct = Math.round((w.capacityUsed / w.capacityLimit) * 100);

  const capColor =
    capPct < 60 ? "#34D399" : capPct < 85 ? "#FB923C" : "#F87171";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-5">
        <div
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[18px] font-bold text-white shrink-0"
          style={{
            background: `linear-gradient(135deg, ${person.avatarColor}bb, ${person.avatarColor})`,
            border: `2px solid ${person.avatarColor}`,
            boxShadow: `0 0 0 3px ${person.avatarColor}33`,
          }}
        >
          {person.initials}
        </div>

        <div className="flex-1">
          <div
            className="text-[15px] font-bold mb-[2px]"
            style={{ color: tokens.text }}
          >
            {person.name}
          </div>
          <div className="text-[12px]" style={{ color: tokens.textSec }}>
            {person.role}
          </div>
          <div className="text-[11px]" style={{ color: tokens.textMuted }}>
            {person.email}
          </div>
        </div>

        {/* Status */}
        <span
          className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0"
          style={{ background: sBg, color: sColor }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full inline-block"
            style={{
              background: sColor,
              boxShadow: `0 0 0 2px ${sColor}44`,
            }}
          />
          {w.status}
        </span>
      </div>

      {/* Label */}
      <div
        className="text-[10.5px] font-bold uppercase tracking-wide mb-1"
        style={{ color: tokens.textMuted }}
      >
        Availability &amp; Workload
      </div>

      {/* Rows */}
      <div className="mb-4">
        <Row
          icon="📊"
          label="Workload"
          value={`${w.inquiriesOpen} / ${w.inquiriesLimit} inquiries`}
          t={tokens}
        />
        <Row
          icon="⚡"
          label="Avg. response time"
          value={`${w.avgResponseMin} min`}
          t={tokens}
        />
        <Row
          icon="🎯"
          label="Conversion rate"
          value={`${w.conversionRate}%`}
          t={tokens}
        />
        <Row
          icon="📂"
          label="Active inquiries"
          value={`${w.inquiriesOpen} open`}
          t={tokens}
        />
        <Row
          icon="🕒"
          label="Last active"
          value={w.lastActive}
          sub={w.lastActiveType === "online" ? "● Online" : "◌ Away"}
          t={tokens}
        />
      </div>

      {/* Capacity Card */}
      <div
        className="rounded-[10px] px-[14px] py-3 mb-5 border"
        style={{
          background: tokens.surfaceElevated,
          borderColor: tokens.border,
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-[12px] font-medium"
            style={{ color: tokens.textSec }}
          >
            Capacity
          </span>
          <span className="text-[12px] font-bold" style={{ color: capColor }}>
            {w.capacityUsed} / {w.capacityLimit}
            <span
              className="text-[10.5px] font-normal ml-1"
              style={{ color: tokens.textMuted }}
            >
              ({capPct}%)
            </span>
          </span>
        </div>

        <ProgressBar
          value={w.capacityUsed}
          max={w.capacityLimit}
          color={capColor}
          bg={tokens.borderLight}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 justify-end">
        <button
          onClick={onClose}
          className="px-5 py-[9px] rounded-lg text-[13px] font-semibold border transition-colors"
          style={{
            borderColor: tokens.border,
            color: tokens.textSec,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = tokens.surfaceElevated)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          Cancel
        </button>

        <button
          onClick={() => {
            onConfirm(person);
            onClose();
          }}
          className="px-[22px] py-[9px] rounded-lg text-[13px] font-semibold text-white transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accentText})`,
            boxShadow: `0 4px 12px ${tokens.accent}44`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {loading ? <ButtonLoader /> : "Confirm Share"}
        </button>
      </div>
    </div>
  );
};

export default ShareInquiry;
