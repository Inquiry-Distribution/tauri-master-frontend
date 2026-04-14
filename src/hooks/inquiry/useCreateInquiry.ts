// src/hooks/useCreateInquiry.ts

import { useState } from "react";
import { InquiryService } from "@/src/services/inquiry.service";
import { mapInquiryFormToPayload } from "@/src/mappers/inquiry.mapper";

// export const useCreateInquiry = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const createInquiry = async (formValues: FormData | JSON) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const payload = mapInquiryFormToPayload(formValues as FormData);

//       const response = await InquiryService.createInquiry(payload);

//       return response;
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Something went wrong");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { createInquiry, loading, error };
// };

export const useCreateInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInquiry = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.createInquiry(formData);

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
