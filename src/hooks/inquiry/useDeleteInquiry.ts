import { InquiryService } from "@/src/services/inquiry.service";
import { useState } from "react";

export const useDeleteInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteInquiry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.deleteInquiry(id);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteInquiry, loading, error };
};
