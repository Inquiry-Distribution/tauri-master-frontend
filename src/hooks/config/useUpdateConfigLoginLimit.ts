import { ConfigService } from "@/src/services/config.service";
import { ConfigLoginLimit } from "@/src/types/config";
import { useState, useCallback } from "react";

export const useUpdateConfigLoginLimit = () => {
  const [data, setData] = useState<ConfigLoginLimit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConfigLoginLimit = useCallback(
    async (payload: ConfigLoginLimit) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ConfigService.updateConfigLoginLimit(payload);

        setData(response?.data); // should be ConfigLoginLimit
        return response;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to update config login limit";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    data,
    loading,
    error,
    updateConfigLoginLimit,
    setData,
  };
};
