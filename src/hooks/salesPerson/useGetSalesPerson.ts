import { UserService } from "@/src/services/user.service";
import { useState } from "react";

export const useGetSalesPersonById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesPersonById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.getSalesPersonById(id);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getSalesPersonById, loading, error };
};
