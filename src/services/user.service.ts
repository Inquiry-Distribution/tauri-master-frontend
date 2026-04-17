import { api } from "@/src/api/axios";

export const UserService = {
  getAllSalesPerson: async () => {
    const { data } = await api.get("/users/sales");
    return data;
  },
  getAllSalesPerson1: async () => {
    const { data } = await api.get("/reports/salespersons");
    return data;
  },
};
