import { UserService } from "@/src/services/user.service";

import { UpdateUser } from "@/src/types/users";
import { useState } from "react";

export const useToggleActiveStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleActiveStatus = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.toggleActiveStatus(id);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { toggleActiveStatus, loading, error };
};
