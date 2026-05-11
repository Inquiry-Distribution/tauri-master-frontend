import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "@/src/contexts/index";

type Option = {
  label: string;
  value: string | number;
};

const Select = ({
  label,
  subLabel,
  selectName,
  options,
  value,
  placeholder = "Select an option",
  customClassName = "",
  required,
  error = "",
  disabled,
  showLabel = true,
  onChange,
}: {
  label?: string;
  subLabel?: string;
  selectName: string;
  options: Option[];
  value?: string | number;
  placeholder?: string;
  customClassName?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
  onChange?: (value: Option) => void;
}) => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;

  const { tokens } = ctx;

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Label */}
      {showLabel && (
        <label
          htmlFor={selectName}
          className="block text-xs font-medium mb-1 px-1 text-(--text)"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Box */}
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((p) => !p)}
          className={`w-full px-3 py-2 text-[13px] rounded-lg border text-left flex justify-between items-center transition ${
            disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          } ${customClassName}`}
          style={{
            backgroundColor: tokens.bg,
            border: `1px solid ${error ? "#ef4444" : tokens.border}`,
            color: tokens.text,
          }}
        >
          <span className={selected ? "" : "text-gray-400"}>
            {selected ? selected.label : placeholder}
          </span>

          {/* dropdown icon */}
          <span className="ml-2 text-gray-400">▾</span>
        </button>

        {/* Dropdown */}
        {open && !disabled && (
          <div
            className="absolute z-50 mt-1 w-full rounded-lg border shadow-lg max-h-60 overflow-auto"
            style={{
              backgroundColor: tokens.bg,
              border: `1px solid ${tokens.border}`,
            }}
          >
            {options.map((opt) => {
              const isActive = opt.value === value;

              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange?.(opt);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-[13px] cursor-pointer transition flex items-center justify-between ${
                    isActive ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? "rgba(59,130,246,0.1)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "rgba(59,130,246,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      isActive ? "rgba(59,130,246,0.1)" : "transparent";
                  }}
                >
                  <span>{opt.label}</span>

                  {isActive && <span className="text-blue-500 text-xs">✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SubLabel */}
      {subLabel && (
        <span className="block text-[11px] text-gray-400 mt-1 px-1">
          {subLabel}
        </span>
      )}

      {/* Error */}
      {error && (
        <span className="text-xs text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default Select;
