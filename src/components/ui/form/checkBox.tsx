// import { cn } from "@/src/utils/utils";
// import React, { useEffect, useId } from "react";

// interface CheckboxProps {
//   checked: boolean;
//   indeterminate?: boolean;
//   onChange: () => void;
//   label?: string;
// }

// const Checkbox: React.FC<CheckboxProps> = ({
//   checked,
//   indeterminate,
//   onChange,
//   label,
// }) => {
//   const ref = React.useRef<HTMLInputElement>(null);
//   const id = useId();

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.indeterminate = !!indeterminate;
//     }
//   }, [indeterminate]);

//   const active = checked || indeterminate;

//   return (
//     <label
//       htmlFor={id}
//       className="flex items-center gap-2 cursor-pointer select-none leading-none"
//       onClick={onChange}
//     >
//       {/* REAL INPUT (controls everything) */}
//       <input
//         ref={ref}
//         id={id}
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="sr-only"
//       />

//       {/* FIXED HIT AREA BOX */}
//       <span
//         className={cn(
//           "relative flex items-center justify-center",
//           "w-4 h-4 shrink-0", // 🔥 IMPORTANT: prevents flex distortion
//           "rounded border transition-all duration-200",

//           "bg-(--surface) border-(--border)",
//           "hover:border-(--accent)/60",

//           "peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent)/40",

//           active ? "bg-(--surface) border-(--accent)" : "hover:bg-(--accent)/5",
//         )}
//         onClick={onChange}
//       >
//         {active && (
//           <svg
//             className="w-3 h-3 text-(--accent)"
//             viewBox="0 0 12 12"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth={2}
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             {indeterminate ? (
//               <line x1="2" y1="6" x2="10" y2="6" />
//             ) : (
//               <polyline points="2,6 5,9 10,3" />
//             )}
//           </svg>
//         )}
//       </span>

//       {label && (
//         <span className="text-sm leading-none text-(--textSec)">{label}</span>
//       )}
//     </label>
//   );
// };

// export default Checkbox;

import { useTheme } from "@/src/contexts";
import React, { useEffect, useId, useRef } from "react";

type CheckboxSize = "sm" | "md" | "lg";
type CheckboxColor = "accent" | "success" | "danger" | "warning";

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
  size?: CheckboxSize;
  color?: CheckboxColor;
  className?: string;
}

const SIZES = {
  sm: { box: 14, radius: 3, icon: 8, font: 12 },
  md: { box: 18, radius: 5, icon: 10, font: 14 },
  lg: { box: 22, radius: 6, icon: 13, font: 16 },
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
  size = "md",
  color = "accent",
  className = "",
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const { tokens } = useTheme();
  const s = SIZES[size];

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const colorMap: Record<CheckboxColor, string> = {
    accent: tokens.accent,
    success: tokens.success,
    danger: tokens.danger,
    warning: tokens.warning,
  };
  const activeColor = colorMap[color];
  const active = checked || indeterminate;

  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        userSelect: "none",
      }}
      className={className}
    >
      {/*
       * Key fix: the shell is position:relative and sized to match the visual box.
       * The input uses position:absolute + inset:0 to cover every pixel of the shell.
       * The visual box uses pointer-events:none so the input owns all pointer events.
       * Hover/focus styles use CSS :has(input:...) — no JS event handlers needed.
       */}
      <span
        style={{
          position: "relative",
          width: s.box,
          height: s.box,
          flexShrink: 0,
        }}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            margin: 0,
            padding: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            zIndex: 1,
          }}
        />

        <CheckboxVisual
          checked={checked}
          indeterminate={indeterminate}
          active={active}
          activeColor={activeColor}
          accentLight={tokens.accentLight}
          border={tokens.border}
          surface={tokens.surface}
          size={s}
        />
      </span>

      {label && (
        <span
          style={{
            fontSize: s.font,
            color: tokens.text,
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

// Separate visual-only component — pointer-events:none, purely decorative
interface VisualProps {
  checked: boolean;
  indeterminate: boolean;
  active: boolean;
  activeColor: string;
  accentLight: string;
  border: string;
  surface: string;
  size: (typeof SIZES)["md"];
}

const CheckboxVisual: React.FC<VisualProps> = ({
  checked,
  indeterminate,
  active,
  activeColor,
  border,
  surface,
  size: s,
}) => (
  <span
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: s.radius,
      border: `1.5px solid ${active ? activeColor : border}`,
      background: active ? activeColor : surface,
      transition: "border-color 120ms, background 120ms",
      pointerEvents: "none", // ← input above handles all clicks
    }}
    aria-hidden="true"
  >
    {checked && !indeterminate && (
      <svg
        width={s.icon}
        height={s.icon * 0.8}
        viewBox="0 0 10 8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1.5,4 4,6.5 8.5,1.5" />
      </svg>
    )}
    {indeterminate && (
      <svg
        width={s.icon}
        height={2}
        viewBox="0 0 10 2"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <line x1="1.5" y1="1" x2="8.5" y2="1" />
      </svg>
    )}
  </span>
);

export default Checkbox;
