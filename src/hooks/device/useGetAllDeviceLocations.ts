import { useState, useCallback } from "react";
import { DeviceService } from "@/src/services/device.service";
import type { DeviceLocation } from "@/src/types/devices";

export const useGetAllDevicesLocations = () => {
  const [data, setData] = useState<DeviceLocation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDeviceLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await DeviceService.getAllDevicesLocations();

      setData(response?.data); // should be DeviceLocation[]
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
    getDeviceLocations,
    setData,
  };
};
