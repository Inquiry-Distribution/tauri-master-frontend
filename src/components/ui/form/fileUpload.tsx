import { useRef, useState, useContext, useEffect } from "react";
import { UploadCloud, Eye, Trash2, FileImage } from "lucide-react";
import { ThemeContext } from "@/src/contexts/index";

export type UploadedFile = {
  file: File;
  url: string;
};

const FileInput = ({
  label,
  required,
  accept = ".jpg,.jpeg,.png",
  maxSizeMB = 5,
  limit = 8,
  error = "",
  disabled,
  onChange,
  inputName,
}: {
  label: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  limit?: number;
  error?: string;
  disabled?: boolean;
  inputName: string;
  onChange?: (files: File[]) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { tokens } = ctx;

  const maxBytes = maxSizeMB * 1024 * 1024;
  const acceptTypes = accept.split(",").map((t) => t.trim());

  // const handleFiles = (selected: File[]) => {
  //   const valid: UploadedFile[] = [];
  //   for (const file of selected) {
  //     const typeOk = acceptTypes.some((ext) =>
  //       file.name.toLowerCase().endsWith(ext.replace("*", "")),
  //     );
  //     if (
  //       file.size <= maxBytes &&
  //       typeOk &&
  //       files.length + valid.length < limit
  //     ) {
  //       valid.push({ file, url: URL.createObjectURL(file) });
  //     }
  //   }
  //   const updated = [...files, ...valid];
  //   setFiles(updated);
  //   onChange?.(updated.map((f) => f.file));
  // };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  // const handleFiles = (selected: File[]) => {
  //   setFiles((prev) => {
  //     const valid: UploadedFile[] = [];

  //     for (const file of selected) {
  //       const typeOk = acceptTypes.some((ext) =>
  //         file.name.toLowerCase().endsWith(ext.replace("*", "")),
  //       );

  //       if (
  //         file.size <= maxBytes &&
  //         typeOk &&
  //         prev.length + valid.length < limit
  //       ) {
  //         valid.push({ file, url: URL.createObjectURL(file) });
  //       }
  //     }

  //     const updated = [...prev, ...valid];
  //     onChange?.(updated.map((f) => f.file));
  //     return updated;
  //   });
  // };

  const handleFiles = (selected: File[]) => {
    const valid: UploadedFile[] = [];

    setFiles((prev) => {
      for (const file of selected) {
        const typeOk = acceptTypes.some((ext) =>
          file.name.toLowerCase().endsWith(ext.replace("*", "")),
        );

        if (
          file.size <= maxBytes &&
          typeOk &&
          prev.length + valid.length < limit
        ) {
          valid.push({ file, url: URL.createObjectURL(file) });
        }
      }

      const updated = [...prev, ...valid];

      return updated;
    });
  };

  useEffect(() => {
    onChange?.(files.map((f) => f.file));
  }, [files]);
  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].url);
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated.map((f) => f.file));
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;

      const items = e.clipboardData?.files;
      if (!items || items.length === 0) return;

      const files = Array.from(items).filter((file) =>
        file.type.startsWith("image/"),
      );

      if (files.length > 0) {
        handleFiles(files);
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [disabled]);
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [files]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Label */}
      <label
        className="text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: tokens.textSec }}
      >
        {label}
        {required && <span style={{ color: tokens.danger }}> *</span>}
      </label>

      {/* Drop zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        style={{
          border: `2px dashed ${dragging ? tokens.accent : error ? tokens.danger : tokens.border}`,
          backgroundColor: dragging ? tokens.accentLight : tokens.bg,
          borderRadius: 12,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          opacity: disabled ? 0.6 : 1,
        }}
        className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center select-none"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
          style={{ backgroundColor: tokens.accentLight }}
        >
          <UploadCloud size={22} style={{ color: tokens.accent }} />
        </div>

        <p className="text-sm font-medium" style={{ color: tokens.text }}>
          Drag & drop files here, or{" "}
          <span style={{ color: tokens.accent }} className="font-semibold">
            browse
          </span>
        </p>

        <p className="text-xs" style={{ color: tokens.textMuted }}>
          {acceptTypes.join(", ")} &nbsp;·&nbsp; Max {maxSizeMB} MB
          &nbsp;·&nbsp; Up to {limit} files
        </p>

        <input
          title={label}
          name={inputName}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          disabled={disabled}
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <span className="text-xs font-medium" style={{ color: tokens.danger }}>
          {error}
        </span>
      )}

      {/* Image preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-1">
          {files.map((f, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden"
              style={{
                border: `1px solid ${tokens.border}`,
                backgroundColor: tokens.bg,
              }}
            >
              {/* Thumbnail */}
              <img
                key={f.url}
                src={f.url}
                alt={f.file.name}
                className="w-full h-full object-cover"
                onError={() => console.error("Image failed:", f.file.name)}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              >
                <button
                  type="button"
                  title="Preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(f.url, "_blank");
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <Eye size={14} style={{ color: tokens.accent }} />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <Trash2 size={14} style={{ color: tokens.danger }} />
                </button>
              </div>

              {/* File name tooltip at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              >
                <p className="text-[10px] text-white truncate">{f.file.name}</p>
                <p
                  className="text-[9px]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {(f.file.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
          ))}

          {/* Add more slot — shown when under limit */}
          {files.length < limit && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl flex items-center justify-center transition-all"
              style={{
                border: `2px dashed ${tokens.border}`,
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = tokens.accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = tokens.border)
              }
            >
              <div className="flex flex-col items-center gap-1">
                <FileImage size={20} style={{ color: tokens.textMuted }} />
                <span
                  className="text-[10px]"
                  style={{ color: tokens.textMuted }}
                >
                  Add more
                </span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Count badge */}
      {files.length > 0 && (
        <p className="text-xs" style={{ color: tokens.textMuted }}>
          {files.length} of {limit} files uploaded
        </p>
      )}
    </div>
  );
};

export default FileInput;
