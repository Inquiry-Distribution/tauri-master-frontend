import { useState, useCallback } from "react";
import { DeviceService } from "@/src/services/device.service";

import { LocationService } from "@/src/services/locations.service";
import { Location, LocationHistory } from "@/src/types/locationHistory";

export const useGetLocationHistoryBySalesPerson = () => {
  const [data, setData] = useState<LocationHistory[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationHistoryBySalesPerson = useCallback(
    async (id: string, query: string) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await LocationService.getLocationHistoryBySalesPersonId(id, query);

        setData(response?.data); // should be DeviceLocation[]
        return response;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to fetch devices";

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
    getLocationHistoryBySalesPerson,
    setData,
  };
};
