import { UserService } from "@/src/services/user.service";

import { UpdateUser } from "@/src/types/users";
import { useState } from "react";

export const useSetResetPin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPin = async (
    id: string,
    formValues: FormData | { pin: string },
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = formValues;

      const response = await UserService.setResetPin(
        id,
        payload as { pin: string },
      );

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetPin, loading, error };
};
