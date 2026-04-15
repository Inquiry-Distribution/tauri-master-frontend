import { api } from "../api/axios";

export const AttendanceService = {
  getAllAttendance: async (query: string) => {
    const { data } = await api.get(`/attendance?${query}`);
    return data;
  },
};
