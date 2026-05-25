import { useState } from "react";
import { ComplaintService } from "@/src/services/complaint.service";
import type { ReviewComplaintPayload } from "@/src/types/complaint";

export const useReviewComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewComplaint = async (id: string, payload: ReviewComplaintPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ComplaintService.review(id, payload);
      return response?.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update complaint");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reviewComplaint, loading, error };
};
