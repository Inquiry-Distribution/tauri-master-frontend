import { mapNotificationFormToPayload } from "@/src/mappers/notification.mapper";
import { NotificationService } from "@/src/services/notification.service";
import { Notification } from "@/src/types/notification";
import { useState } from "react";

export const useCreateNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNotification = async (formValues: Notification) => {
    try {
      setLoading(true);
      setError(null);

      const payload = mapNotificationFormToPayload(formValues);

      const response = await NotificationService.sendNotification(
        payload as any,
      );

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createNotification, loading, error };
};
