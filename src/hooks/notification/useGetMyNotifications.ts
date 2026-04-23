import { useState } from "react";
import type { NotificationContextType } from "@/src/types/notification";
import { NotificationService } from "@/src/services/notification.service";

export const useGetMyNotifications = () => {
  const [data, setData] = useState<NotificationContextType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMyNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await NotificationService.getMyNotifications();

      // API shape: { success, message, data: [...] }
      setData(response.data);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch notifications");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getMyNotifications,
  };
};
