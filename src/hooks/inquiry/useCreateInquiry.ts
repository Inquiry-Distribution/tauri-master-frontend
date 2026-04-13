// src/hooks/useCreateInquiry.ts

import { useState } from "react";
import { InquiryService } from "@/src/services/inquiry.service";
import { mapInquiryFormToPayload } from "@/src/mappers/inquiry.mapper";

export const useCreateInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInquiry = async (formValues: any) => {
    try {
      setLoading(true);
      setError(null);

      const payload = mapInquiryFormToPayload(formValues);

      const response = await InquiryService.createInquiry(payload);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createInquiry, loading, error };
};
