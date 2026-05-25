import { ConfigService } from "@/src/services/config.service";
import { ConfigAttendanceHours, ConfigLoginLimit } from "@/src/types/config";
import { useState, useCallback } from "react";

export const useGetConfigAttendanceHours = () => {
  const [data, setData] = useState<ConfigAttendanceHours | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfigAttendanceHours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ConfigService.getAttendanceHours();

      setData(response?.data); // should be number
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
    getConfigAttendanceHours,
    setData,
  };
};
