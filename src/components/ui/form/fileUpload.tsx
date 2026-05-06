import { useRef, useState, useContext, useEffect } from "react";
import {
  UploadCloud,
  Eye,
  Trash2,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileBarChart,
  FileIcon,
} from "lucide-react";
import { ThemeContext } from "@/src/contexts/index";
import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/core";
import { readFile, stat } from "@tauri-apps/plugin-fs";
import Lightbox from "../lightbox";
import Swal from "sweetalert2";

export type UploadedFile = {
  file: File;
  url: string;
  path?: string; // ✅ add this
};

const blockedExtensions = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".js",
  ".msi",
  ".dll",
  ".vbs",
  ".ps1",
  ".jar",
  ".apk",
  ".com",
];

const getFileType = (file: File) => {
  const type = file.type;

  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type === "application/pdf") return "pdf";

  if (
    type.includes("excel") ||
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls")
  )
    return "excel";

  if (
    type.includes("word") ||
    file.name.endsWith(".docx") ||
    file.name.endsWith(".doc")
  )
    return "word";

  if (
    type.includes("presentation") ||
    file.name.endsWith(".ppt") ||
    file.name.endsWith(".pptx")
  )
    return "ppt";

  return "file";
};

const getMimeType = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();

  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    pdf: "application/pdf",
    mp4: "video/mp4",
    mkv: "video/x-matroska",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };

  return map[ext || ""] || "application/octet-stream";
};

// const getSafeUrl = (input: UploadedFile | string) => {
//   if (typeof input === "string") {
//     if (input.startsWith("http")) return input;

//     // local file path (Tauri)
//     return convertFileSrc(input);
//   }

//   // already selected file (has blob URL)
//   return input.url;
// };

const getSafeUrl = (input: UploadedFile | string) => {
  if (typeof input === "string") {
    if (input.startsWith("http")) return input;

    return convertFileSrc(input); // local path
  }

  // ✅ prefer real file path if exists
  if (input?.path) {
    return convertFileSrc(input?.path);
  }

  // fallback (browser case)
  return input.url;
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isTauri = "__TAURI__" in window;

  const isHandledRef = useRef(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [pressingIndex, setPressingIndex] = useState<number | null>(null);

  const handleTouchStart = (i: number) => {
    setPressingIndex(i);

    pressTimer.current = setTimeout(() => {
      setPressingIndex(null);

      Swal.fire({
        title: "Delete this image?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          removeFile(i);

          Swal.fire("Deleted!", "Your image has been removed.", "success");
        }
      });
      // if (confirm("Delete this image?")) {
      //   removeFile(i);
      // }
    }, 600);
  };

  const handleTouchEnd = () => {
    setPressingIndex(null);

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { tokens } = ctx;

  const maxBytes = maxSizeMB * 1024 * 1024;
  const acceptTypes = accept.split(",").map((t) => t.trim());

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    listen("tauri://drag-drop", async (event: any) => {
      if (isHandledRef.current) return;
      isHandledRef.current = true;

      setTimeout(() => {
        isHandledRef.current = false;
      }, 100);
      if (disabled) return;

      const paths: string[] = event.payload.paths;

      const mapped = await Promise.all(
        paths.map(async (path) => {
          const bytes = await readFile(path);
          const name = path.split(/[\\/]/).pop() || "file";

          // const blob = new Blob([bytes]);

          // // const realFile = new File([blob], name, {
          // //   type: "image/jpeg",
          // // });
          // const mime = getMimeType(name);
          // const realFile = new window.File([blob], name, { type: mime });

          // return {
          //   file: realFile,
          //   url: URL.createObjectURL(blob), // better than convertFileSrc
          // };

          const mime = getMimeType(name);
          const file = new File([bytes], name, { type: mime });

          return {
            file,
            url: convertFileSrc(path), // ✅ important
            path, // ✅ store real path
          };
        }),
      );

      setFiles((prev) => {
        const updated = [...prev, ...mapped].slice(0, limit);
        return updated;
      });
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }, [disabled, limit]);
  // useEffect(() => {
  //   let unlisten: (() => void) | undefined;

  //   const setup = async () => {
  //     unlisten = await listen("tauri://drag-drop", async (event: any) => {
  //       if (isHandledRef.current || disabled) return;
  //       isHandledRef.current = true;
  //       setTimeout(() => {
  //         isHandledRef.current = false;
  //       }, 100);

  //       const paths: string[] = event.payload.paths;
  //       const mapped = await Promise.all(
  //         paths.map(async (path) => {
  //           const bytes = await readFile(path);
  //           const name = path.split(/[\\/]/).pop() || "file";
  //           const blob = new Blob([bytes]);
  //           return {
  //             file: new File([blob], name, { type: "image/jpeg" }),
  //             url: URL.createObjectURL(blob),
  //           };
  //         }),
  //       );

  //       setFiles((prev) => [...prev, ...mapped].slice(0, limit));
  //     });
  //   };

  //   setup();

  //   return () => {
  //     unlisten?.();
  //   };
  // }, [disabled, limit]);

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

  const handleFiles = (selected: File[]) => {
    // const valid: UploadedFile[] = [];

    setFiles((prev) => {
      const existing = new Set(
        prev.map((f) => `${f.file.name}-${f.file.size}-${f.file.lastModified}`),
      );

      const next: UploadedFile[] = [];
      for (const file of selected) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;

        const typeOk = acceptTypes.some((ext) =>
          file.name.toLowerCase().endsWith(ext.replace("*", "")),
        );

        const fileName = file.name.toLowerCase();

        const isBlocked = blockedExtensions.some((ext) =>
          fileName.endsWith(ext),
        );

        if (isBlocked) {
          Swal.fire({
            icon: "error",
            title: "File not allowed",
            text: `${file.name} is a restricted file type.`,
          });
          continue;
        }

        if (
          file.size <= maxBytes &&
          typeOk &&
          !existing.has(key) && // ✅ prevents duplicate on second run
          prev.length + next.length < limit
        ) {
          next.push({ file, url: URL.createObjectURL(file) });
        }
      }

      const updated = [...prev, ...next];

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
  // useEffect(() => {
  //   return () => {
  //     files.forEach((f) => URL.revokeObjectURL(getSafeUrl(f)));
  //   };
  // }, [files]);
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(getSafeUrl(f)));
    };
  }, []);

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
        // <div className="grid lg:grid-cols-15 md:grid-cols-6 gap-4 mt-1">
        <div className="flex flex-wrap w-full items-center justify-start gap-4 mt-1">
          {files.map((f, i) => {
            const type = getFileType(f.file);
            return (
              <div
                key={i}
                // onClick={() => {
                //   setLightboxIndex(i);
                //   setLightboxOpen(true);
                // }}
                onClick={async () => {
                  const type = getFileType(f.file);
                  if (type === "image") {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  } else {
                    console.log("URL:", getSafeUrl(f));
                    console.log("FILE SOURCE:", f.path ? "TAURI" : "BROWSER");
                    // window.open(getSafeUrl(f), "_blank");
                    // await open(getSafeUrl(f));
                    await open(f.path || getSafeUrl(f));
                  }
                }}
                onTouchStart={() => handleTouchStart(i)}
                onTouchEnd={handleTouchEnd}
                className="group relative aspect-square w-25 h-25 rounded-xl overflow-hidden cursor-pointer transition-transform duration-150"
                style={{
                  transform: pressingIndex === i ? "scale(0.95)" : "scale(1)",
                  boxShadow:
                    pressingIndex === i
                      ? "0 4px 10px rgba(0,0,0,0.2)"
                      : "0 8px 20px rgba(0,0,0,0.3)",
                  border: `1px solid ${tokens.border}`,
                  backgroundColor: tokens.bg,
                }}
              >
                {/* Thumbnail */}
                {/* <img
                key={getSafeUrl(f)}
                src={getSafeUrl(f)}
                alt={f.file.name}
                className="w-full h-full object-cover"
                onError={() => console.error("Image failed:", f.file.name)}
              /> */}
                {type === "image" && (
                  <img
                    src={getSafeUrl(f)}
                    alt={f.file.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {type === "video" && (
                  <video
                    src={getSafeUrl(f)}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}

                {type === "pdf" && (
                  <iframe
                    src={getSafeUrl(f)}
                    className="w-full h-full no-scrollbar"
                    title={f.file.name}
                  />
                )}

                {["excel", "word", "ppt", "file"].includes(type) && (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    {type === "excel" && (
                      <FileSpreadsheet size={22} color="#22c55e" />
                    )}
                    {type === "word" && <FileText size={22} color="#3b82f6" />}
                    {type === "ppt" && (
                      <FileBarChart size={22} color="#f97316" />
                    )}
                    {type === "file" && <FileIcon size={22} color="#888" />}
                    <span className="text-[9px] text-center px-1 truncate w-full">
                      {f.file.name}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                >
                  <button
                    type="button"
                    title="Preview"
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   window.open(getSafeUrl(f), "_blank");
                    // }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                  >
                    <Eye size={14} style={{ color: tokens.accent }} />
                  </button>
                  {/* <button
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
                </button> */}
                </div>

                {/* File name tooltip at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-2 py-1 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  <p className="text-[10px] text-white truncate">
                    {f.file.name}
                  </p>
                  <p
                    className="text-[9px]"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {(f.file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            );
          })}

          {/* Add more slot — shown when under limit */}
          {files.length < limit && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square w-25 h-25 rounded-xl flex items-center justify-center transition-all"
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
      <Lightbox
        open={lightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        // items={files.map((f) => ({
        //   url: getSafeUrl(f),
        //   name: f.file.name,
        // }))}
        items={files
          .filter((f) => f.file.type.startsWith("image/"))
          .map((f) => ({
            url: getSafeUrl(f),
            name: f.file.name,
          }))}
        onDelete={(i) => {
          removeFile(i);
          if (files.length > 1) {
            setLightboxIndex((prev) =>
              prev >= files.length - 1 ? prev - 1 : prev,
            );
          } else {
            setLightboxOpen(false);
          }
        }}
      />
    </div>
  );
};

export default FileInput;
