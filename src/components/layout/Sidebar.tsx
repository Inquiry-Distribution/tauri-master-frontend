import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Smartphone,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useTheme } from "@/src/contexts";
import { useLayout } from "@/src/hooks/useLayout";
import { cn } from "@/src/utils/utils";
import { useAuth } from "@/src/contexts/authContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Inquiries", path: "/inquiries" },
  { icon: Users, label: "Sales Persons", path: "/sales-persons" },
  { icon: Smartphone, label: "Devices", path: "/devices" },
  { icon: BarChart3, label: "AI Reports", path: "/ai-reports" },
];

export default function Sidebar() {
  const { tokens } = useTheme();
  const { sidebarOpen, setSidebarOpen, isMobile } = useLayout();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed lg:relative z-50 h-full flex flex-col border-r transition-all duration-300 ease-in-out",
        sidebarOpen
          ? "w-64 translate-x-0"
          : "w-0 -translate-x-full lg:w-20 lg:translate-x-0",
      )}
      style={{
        backgroundColor: tokens.sidebarBg,
        borderColor: tokens.sidebarBorder,
        color: tokens.sidebarText,
      }}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <BarChart3 size={24} />
          </div>
          <span
            className={cn(
              "text-xl font-bold tracking-tight transition-opacity duration-300 whitespace-nowrap",
              !sidebarOpen && "lg:opacity-0",
            )}
            style={{ color: tokens.text }}
          >
            InquiryHub
          </span>
        </div>
        {isMobile && (
          <button
            type="button"
            title="Close Sidebar"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-opacity-10"
            style={{ color: tokens.textSec }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto overflow-x-hidden">
        <div
          className={cn(
            "mb-4 px-2 transition-opacity duration-300",
            !sidebarOpen && "lg:opacity-0",
          )}
        >
          <span
            className="text-[10px] uppercase tracking-widest font-bold opacity-50"
            style={{ color: tokens.sidebarHeading }}
          >
            Main Menu
          </span>
        </div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive ? "shadow-sm" : "hover:bg-opacity-10",
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive
                ? tokens.sidebarActiveBg
                : "transparent",
              color: isActive ? tokens.sidebarActive : tokens.sidebarText,
            })}
          >
            <item.icon
              size={20}
              className={cn(
                "transition-transform duration-200 group-hover:scale-110 shrink-0",
              )}
            />
            <span
              className={cn(
                "font-medium transition-all duration-300 whitespace-nowrap",
                !sidebarOpen && "lg:opacity-0 lg:w-0",
              )}
            >
              {item.label}
            </span>
            {!sidebarOpen && !isMobile && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className="p-4 border-t overflow-hidden"
        style={{ borderColor: tokens.sidebarBorder }}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-500/10 text-red-500 transition-colors duration-200 group relative"
        >
          <LogOut size={20} className="shrink-0" />
          <span
            className={cn(
              "font-medium transition-all duration-300 whitespace-nowrap",
              !sidebarOpen && "lg:opacity-0 lg:w-0",
            )}
          >
            Logout
          </span>
          {!sidebarOpen && !isMobile && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
