import { UserService } from "@/src/services/user.service";

import { CreateUser } from "@/src/types/users";
import { useState } from "react";

export const useCreateSalesPerson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (formValues: CreateUser) => {
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

  return { createUser, loading, error };
};
