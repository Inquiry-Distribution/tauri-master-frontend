import { useTheme } from "@/src/contexts";
import {
  getPriorityStyleMap,
  getStatusStyleMap,
} from "@/src/pages/inquiries/create/inquiryStyles";
import { InquiryImage, StatusHistory } from "@/src/types/inquiry";
import { formatDateTime } from "@/src/utils/utils";
import {
  FileArchive,
  FileCode,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";

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
const removeprefix = (str: string, prefix: string) => {
  return str.replace(prefix, "");
};
/** Image thumbnail card */
export function ImageThumb({ img }: { img: InquiryImage }) {
  const filename = img.filename.split("\\").pop() ?? img.filename;

  const assetURL = import.meta.env.VITE_PUBLIC_ASSET_URL;

  const ext = filename.split(".").pop()?.toLowerCase() || "";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];

  const videoExtensions = ["mp4", "webm", "ogg", "mov"];

  const isImage = imageExtensions.includes(ext);

  const getFilePreview = () => {
    // Actual image preview
    if (isImage && img.url.startsWith("inquiries")) {
      return (
        <img
          src={assetURL ? assetURL + removeprefix(img.url, "/app") : img.url}
          alt={filename}
          className="w-full h-full object-cover"
        />
      );
    }

    // PDF
    if (ext === "pdf") {
      return <FileText size={42} className="text-red-500" />;
    }

    // Word
    if (["doc", "docx"].includes(ext)) {
      return <FileText size={42} className="text-blue-500" />;
    }

    // Excel
    if (["xls", "xlsx", "csv"].includes(ext)) {
      return <FileSpreadsheet size={42} className="text-green-500" />;
    }

    // ZIP / RAR
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return <FileArchive size={42} className="text-yellow-500" />;
    }

    // Video
    if (videoExtensions.includes(ext)) {
      return <FileVideo size={42} className="text-purple-500" />;
    }

    // Code files
    if (["js", "ts", "tsx", "jsx", "json", "html", "css", "py"].includes(ext)) {
      return <FileCode size={42} className="text-cyan-500" />;
    }

    // Generic image icon
    if (["psd", "ai"].includes(ext)) {
      return <FileImage size={42} className="text-pink-500" />;
    }

    // Default fallback
    return <FileIcon size={42} className="text-(--textMuted)" />;
  };

  return (
    <div className="rounded-lg overflow-hidden border border-(--border) group relative">
      <div
        className="h-28 flex items-center justify-center text-(--textMuted)"
        style={{ background: "var(--surfaceElevated)" }}
      >
        {getFilePreview()}
      </div>

      <div className="px-2 py-1.5" style={{ background: "var(--surface)" }}>
        <p className="text-[11px] text-(--textMuted) truncate">{filename}</p>

        <p className="text-[10px] uppercase text-(--textMuted)/70 mt-0.5">
          {ext || "file"}
        </p>
      </div>
    </div>
  );
}
