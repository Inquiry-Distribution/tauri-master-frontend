// src/hooks/useCreateInquiry.ts

import { useState } from "react";
import { InquiryService } from "@/src/services/inquiry.service";
import { mapInquiryFormToPayload } from "@/src/mappers/inquiry.mapper";

export const useCreateShareInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShareInquiry = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.createShareInquiry(formData);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createShareInquiry, loading, error };
};
