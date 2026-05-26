import { useState, useCallback, useEffect } from "react";

export interface UpdateInfo {
  version: string;
  body: string | null;
}

const isTauri = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export const useUpdater = () => {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [noUpdateFound, setNoUpdateFound] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = useCallback(async (manual = false) => {
    if (!isTauri()) return;
    if (manual) {
      setChecking(true);
      setNoUpdateFound(false);
      setError(null);
    }
    try {
      const { check } = await import("@tauri-apps/plugin-updater");
      const update = await check();
      if (update?.available) {
        setUpdateAvailable({ version: update.version, body: update.body ?? null });
        setNoUpdateFound(false);
      } else if (manual) {
        setNoUpdateFound(true);
        // clear "up to date" badge after 3 s
        setTimeout(() => setNoUpdateFound(false), 3000);
      }
    } catch (err: any) {
      const msg: string = err?.message ?? String(err);

      // "platforms" error = latest.json has no release yet — not a real error
      const isNoRelease =
        msg.includes("platforms") ||
        msg.includes("fallback") ||
        msg.includes("No update available");

      if (isNoRelease) {
        // treat as "up to date" — no release has been published yet
        if (manual) {
          setNoUpdateFound(true);
          setTimeout(() => setNoUpdateFound(false), 3000);
        }
      } else if (manual) {
        setError(msg || "Update check failed. Check your connection.");
        setTimeout(() => setError(null), 4000);
      } else {
        console.warn("Update check failed:", err);
      }
    } finally {
      if (manual) setChecking(false);
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

  // silent check on mount — only when a real release exists (latest.json has platforms)
  useEffect(() => {
    checkForUpdates(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    updateAvailable,
    checking,
    noUpdateFound,
    downloading,
    progress,
    error,
    checkForUpdates,
    downloadAndInstall,
    dismiss: () => setUpdateAvailable(null),
  };
};
