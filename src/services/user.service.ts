import { api } from "@/src/api/axios";
import { UpdateUser } from "../types/users";

export const UserService = {
  getAllSalesPerson: async () => {
    const { data } = await api.get("/users/sales");
    return data;
  },
  getAllSalesPerson1: async () => {
    const { data } = await api.get("/reports/salespersons");
    return data;
  },

  updateUser: async (id: string, payload: UpdateUser) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },
  toggleActiveStatus: async (id: any) => {
    const { data } = await api.patch(`/users/${id}/toggle-status`);
    return data;
  },
  setResetPin: async (id: any, payload: { pin: string }) => {
    const { data } = await api.patch(`/users/${id}/pin`, payload);
    return data;
  },
};
