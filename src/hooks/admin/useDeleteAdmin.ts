import { InquiryService } from "@/src/services/inquiry.service";
import { UserService } from "@/src/services/user.service";
import { useState } from "react";

export const useDeleteAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAdmin = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.deleteUser(id);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteAdmin, loading, error };
};
