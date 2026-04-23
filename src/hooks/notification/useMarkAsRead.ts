import { NotificationService } from "@/src/services/notification.service";
import { useState } from "react";

export const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await NotificationService.markAsRead(id);
      return response;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to mark notification as read",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, markAsRead };
};
