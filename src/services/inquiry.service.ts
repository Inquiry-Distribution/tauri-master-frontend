// src/services/inquiry.service.ts

import { api } from "@/src/api/axios";
import type {
  CreateInquiryPayload,
  EditInquiryPayload,
} from "@/src/types/inquiry";

export const InquiryService = {
  getInquiries: async (query: string) => {
    const { data } = await api.get(`/inquiries?${query}`);
    return data;
  },

  getInquiryById: async (id: string) => {
    const { data } = await api.get(`/inquiries/${id}`);
    return data;
  },
  createInquiry: async (payload: FormData) => {
    const { data } = await api.post("/inquiries/share", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  editInquiry: async (id: string, payload: FormData) => {
    const { data } = await api.patch(`/inquiries/${id}`, payload);
    return data;
  },
  reassignInquiry: async (id: string, payload: { salesPersonId: string }) => {
    const { data } = await api.post(`/inquiries/${id}/reassign`, payload);
    return data;
  },
  deleteInquiry: async (id: string) => {
    const { data } = await api.delete(`/inquiries/${id}`);
    return data;
  },
};
