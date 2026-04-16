import { useTheme } from "@/src/contexts";
import {
  getPriorityStyleMap,
  getStatusStyleMap,
} from "@/src/pages/inquiries/create/inquiryStyles";
import { InquiryImage, StatusHistory } from "@/src/types/inquiry";
import { formatDateTime } from "@/src/utils/utils";

/** Thin labelled meta row */
export function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-(--textMuted) shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-widest text-(--textMuted)">
          {label}
        </span>
        <span className="text-sm text-(--text) font-medium break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

/** Divider */
export function Divider() {
  return <hr className="border-(--border) my-1" />;
}

/** Section heading */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-(--textMuted) mb-3">
      {children}
    </h3>
  );
}

/** Status badge */
export function StatusBadge({
  status,
  isDark,
}: {
  status: string;
  isDark: boolean;
}) {
  const styles = getStatusStyleMap(isDark);
  const variant = styles[status as keyof typeof styles] ?? {
    bg: "#e5e7eb",
    color: "#374151",
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize"
      style={{ backgroundColor: variant.bg, color: variant.color }}
    >
      {status?.replace("_", " ") ?? ""}
    </span>
  );
}

/** Priority badge */
export function PriorityBadge({
  priority,
  isDark,
}: {
  priority: string;
  isDark: boolean;
}) {
  const styles = getPriorityStyleMap(isDark);
  const variant = styles[priority as keyof typeof styles];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize"
      style={variant ?? {}}
    >
      {priority}
    </span>
  );
}

/** Timeline dot row */
export function TimelineItem({
  entry,
  isLast,
}: {
  entry: StatusHistory;
  isLast: boolean;
}) {
  const { isDark } = useTheme();
  const styles = getStatusStyleMap(isDark);
  const variant = styles[entry.status as keyof typeof styles];

  return (
    <div className="flex gap-3">
      {/* spine */}
      <div className="flex flex-col items-center">
        <div
          className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 border-2"
          style={{
            backgroundColor: variant?.color ?? "#94a3b8",
            borderColor: variant?.bg ?? "#e5e7eb",
          }}
        />
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{ background: "var(--border)" }}
          />
        )}
      </div>

      {/* content */}
      <div className="pb-4">
        <p className="text-sm font-medium text-(--text) capitalize">
          {entry.status.replace("_", " ")}
        </p>
        <p className="text-xs text-(--textMuted) mt-0.5">
          By <span className="text-(--text)">{entry.changedBy.name}</span>
          {" · "}
          {formatDateTime(entry.changedAt)}
        </p>
      </div>
    </div>
  );
}

/** Image thumbnail card */
export function ImageThumb({ img }: { img: InquiryImage }) {
  const filename = img.filename.split("\\").pop() ?? img.filename;
  const assetURL = import.meta.env.VITE_PUBLIC_ASSET_URL;
  return (
    <div className="rounded-lg overflow-hidden border border-(--border) group relative">
      <div
        className="h-28 flex items-center justify-center text-(--textMuted)"
        style={{ background: "var(--surfaceElevated)" }}
      >
        {/* Show image if URL is absolute; otherwise show placeholder */}
        {img.url.startsWith("uploads") ? (
          <img
            src={assetURL ? assetURL + img.url : img.url}
            alt={filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>
      <div className="px-2 py-1.5" style={{ background: "var(--surface)" }}>
        <p className="text-[11px] text-(--textMuted) truncate">{filename}</p>
      </div>
    </div>
  );
}
