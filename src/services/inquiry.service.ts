// src/services/inquiry.service.ts

import { api } from "@/src/api/axios";
import type { CreateInquiryPayload } from "@/src/types/inquiry";

export const InquiryService = {
  createInquiry: async (payload: CreateInquiryPayload) => {
    const { data } = await api.post("/inquiries", payload);
    return data;
  },
};
