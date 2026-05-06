import { InquiryService } from "@/src/services/inquiry.service";
import { useState } from "react";

export const useBulkDeleteInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkDeleteInquiry = async (payload: { ids: string[] }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.bulkDeleteInquiry(payload);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { bulkDeleteInquiry, loading, error };
};
