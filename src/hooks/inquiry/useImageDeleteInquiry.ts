import { InquiryService } from "@/src/services/inquiry.service";
import { useState } from "react";

export const useImageDeleteInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteImageInquiry = async (id: string, imageId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await InquiryService.imageDeleteInquiry(id, imageId);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteImageInquiry, loading, error };
};
