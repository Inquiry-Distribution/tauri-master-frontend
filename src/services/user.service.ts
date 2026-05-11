import { api } from "@/src/api/axios";
import {
  CreateAdmin,
  CreateUser,
  ResetPassword,
  UpdateUser,
} from "../types/users";

export const UserService = {
  createUser: async (payload: CreateUser | CreateAdmin) => {
    const { data } = await api.post("/users", payload);
    return data;
  },
  getAllSalesPerson: async () => {
    const { data } = await api.get(`/users/sales`);
    return data;
  },
  getAllAdmin: async (query: string) => {
    const { data } = await api.get(`/users/?role=admin&${query}`);
    return data;
  },
  getSalesPersonById: async (id: string) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  getSalesPersonReport: async (id: string, query: string) => {
    const { data } = await api.get(`/reports/salesperson/${id}?${query}`);
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

  resetAdminPassword: async (id: string, payload: { password: string }) => {
    const { data } = await api.patch(`/users/${id}/admin-password`, payload);
    return data;
  },

  syncUsers: async () => {
    const { data } = await api.post("/users/sync");
    return data;
  },
};
