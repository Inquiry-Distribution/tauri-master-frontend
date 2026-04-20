import { UserService } from "@/src/services/user.service";

import { UpdateUser } from "@/src/types/users";
import { useState } from "react";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: string, formValues: FormData | UpdateUser) => {
    try {
      setLoading(true);
      setError(null);

      const payload = formValues;

      const response = await UserService.updateUser(id, payload as UpdateUser);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};
