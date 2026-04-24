// src/hooks/useCreateInquiry.ts

import { useState } from "react";
import { InquiryService } from "@/src/services/inquiry.service";
import { mapInquiryFormToPayload } from "@/src/mappers/inquiry.mapper";
import type { EditInquiryPayload } from "@/src/types/inquiry";

export const useEditInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editInquiry = async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.editInquiry(id, formData);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editInquiry, loading, error };
};
