import { api } from "../api/axios";
import { ConfigLoginLimit } from "../types/config";

export const ConfigService = {
  getConfigLoginLimit: async () => {
    const { data } = await api.get("/system-config/login-limit");
    return data;
  },
  updateConfigLoginLimit: async (payload: ConfigLoginLimit) => {
    const { data } = await api.patch("/system-config/login-limit", payload);
    return data;
  },
};
