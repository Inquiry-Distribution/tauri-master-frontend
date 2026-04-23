import { useState, useCallback } from "react";

import { DeviceService } from "@/src/services/device.service";

export const useUnblockDevice = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unblockDevice = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await DeviceService.unblockDevice(id);
      setData(response?.data);

      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to unblock device";

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
    unblockDevice,
    setData, // optional if you want manual updates
  };
};
