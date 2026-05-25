import { api } from "../api/axios";
import { ConfigAttendanceHours, ConfigLoginLimit } from "../types/config";

export const ConfigService = {
  getConfigLoginLimit: async () => {
    const { data } = await api.get("/system-config/login-limit");
    return data;
  },
  updateConfigLoginLimit: async (payload: ConfigLoginLimit) => {
    const { data } = await api.patch("/system-config/login-limit", payload);
    return data;
  },
  getAttendanceHours: async () => {
    const { data } = await api.get("/system-config/attendance-hours");
    return data;
  },
  updateAttendanceHours: async (payload: ConfigAttendanceHours) => {
    const { data } = await api.patch(
      "/system-config/attendance-hours",
      payload,
    );
    return data;
  },
};
