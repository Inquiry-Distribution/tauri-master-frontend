export type DashboardSummaryStat = {
  totalInquiries: number;
  unassigned: number;
  inProgress: number;
  closed: number;
  totalSales: number;
  totalDevices: number;
  blockedDevices: number;
};

export type InquiryReportByStatus = {
  _count: {
    id: number;
  };
  status: string;
};

// export type RecentActivityLog = {
//   id: string;
//   action: string;
//   performedById: string;
//   targetId: string;
//   targetModel: string;
//   meta: {
//     role: string;
//   };
//   ipAddress: string | null;
//   createdAt: string;
//   performedBy: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
// };

export type RecentActivityLog = {
  id: string;
  action: string;

  performedById: string | null;

  targetId: string;
  targetModel: string;

  meta: Record<string, any> | null;

  ipAddress: string | null;

  createdAt: string;

  performedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

export type AuditLogUser = {
  id: string;
  action: string;
  performedById: string;
  targetId: string;
  targetModel: string;
  meta: {
    role: string;
  };
  ipAddress: string | null;
  createdAt: string;
};
