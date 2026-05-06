import { AuthService } from "@/src/services/auth.service";
import { ResetPassword } from "@/src/types/users";
import { useState } from "react";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const id = userData.id;

  const resetPassword = async (formValues: ResetPassword) => {
    try {
      setLoading(true);
      setError(null);

      const payload = formValues;

      const response = await AuthService.setResetPassword(id, payload);

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
