import BaseLoader from "./baseLoader";
import { useTheme } from "@/src/contexts";

const FullPageLoader = () => {
  const { tokens } = useTheme();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: `${tokens.bg}CC`,
        backdropFilter: "blur(6px)",
      }}
    >
      <BaseLoader size={60} />
    </div>
  );
};

export default FullPageLoader;
