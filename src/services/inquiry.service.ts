// src/services/inquiry.service.ts

import { api } from "@/src/api/axios";
import type { CreateInquiryPayload } from "@/src/types/inquiry";

export const InquiryService = {
  createInquiry: async (payload: FormData) => {
    const { data } = await api.post("/inquiries/share", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
