import { cn } from "@/src/utils/utils";
import React, { useEffect, useId } from "react";

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  label,
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  const active = checked || indeterminate;

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none leading-none"
      onClick={onChange}
    >
      {/* REAL INPUT (controls everything) */}
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {/* FIXED HIT AREA BOX */}
      <span
        className={cn(
          "relative flex items-center justify-center",
          "w-4 h-4 shrink-0", // 🔥 IMPORTANT: prevents flex distortion
          "rounded border transition-all duration-200",

          "bg-(--surface) border-(--border)",
          "hover:border-(--accent)/60",

          "peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent)/40",

          active ? "bg-(--surface) border-(--accent)" : "hover:bg-(--accent)/5",
        )}
        onClick={onChange}
      >
        {active && (
          <svg
            className="w-3 h-3 text-(--accent)"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate ? (
              <line x1="2" y1="6" x2="10" y2="6" />
            ) : (
              <polyline points="2,6 5,9 10,3" />
            )}
          </svg>
        )}
      </span>

      {label && (
        <span className="text-sm leading-none text-(--textSec)">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
