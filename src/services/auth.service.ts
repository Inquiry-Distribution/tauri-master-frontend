import { api } from "../api/axios";

export const AuthService = {
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
};
