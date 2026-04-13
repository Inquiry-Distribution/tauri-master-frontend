import { useMemo } from "react";
import { useTheme } from "../../contexts";

type AvatarProps = {
  name: string;
  selected?: boolean;
  onClick?: () => void;

  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "soft" | "outline";

  showName?: boolean;
};

const sizeMap = {
  sm: { avatar: 28, font: 12, gap: 6, padding: "4px 8px" },
  md: { avatar: 36, font: 13, gap: 8, padding: "6px 10px" },
  lg: { avatar: 48, font: 15, gap: 10, padding: "8px 12px" },
};

export const Avatar = ({
  name,
  selected = false,
  onClick,
  size = "md",
  orientation = "horizontal",
  variant = "soft",
  showName = true,
}: AvatarProps) => {
  const { tokens } = useTheme();
  const s = sizeMap[size];

  // initials
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [name]);

  // deterministic color
  const color = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 55%)`;
  }, [name]);

  // variant styles
  const getStyles = () => {
    switch (variant) {
      case "solid":
        return {
          containerBg: selected ? color : tokens.surface,
          textColor: selected ? "#fff" : tokens.text,
          border: "none",
        };
      case "outline":
        return {
          containerBg: "transparent",
          textColor: tokens.text,
          border: `1px solid ${selected ? color : tokens.border}`,
        };
      default: // soft
        return {
          containerBg: selected ? `${color}22` : tokens.surface,
          textColor: tokens.text,
          border: `1px solid ${selected ? color : tokens.border}`,
        };
    }
  };

  const styles = getStyles();

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: orientation === "vertical" ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        padding: orientation === "horizontal" ? s.padding : 4,
        borderRadius: orientation === "horizontal" ? 999 : 12,
        background: styles.containerBg,
        border: styles.border,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {/* Avatar Circle */}
      <div
        style={{
          width: s.avatar,
          height: s.avatar,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: s.avatar * 0.4,
        }}
      >
        {initials}
      </div>

      {/* Name */}
      {showName && (
        <span
          style={{
            fontSize: s.font,
            fontWeight: 500,
            color: styles.textColor,
            whiteSpace: "nowrap",
            textAlign: "center",
            maxWidth: orientation === "vertical" ? s.avatar + 10 : "auto",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {orientation === "vertical" ? name.split(" ")[0] : name}
        </span>
      )}
    </button>
  );
};
