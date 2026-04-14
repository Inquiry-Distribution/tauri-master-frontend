import { useContext, type ReactNode } from "react";
import { ThemeContext } from "../../contexts";

export function Card({
  children,
  className = "",
  style: sx,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { tokens } = ctx;

  return (
    <div
      className={`rounded-xl px-6 py-5 ${className}`}
      style={{
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        ...sx,
      }}
    >
      {children}
    </div>
  );
}
