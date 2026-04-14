import { LoaderCircle } from "lucide-react";
import { useTheme } from "@/src/contexts";
import clsx from "clsx";

type LoaderVariant = "primary" | "muted" | "white";

const getColor = (variant: LoaderVariant, tokens: any) => {
  switch (variant) {
    case "muted":
      return tokens.textMuted;
    case "white":
      return "#ffffff";
    default:
      return tokens.accent;
  }
};

interface CommonLoaderProps {
  fullScreen?: boolean;
  size?: number;
  overlay?: boolean;
  className?: string;
  variant?: LoaderVariant;
}

const CommonLoader = ({
  fullScreen = true,
  size = 48,
  overlay = true,
  className,
  variant = "primary",
}: CommonLoaderProps) => {
  const { tokens } = useTheme();

  return (
    <div
      className={clsx(
        fullScreen && "fixed inset-0 z-[9999]",
        "flex items-center justify-center",
        className,
      )}
      style={{
        backgroundColor: overlay
          ? `${tokens.bg}CC` // adds opacity (CC ≈ 80%)
          : "transparent",
        backdropFilter: overlay ? "blur(6px)" : "none",
      }}
    >
      <LoaderCircle
        style={{
          width: size,
          height: size,
          color: tokens.accent ? getColor(variant, tokens) : "#4F7DF3",
        }}
        className="animate-spin"
      />
    </div>
  );
};

export default CommonLoader;
