import { useState } from "react";

import { DashboardService } from "@/src/services/dashboard.service";
import { RecentActivityLog } from "@/src/types/dashboard";

export const useGetRecentActivityLogs = () => {
  const [data, setData] = useState<{
    total: number;
    logs: RecentActivityLog[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecentActivityLogs = async (query: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await DashboardService.getRecentActivityLogs(query);

      setData(response.data);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getRecentActivityLogs,
  };
};
