import { NotificationService } from "@/src/services/notification.service";
import { useState } from "react";

export const useMarkAllAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await NotificationService.markAllAsRead();
      return response;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to mark all notifications as read",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, markAllAsRead };
};
