import { AttendanceService } from "@/src/services/attendance.service";
import { useState, useCallback } from "react";
import { AttendanceResponse } from "@/src/types/attendance"; // adjust path

export const useGetAttendanceById = () => {
  const [data, setData] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAttendancePerson = useCallback(
    async (id: string, query: string): Promise<AttendanceResponse> => {
      try {
        setLoading(true);
        setError(null);

        const response = await AttendanceService.getAttendancePerson(id, query);

        setData(response?.data);

        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to fetch attendance records";

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
    getAttendancePerson,
    setData,
  };
};
