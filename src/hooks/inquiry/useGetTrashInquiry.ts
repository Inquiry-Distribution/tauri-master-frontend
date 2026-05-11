import { useState, useCallback } from "react";
import { InquiryService } from "@/src/services/inquiry.service";

export const useGetTrashInquiries = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrashInquiries = useCallback(async (query: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.getTrashInquiries(query);
      setData(response?.data);

      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch inquiries";

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
    getTrashInquiries,
    setData, // optional if you want manual updates
  };
};
