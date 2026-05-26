import React, { createContext, useContext } from "react";
import { useUpdater, UpdateInfo } from "@/src/hooks/useUpdater";

interface UpdaterContextValue {
  updateAvailable: UpdateInfo | null;
  checking: boolean;
  noUpdateFound: boolean;
  downloading: boolean;
  progress: number;
  error: string | null;
  checkForUpdates: (manual?: boolean) => Promise<void>;
  downloadAndInstall: () => Promise<void>;
  dismiss: () => void;
}

const UpdaterContext = createContext<UpdaterContextValue | null>(null);

export function UpdaterProvider({ children }: { children: React.ReactNode }) {
  const updater = useUpdater();
  return (
    <UpdaterContext.Provider value={updater}>
      {children}
    </UpdaterContext.Provider>
  );
}

export function useUpdaterContext() {
  const ctx = useContext(UpdaterContext);
  if (!ctx) throw new Error("useUpdaterContext must be used inside UpdaterProvider");
  return ctx;
}
