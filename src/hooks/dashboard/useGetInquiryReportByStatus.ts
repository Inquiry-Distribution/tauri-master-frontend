import { useState } from "react";
import type { InquiryReportByStatus } from "@/src/types/dashboard";

import { DashboardService } from "@/src/services/dashboard.service";

export const useGetInquiryReportByStatus = () => {
  const [data, setData] = useState<InquiryReportByStatus[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInquiryReportByStatus = async (from: string, to: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await DashboardService.getInquiryReportByStatus(
        from,
        to,
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
    getInquiryReportByStatus,
  };
};
