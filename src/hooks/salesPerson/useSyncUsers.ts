import { UserService } from "@/src/services/user.service";

import { useState } from "react";

export const useSyncUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.syncUsers();

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { syncUsers, loading, error };
};
