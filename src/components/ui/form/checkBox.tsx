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
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  return (
    <label
      htmlFor={id}
      className="inline-flex items-center cursor-pointer select-none"
    >
      <span className="relative flex items-center justify-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        {/* Custom box */}
        <span
          className={cn(
            "w-4 h-4 rounded border transition-all duration-150",
            "border-(--border) bg-(--surface)",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-(--primary)/50",
            checked || indeterminate
              ? "bg-(--primary) border-(--primary)"
              : "hover:border-(--primary)/60",
          )}
        />
        {/* Checkmark / dash */}
        {(checked || indeterminate) && (
          <svg
            className="absolute w-3 h-3 text-white pointer-events-none"
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
        <span className="ml-2 text-sm text-(--textMuted)">{label}</span>
      )}
    </label>
  );
};
export default Checkbox;
