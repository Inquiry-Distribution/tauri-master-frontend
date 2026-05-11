import { useContext } from "react";
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
  title,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "dashed";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  disabled?: boolean;
  icon?: any;
  style?: React.CSSProperties;
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;
}) {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;

  const { tokens } = ctx;

  // ── Sizes (unchanged) ─────────────────────────────
  const sizeClasses =
    size === "xs"
      ? "text-[11px] px-2 py-[4px]"
      : size === "sm"
        ? "text-xs px-2.5 py-[5px]"
        : size === "md"
          ? "text-[13px] px-3.5 py-[7px]"
          : size === "lg"
            ? "text-[15px] px-4 py-[8px]"
            : "text-[16px] px-5 py-[10px]";

  const baseClasses =
    "inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 outline-none";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  // ── Variants (same logic preserved) ─────────────
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
    success: {
      bg: tokens.successLight,
      color: tokens.success,
      border: `1px solid ${tokens.success}30`,
      hoverBg: tokens.success + "20",
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

  // ── CSS variables approach (key improvement) ─────
  // This replaces React hover state safely
  const cssVars = {
    "--btn-bg": v.bg,
    "--btn-color": v.color,
    "--btn-border": v.border,
    "--btn-hover-bg": v.hoverBg,
    ...sx,
  } as React.CSSProperties;

  return (
    <button
      title={title || ""}
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${disabledClasses}
        btn-theme
        ${className}
      `}
      style={cssVars}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
