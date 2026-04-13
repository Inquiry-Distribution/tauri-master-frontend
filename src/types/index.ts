export type InquiryStatus =
  | "unassigned"
  | "assigned"
  | "in-progress"
  | "closed";

export interface Inquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  source: string;
  status: InquiryStatus;
  assignedTo?: string; // SalesPerson ID
  createdAt: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "blocked";
  performance: number; // 0-100
  totalInquiries: number;
  closedInquiries: number;
  avatar: string;
  lastLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
}

export interface Device {
  id: string;
  salesPersonId: string;
  deviceName: string;
  os: string;
  lastSeen: string;
  status: "active" | "blocked";
  location: {
    lat: number;
    lng: number;
  };
}

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  text: string;
  textOpp: string;
  textSec: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentText: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarActive: string;
  sidebarActiveBg: string;
  chartGrid: string;
  tooltipBg: string;
  sidebarBorder: string;
  sidebarHeading: string;
  sidebarHover: string;
}
