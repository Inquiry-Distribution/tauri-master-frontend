import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Smartphone, BarChart3, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts';
import { cn } from '../../utils/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Inquiries', path: '/inquiries' },
  { icon: Users, label: 'Sales Persons', path: '/sales-persons' },
  { icon: Smartphone, label: 'Devices', path: '/devices' },
  { icon: BarChart3, label: 'AI Reports', path: '/ai-reports' },
];

export default function Sidebar() {
  const { tokens } = useTheme();

  return (
    <aside 
      className="w-64 flex flex-col border-r transition-colors duration-200"
      style={{ 
        backgroundColor: tokens.sidebarBg, 
        borderColor: tokens.sidebarBorder,
        color: tokens.sidebarText 
      }}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <BarChart3 size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ color: tokens.text }}>
          InquiryHub
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <div className="mb-4 px-2">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-50" style={{ color: tokens.sidebarHeading }}>
            Main Menu
          </span>
        </div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
              isActive ? "shadow-sm" : "hover:bg-opacity-10"
            )}
            style={({ isActive }) => ({
              backgroundColor: isActive ? tokens.sidebarActiveBg : 'transparent',
              color: isActive ? tokens.sidebarActive : tokens.sidebarText,
            })}
          >
            <item.icon size={20} className={cn("transition-transform duration-200 group-hover:scale-110")} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: tokens.sidebarBorder }}>
        <button 
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-500/10 text-red-500 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
