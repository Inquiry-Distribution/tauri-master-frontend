import { LoaderCircle } from "lucide-react";
import { useTheme } from "@/src/contexts";

interface BaseLoaderProps {
  size?: number;
  color?: string;
}

const BaseLoader = ({ size = 24, color }: BaseLoaderProps) => {
  const { tokens } = useTheme();

  return (
    <LoaderCircle
      className="animate-spin"
      style={{
        width: size,
        height: size,
        color: color || tokens.accent,
      }}
    />
  );
};

export default BaseLoader;
