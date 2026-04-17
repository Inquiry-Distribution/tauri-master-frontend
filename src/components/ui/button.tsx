import { useContext, useState } from "react";
import { ThemeContext } from "@/src/contexts";

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  icon: Icon,
  style: sx,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "dashed";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  disabled?: boolean;
  icon?: any;
  style?: React.CSSProperties;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  const ctx = useContext(ThemeContext);
  const [hovered, setHovered] = useState(false);

  if (!ctx) return null;
  const { tokens } = ctx;

  // ── Sizes ─────────────────────────────
  const sizeClasses =
    size === "xs"
      ? "text-[11px] px-2 py-[4px]"
      : size === "sm"
        ? "text-xs px-2.5 py-[5px]"
        : size === "md"
          ? "text-[13px] px-3.5 py-[7px]"
          : size === "lg"
            ? "text-[15px] px-4 py-[8px]"
            : "text-[16px] px-5 py-[10px]"; // xl

  // ── Base ──────────────────────────────
  const baseClasses =
    "inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 outline-none";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  // ── Variants ──────────────────────────
  const variants = {
    primary: {
      bg: tokens.accent,
      color: "#fff",
      border: "none",
      hoverBg: tokens.accentText,
    },
    secondary: {
      bg: tokens.surfaceElevated,
      color: tokens.text,
      border: `1px solid ${tokens.border}`,
      hoverBg: tokens.surface,
    },
    danger: {
      bg: tokens.dangerLight,
      color: tokens.danger,
      border: `1px solid ${tokens.danger}30`,
      hoverBg: tokens.danger + "20",
    },
    ghost: {
      bg: "transparent",
      color: tokens.textSec,
      border: `1px solid ${tokens.border}`,
      hoverBg: tokens.borderLight,
    },
    dashed: {
      bg: tokens.surface + "30",
      color: tokens.accentText,
      border: `1px dashed ${tokens.accent}`,
      hoverBg: tokens.accentLight,
    },
  };

  const v = variants[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      style={{
        backgroundColor: hovered && !disabled ? v.hoverBg : v.bg,
        color: v.color,
        border: v.border,
        ...sx,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
