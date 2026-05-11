import { useState } from "react";

import { DashboardService } from "@/src/services/dashboard.service";
import { AuditLogUser, RecentActivityLog } from "@/src/types/dashboard";

export const useGetRecentActivityLogsByUser = () => {
  const [data, setData] = useState<{
    total: number;
    logs: AuditLogUser[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecentActivityLogsByUser = async (
    id: string,
    query: string = "",
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await DashboardService.getRecentActivityLogsByUser(
        id,
        query,
      );

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
    getRecentActivityLogsByUser,
  };
};
