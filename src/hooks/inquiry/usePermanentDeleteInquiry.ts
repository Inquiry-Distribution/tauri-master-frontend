import { InquiryService } from "@/src/services/inquiry.service";
import { useState } from "react";

export const usePermanentDeleteInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const permanentlyDeleteInquiry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.permanentlyDeleteInquiry(id);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { permanentlyDeleteInquiry, loading, error };
};
