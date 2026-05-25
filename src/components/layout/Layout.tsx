import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "@/src/contexts/index";
import { LayoutProvider, useLayout } from "@/src/hooks/useLayout";
import { UpdateBanner } from "@/src/components/ui/UpdateBanner";

function LayoutContent() {
  const { tokens } = useTheme();
  const { sidebarOpen, setSidebarOpen, isMobile } = useLayout();

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: tokens.bg, color: tokens.text }}
    >
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <UpdateBanner />
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
}
