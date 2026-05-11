import { AuthService } from "@/src/services/auth.service";
import { UserService } from "@/src/services/user.service";

import { useState } from "react";

export const useChangeAdminPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (
    id: string,
    formValues: { password: string },
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = formValues;

      const response = await UserService.resetAdminPassword(id, payload);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
};
