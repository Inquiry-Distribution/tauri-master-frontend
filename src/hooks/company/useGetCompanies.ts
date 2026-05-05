import { CompanyService } from "@/src/services/company.service";
import { Company } from "@/src/types/company";
import { useCallback, useState } from "react";

export const useGetCompanies = () => {
  const [data, setData] = useState<Company[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await CompanyService.getCompanies();

      setData(response?.data); // should be Company
      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch companies";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    getCompanies,
    setData,
  };
};
