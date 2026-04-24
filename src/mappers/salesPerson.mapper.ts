import { SalesPerson } from "../types/users";

export const formatSalesPerson = (data: SalesPerson[]) => {
  return data.map((sp) => ({
    id: sp.id.slice(0, 8).toUpperCase(),
    name: sp.name,
    email: sp.email,
    phone: sp.phone || "",
    employeeId: sp.employeeId || "",
    area: sp.assignedArea || "",
    active: sp.isActive ? "Active" : "Inactive",

    totalInquiries: sp.inquiries?.total || 0,
    assigned: sp.inquiries?.assigned || 0,
    inProgress: sp.inquiries?.inProgress || 0,
    closed: sp.inquiries?.closed || 0,
    conversionRate: parseFloat(sp.inquiries?.conversionRate || "0"),

    present: sp.attendance?.present || 0,
    absent: sp.attendance?.absent || 0,
    halfDay: sp.attendance?.halfDay || 0,
    totalDays: sp.attendance?.totalDays || 0,

    attendanceScore: sp.attendance?.totalDays
      ? Math.round((sp.attendance.present / sp.attendance.totalDays) * 100)
      : 0,
  }));
};
