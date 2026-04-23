import React, { createContext, useContext, useState, useEffect } from "react";

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);

      // critical fix: enforce consistent behavior
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize(); // run once on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        isMobile,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
