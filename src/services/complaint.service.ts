import { api } from "@/src/api/axios";
import type { ReviewComplaintPayload } from "@/src/types/complaint";

export const ComplaintService = {
  getAll: async (query: string) => {
    const { data } = await api.get(`/complaints?${query}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/complaints/${id}`);
    return data;
  },

  review: async (id: string, payload: ReviewComplaintPayload) => {
    const { data } = await api.patch(`/complaints/${id}/review`, payload);
    return data;
  },
};
