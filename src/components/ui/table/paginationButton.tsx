import { cn } from "@/src/utils/utils";

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function buildPages(current: number, total: number): (number | "...")[] {
  const delta = 2;
  const range: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    )
      range.push(i);
  }
  const pages: (number | "...")[] = [];
  let last: number | undefined;
  for (const i of range) {
    if (last !== undefined) {
      if (i - last === 2) pages.push(last + 1);
      else if (i - last > 1) pages.push("...");
    }
    pages.push(i);
    last = i;
  }
  return pages;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  active,
  className,
  children,
  ...props
}) => (
  <button
    type="button"
    className={cn(
      "min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-all",
      "focus:outline-none focus:ring-2 focus:ring-(--primary)/40",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      active
        ? "bg-(--primary) text-white shadow-sm"
        : "bg-(--surface) text-(--textMuted) hover:text-(--text) hover:border-(--primary)/40 border border-(--border)",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default PaginationButton;
