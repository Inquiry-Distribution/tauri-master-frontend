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
