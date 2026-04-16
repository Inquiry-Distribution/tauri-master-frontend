import { useState, useCallback } from "react";
import { InquiryService } from "@/src/services/inquiry.service";

export const useGetInquiryById = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInquiryById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.getInquiryById(id);

      // API shape: { success, message, data: {...inquiry} }
      setData(response?.data);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to fetch inquiry";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    getInquiryById,
    setData, // optional manual override
  };
};
