import { InquiryService } from "@/src/services/inquiry.service";
import { useState } from "react";

export const useReassignInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reassignInquiry = async (
    id: string,
    payload: { salesPersonId: string },
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.reassignInquiry(id, payload);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reassignInquiry, loading, error };
};
