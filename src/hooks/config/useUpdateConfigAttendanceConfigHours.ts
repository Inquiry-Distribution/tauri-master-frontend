import { ConfigService } from "@/src/services/config.service";
import { ConfigAttendanceHours, ConfigLoginLimit } from "@/src/types/config";
import { useState, useCallback } from "react";

export const useUpdateConfigAttendanceHours = () => {
  const [data, setData] = useState<ConfigAttendanceHours | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConfigAttendanceHours = useCallback(
    async (payload: ConfigAttendanceHours) => {
      try {
        setLoading(true);
        setError(null);

        const response = await ConfigService.updateAttendanceHours(payload);

        setData(response?.data); // should be ConfigAttendanceHours
        return response;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          "Failed to update config attendance hours";

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
    updateConfigAttendanceHours,
    setData,
  };
};
