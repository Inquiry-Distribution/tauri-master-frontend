import { api } from "@/src/api/axios";
import type { HolidayPayload } from "@/src/types/holiday";

export const HolidayService = {
  getAll: async (params?: {
    year?: number | string;
    activeOnly?: boolean;
  }) => {
    const { data } = await api.get("/holidays", { params });
    return data;
  },

  create: async (payload: HolidayPayload) => {
    const { data } = await api.post("/holidays", payload);
    return data;
  },

  update: async (id: string, payload: Partial<HolidayPayload>) => {
    const { data } = await api.patch(`/holidays/${id}`, payload);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete(`/holidays/${id}`);
    return data;
  },
};
