import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Sun, Moon, User, Menu, X } from "lucide-react";
import { useTheme } from "@/src/contexts/index";
import { useLayout } from "@/src/hooks/useLayout";
import NotificationBox from "./NotificationBox";
import { useAuth } from "@/src/contexts/authContext";

export default function Header() {
  const { tokens, isDark, toggleTheme } = useTheme();
  const { toggleSidebar, sidebarOpen } = useLayout();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="h-16 border-b flex items-center justify-between px-4 md:px-6 transition-colors duration-200 sticky top-0 z-30 lg:z-50"
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ color: tokens.textSec, backgroundColor: tokens.borderLight }}
        >
          {sidebarOpen ? (
            <X size={20} className="lg:hidden" />
          ) : (
            <Menu size={20} />
          )}
          <Menu size={20} className="hidden lg:block" />
        </button> */}
        <button
          onClick={() => {
            console.log("Toggling sidebar. Current state: CLICK", sidebarOpen);
            toggleSidebar();
          }}
          className="p-2 rounded-lg transition-colors hover:bg-opacity-10 cursor-pointer"
          style={{ color: tokens.textSec, backgroundColor: tokens.borderLight }}
        >
          {/* <Menu size={20} /> */}
          {sidebarOpen === true ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="relative w-full group hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: tokens.textMuted }}
          />
          <input
            type="text"
            placeholder="Search inquiries, sales persons..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            style={{
              backgroundColor: tokens.bg,
              borderColor: tokens.border,
              color: tokens.text,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10"
          style={{ color: tokens.textSec, backgroundColor: tokens.borderLight }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notificationRef}>
          <button
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg relative transition-colors duration-200 hover:bg-opacity-10"
            style={{
              color: tokens.textSec,
              backgroundColor: tokens.borderLight,
            }}
          >
            <Bell size={20} />
            <span
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2"
              style={{ borderColor: tokens.surface }}
            ></span>
          </button>

          {showNotifications && (
            <NotificationBox onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <div
          className="h-8 w-px mx-1 md:mx-2"
          style={{ backgroundColor: tokens.border }}
        ></div>

        <div className="flex items-center gap-3 pl-1 md:pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold" style={{ color: tokens.text }}>
              {user?.name || "Guest"}
            </p>
            <p
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: tokens.textMuted }}
            >
              {user?.role || "—"}
            </p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "G"}
          </div>
        </div>
      </div>
    </header>
  );
}
