import { api } from "../api/axios";

export const AttendanceService = {
  getAllAttendance: async (query: string) => {
    const { data } = await api.get(`/attendance?${query}`);
    return data;
  },
  getAttendancePerson: async (id: string) => {
    const { data } = await api.get(`/attendance/salesperson/${id}`);
    return data;
  },
};
