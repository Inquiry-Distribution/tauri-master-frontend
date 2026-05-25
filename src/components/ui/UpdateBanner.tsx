import React from "react";
import { Download, X, RefreshCw } from "lucide-react";
import { useUpdater } from "@/src/hooks/useUpdater";

export function UpdateBanner() {
  const { updateAvailable, downloading, progress, error, downloadAndInstall, dismiss } =
    useUpdater();

  if (!updateAvailable) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm font-medium bg-blue-600 text-white shrink-0">
      <div className="flex items-center gap-2">
        <RefreshCw size={15} className={downloading ? "animate-spin" : ""} />
        <span>
          InquiryHub v{updateAvailable.version} is available
          {updateAvailable.body ? ` — ${updateAvailable.body}` : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {downloading ? (
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-blue-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs tabular-nums">
              {progress > 0 ? `${progress}%` : "Starting..."}
            </span>
          </div>
        ) : (
          <>
            {error && (
              <span className="text-xs text-red-200">{error}</span>
            )}
            <button
              onClick={downloadAndInstall}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-blue-700 text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              <Download size={13} />
              Update Now
            </button>
            <button
              onClick={dismiss}
              title="Remind me later"
              className="p-1 rounded hover:bg-blue-700 transition-colors"
            >
              <X size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
