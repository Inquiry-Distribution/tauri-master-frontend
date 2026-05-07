import { useContext, type ReactNode } from "react";
import { ThemeContext } from "../../contexts";
import { X } from "lucide-react";

export function Modal({
  title,
  children,
  onClose,
  width = 480,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  width?: number;
}) {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { tokens } = ctx;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="rounded-2xl shadow-2xl max-w-[calc(100vw-40px)] animate-[slideIn_0.2s_ease]"
        style={{
          backgroundColor: tokens.surface,
          border: `1px solid ${tokens.border}`,
          width,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: tokens.border }}
        >
          <h3
            className="text-base font-semibold"
            style={{ color: tokens.text }}
          >
            {title}
          </h3>

          <button
            type="button"
            title="Close"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 transition"
            style={{ color: tokens.textMuted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
