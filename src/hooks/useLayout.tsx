import React, { createContext, useContext, useState, useEffect } from "react";

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// export function LayoutProvider({ children }: { children: React.ReactNode }) {
//   // const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
//   const [isMobile, setIsMobile] = useState(false);

//   // useEffect(() => {
//   //   const checkMobile = () => {
//   //     const mobile = window.innerWidth < 1024;
//   //     setIsMobile(mobile);
//   //     if (mobile) {
//   //       setSidebarOpen(false);
//   //     } else {
//   //       setSidebarOpen(true);
//   //     }
//   //   };

//   //   checkMobile();
//   //   window.addEventListener('resize', checkMobile);
//   //   return () => window.removeEventListener('resize', checkMobile);
//   // }, []);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);
//   // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const toggleSidebar = () => {
//     setSidebarOpen((prev) => !prev);
//   };
//   return (
//     <LayoutContext.Provider
//       value={{ sidebarOpen, setSidebarOpen, toggleSidebar, isMobile }}
//     >
//       {children}
//     </LayoutContext.Provider>
//   );
// }

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSidebar = () => {
    console.log("Toggling sidebar. Current state:", sidebarOpen);
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
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
