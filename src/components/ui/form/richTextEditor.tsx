import React, { useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/src/contexts";

interface RichTextEditorProps {
  label?: string;
  placeholder: string;
  inputName: string;

  value: string;
  onChange: (content: string) => void;

  height?: number;
  customClassName?: string;

  required?: boolean;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
}

export function RichTextEditor({
  label,
  placeholder,
  inputName,
  value,
  onChange,
  height = 250,
  customClassName = "",
  required = false,
  error = "",
  disabled = false,
  showLabel = true,
}: RichTextEditorProps) {
  const { isDark, tokens } = useTheme();

  const init = useMemo(
    () => ({
      height,
      menubar: false,
      placeholder,

      apiKey: import.meta.env.VITE_TINYMCE_API_KEY,

      skin: isDark ? "oxide-dark" : "oxide",
      content_css: isDark ? "dark" : "default",

      branding: false,
      statusbar: false,

      toolbar:
        "undo redo | bold italic underline | forecolor backcolor | " +
        "alignleft aligncenter alignright | bullist numlist | removeformat",

      // ✅ CRITICAL FIX: force correct light/dark rendering
      content_style: `
        body {
          font-family: ui-sans-serif, system-ui, -apple-system;
          font-size: 14px;
          line-height: 1.6;
          margin: 12px;
          background-color: ${tokens.surface};
          color: ${tokens.text};
        }

        a { color: ${tokens.accent}; }
        p { margin: 0 0 10px; }
      `,
    }),
    [isDark, tokens, height, placeholder],
  );

  return (
    <div className={`w-full ${customClassName}`}>
      {/* Label */}
      {showLabel && label && (
        <label
          className="block text-xs font-medium mb-1 px-1"
          style={{ color: tokens.text }}
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Editor container */}
      <div
        className={`
          rounded-lg border transition
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
          bg-white dark:bg-gray-900
          focus-within:ring-2 focus-within:ring-blue-500
        `}
      >
        <Editor
          id={inputName}
          key={isDark ? "dark" : "light"} // 👈 IMPORTANT FIX
          value={value}
          apiKey="zr260xmpim8wpfblmwbnt7meg3ax34r0vxky4ti6rc9z5qty"
          init={init}
          onEditorChange={onChange}
          disabled={disabled}
        />
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
