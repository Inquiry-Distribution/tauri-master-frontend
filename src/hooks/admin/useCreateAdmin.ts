import { UserService } from "@/src/services/user.service";

import { CreateAdmin, CreateUser } from "@/src/types/users";
import { useState } from "react";

export const useCreateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdmin = async (formValues: CreateAdmin) => {
    try {
      setLoading(true);
      setError(null);

      const payload = formValues;

      const response = await UserService.createUser(payload);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAdmin, loading, error };
};
