import { cn } from "@/src/utils/utils";
import { SortDirection } from "./types";

const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
  <span className="ml-1.5 inline-flex flex-col gap-[2px] opacity-60">
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      className={cn(
        "transition-opacity",
        direction === "asc" ? "opacity-100" : "opacity-30",
      )}
    >
      <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
    </svg>
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      className={cn(
        "transition-opacity",
        direction === "desc" ? "opacity-100" : "opacity-30",
      )}
    >
      <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
    </svg>
  </span>
);

export default SortIcon;
