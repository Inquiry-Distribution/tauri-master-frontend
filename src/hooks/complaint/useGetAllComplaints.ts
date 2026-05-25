import { useState } from "react";
import { ComplaintService } from "@/src/services/complaint.service";
import type { Complaint } from "@/src/types/complaint";

export const useGetAllComplaints = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllComplaints = async (
    query: string,
  ): Promise<{ records: Complaint[]; total: number }> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ComplaintService.getAll(query);
      return response?.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch complaints");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAllComplaints, loading, error };
};
