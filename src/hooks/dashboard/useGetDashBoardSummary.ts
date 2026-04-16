import { useState } from "react";
import type { DashboardSummaryStat } from "@/src/types/dashboard";

import { DashboardService } from "@/src/services/dashboard.service";

export const useGetDashboardSummary = () => {
  const [data, setData] = useState<DashboardSummaryStat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboardSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await DashboardService.getSummary();

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
    getDashboardSummary,
  };
};
