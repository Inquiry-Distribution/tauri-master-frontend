import { AttendanceService } from "@/src/services/attendance.service";
import { useState, useCallback } from "react";

export const useGetAttendanceById = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAttendancePerson = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AttendanceService.getAttendancePerson(id);

      setData(response?.data);

      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch attendance records";

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
    getAttendancePerson,
    setData, // optional if you want manual updates
  };
};
