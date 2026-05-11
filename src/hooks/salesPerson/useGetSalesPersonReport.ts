import { UserService } from "@/src/services/user.service";
import { useState } from "react";

export const useGetSalesPersonReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesPersonReport = async (id: string, query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.getSalesPersonReport(id, query);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getSalesPersonReport, loading, error };
};
