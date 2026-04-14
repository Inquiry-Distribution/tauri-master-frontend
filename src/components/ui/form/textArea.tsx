import { useContext } from "react";
import { ThemeContext } from "@/src/contexts/index";

const TextArea = ({
  label,
  placeholder,
  inputName,
  rows = 3,
  onChange,
  inputValue,
  customClassName = "",
  required,
  error = "",
  disabled = false,
  showLabel = true,
}: {
  label?: string;
  placeholder: string;
  inputName: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputValue?: string;
  customClassName?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
}) => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;

  const { tokens } = ctx;

  return (
    <div className="w-full">
      {/* Label */}
      {label && showLabel && (
        <label
          htmlFor={inputName}
          className="block text-xs font-medium mb-1 px-1"
          style={{ color: tokens.text }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <div
        className={`rounded-lg border transition ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
        style={{
          backgroundColor: tokens.bg,
          border: `1px solid ${error ? "#ef4444" : tokens.border}`,
        }}
      >
        <textarea
          id={inputName}
          name={inputName}
          rows={rows}
          value={inputValue}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-[7px] text-[13px] outline-none bg-transparent resize-none placeholder:text-gray-400 ${customClassName}`}
          style={{ color: tokens.text }}
        />
      </div>

      {/* Error */}
      {error && (
        <span className="text-xs text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default TextArea;
