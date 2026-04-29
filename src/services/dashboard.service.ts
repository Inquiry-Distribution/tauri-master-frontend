import { api } from "../api/axios";

export const DashboardService = {
  getSummary: async () => {
    const { data } = await api.get("/reports/summary");
    return data;
  },
  getInquiryReportByStatus: async (from: string, to: string) => {
    const { data } = await api.get(`/reports/inquiries?from=${from}&to=${to}`);
    return data;
  },
  getRecentActivityLogs: async (query: string) => {
    const { data } = await api.get(`/audit?${query}`);
    return data;
  },
};
