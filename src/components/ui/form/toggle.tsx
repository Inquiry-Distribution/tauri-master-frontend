import { useTheme } from "@/src/contexts";
import React, { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  name?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  className = "",
}) => {
  const { tokens } = useTheme();

  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isOn;
    if (!isControlled) setInternal(newValue);
    onChange?.(newValue);
  };

  const sizes = {
    sm: {
      track: "w-10 h-5",
      thumb: "w-4 h-4",
      move: "translate-x-5", // FIXED
    },
    md: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      move: "translate-x-7", // FIXED
    },
    lg: {
      track: "w-18 h-9",
      thumb: "w-8 h-8",
      move: "translate-x-9", // FIXED
    },
  };

  const s = sizes[size];

  return (
    <label
      className={`inline-flex items-center gap-3 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full
          transition-all duration-300 ease-out
          ${s.track}
        `}
        style={{
          background: isOn
            ? `linear-gradient(135deg, ${tokens.accent}, ${tokens.accent}aa)`
            : tokens.border,
          boxShadow: isOn
            ? `0 6px 18px ${tokens.accent}55`
            : `inset 0 2px 6px rgba(0,0,0,0.25)`,
        }}
      >
        {/* Glow layer */}
        {isOn && (
          <span
            className="absolute inset-0 rounded-full blur-md opacity-40"
            style={{ backgroundColor: tokens.accent }}
          />
        )}

        {/* Thumb */}
        <span
          className={`
            absolute left-0.5
            ${s.thumb}
            rounded-full
            transition-all duration-300 ease-out
            ${isOn ? s.move : "translate-x-0"}
          `}
          style={{
            backgroundColor: tokens.surface,
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        />

        {/* Optional inner highlight */}
        <span className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />
      </button>

      {label && (
        <span style={{ color: tokens.text }} className="text-sm select-none">
          {label}
        </span>
      )}
    </label>
  );
};
