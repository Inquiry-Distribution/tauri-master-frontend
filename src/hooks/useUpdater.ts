import { useState, useCallback, useEffect } from "react";

export interface UpdateInfo {
  version: string;
  body: string | null;
}

const isTauri = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export const useUpdater = () => {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = useCallback(async () => {
    if (!isTauri()) return;
    try {
      const { check } = await import("@tauri-apps/plugin-updater");
      const update = await check();
      if (update?.available) {
        setUpdateAvailable({
          version: update.version,
          body: update.body ?? null,
        });
      }
    } catch (err) {
      // silently fail — never interrupt the user for a failed update check
      console.warn("Update check failed:", err);
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    if (!isTauri()) return;
    try {
      setDownloading(true);
      setProgress(0);
      setError(null);

      const { check } = await import("@tauri-apps/plugin-updater");
      const { relaunch } = await import("@tauri-apps/plugin-process");

      const update = await check();
      if (!update?.available) return;

      let downloaded = 0;
      let total = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            total = event.data.contentLength ?? 0;
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            if (total > 0) setProgress(Math.round((downloaded / total) * 100));
            break;
          case "Finished":
            setProgress(100);
            break;
        }
      });

      await relaunch();
    } catch (err: any) {
      setError(err?.message || "Update failed. Please try again.");
      setDownloading(false);
    }
  }, []);

  // check silently on mount
  useEffect(() => {
    checkForUpdates();
  }, []);

  return {
    updateAvailable,
    downloading,
    progress,
    error,
    downloadAndInstall,
    dismiss: () => setUpdateAvailable(null),
  };
};
