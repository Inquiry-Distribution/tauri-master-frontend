import { useState, useCallback } from "react";
import { DeviceService } from "@/src/services/device.service";

import { LocationService } from "@/src/services/locations.service";
import { Location } from "@/src/types/locationHistory";

export const useGetAllLocations = () => {
  const [data, setData] = useState<Location[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await LocationService.getAllLocations();

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
    getLocations,
    setData,
  };
};
