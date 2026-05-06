import { api } from "../api/axios";
import { ResetPassword } from "../types/users";

export const AuthService = {
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
  setResetPassword: async (id: string, payload: ResetPassword) => {
    const { data } = await api.patch(`/users/${id}/password`, payload);
    return data;
  },
};
