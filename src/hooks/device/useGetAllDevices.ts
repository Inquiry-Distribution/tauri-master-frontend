import { useState, useCallback } from "react";

import { DeviceService } from "@/src/services/device.service";

export const useGetAllDevices = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await DeviceService.getAllDevices();
      setData(response?.data);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to fetch devices";

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
    getDevices,
    setData, // optional if you want manual updates
  };
};
