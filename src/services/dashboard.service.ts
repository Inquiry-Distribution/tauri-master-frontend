import { api } from "../api/axios";

export const DashboardService = {
  getSummary: async () => {
    const { data } = await api.get("/reports/summary");
    return data;
  },
};
