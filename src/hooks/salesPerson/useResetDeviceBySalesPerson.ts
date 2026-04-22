import { DeviceService } from "@/src/services/device.service";
import { UserService } from "@/src/services/user.service";

import { UpdateUser } from "@/src/types/users";
import { useState } from "react";

export const useResetDeviceBySalesPerson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetDevice = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await DeviceService.resetDeviceBySalesPerson(id);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetDevice, loading, error };
};
