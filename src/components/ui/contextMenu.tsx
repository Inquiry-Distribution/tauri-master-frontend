import { useEffect, useRef } from "react";
import { useTheme } from "@/src/contexts";

type MenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

export default function ClickMenu({
  items,
  position,
  onClose,
}: {
  items: MenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-[999] rounded-lg shadow-lg py-1 w-48"
      style={{
        top: position.y,
        left: position.x,
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition"
          style={{
            color: item.danger ? tokens.danger : tokens.text,
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
