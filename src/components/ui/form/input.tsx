import { useContext, useState } from "react";
import { ThemeContext } from "@/src/contexts/index";
import { Calendar, Eye, EyeClosed } from "lucide-react";

const Input = ({
  label,
  subLabel,
  placeholder,
  inputName,
  inputType = "text",
  inputValue,
  customClassName = "",
  onChange,
  onBlur,
  required,
  error = "",
  disabled,
  showLabel = true,
  ...props
}: {
  label?: string;
  subLabel?: string;
  placeholder: string;
  inputName: string;
  inputType?: string;
  inputValue?: string | number;
  customClassName?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const ctx = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  if (!ctx) return null;

  const { tokens } = ctx;

  const isPassword = inputType === "password";
  const isDate = inputType === "date";

  return (
    <div className="w-full">
      {showLabel && (
        <label
          htmlFor={inputName}
          className="block text-xs font-medium mb-1 px-1 text-(--text)"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`relative rounded-lg border transition ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
        style={{
          backgroundColor: tokens.bg,
          border: `1px solid ${error ? "#ef4444" : tokens.border}`,
        }}
      >
        <input
          id={inputName}
          name={inputName}
          type={isPassword && showPassword ? "text" : inputType}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-3 py-2 text-[13px] rounded-lg outline-none bg-transparent placeholder:text-gray-400 ${
            isPassword ? "pr-10" : ""
          } ${customClassName}`}
          style={{ color: tokens.text }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {!showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        )}

        {/* Custom Date Icon */}
        {isDate && (
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(inputName) as HTMLInputElement;
              el?.showPicker?.(); // modern browsers
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <Calendar size={20} />
          </button>
        )}
      </div>

      {subLabel && (
        <span className="block text-[11px] text-gray-400 mt-1 px-1">
          {subLabel}
        </span>
      )}

      {error && (
        <span className="text-xs text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default Input;
