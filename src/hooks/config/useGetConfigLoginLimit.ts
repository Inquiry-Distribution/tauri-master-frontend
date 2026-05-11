import { ConfigService } from "@/src/services/config.service";
import { ConfigLoginLimit } from "@/src/types/config";
import { useState, useCallback } from "react";

export const useGetConfigLoginLimit = () => {
  const [data, setData] = useState<ConfigLoginLimit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfigLoginLimit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ConfigService.getConfigLoginLimit();

      setData(response?.data); // should be Config
      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to fetch config";

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
    getConfigLoginLimit,
    setData,
  };
};
