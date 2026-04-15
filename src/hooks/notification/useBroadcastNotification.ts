import { mapBroadcastFormToPayload } from "@/src/mappers/notification.mapper";
import { NotificationService } from "@/src/services/notification.service";
import { Broadcast } from "@/src/types/notification";
import { useState } from "react";

export const useBroadcastNotificationService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const broadcastNotification = async (formValues: FormData | Broadcast) => {
    try {
      setLoading(true);
      setError(null);

      const payload = mapBroadcastFormToPayload(formValues as any);

      const response = await NotificationService.broadcastNotification(
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

  return { broadcastNotification, loading, error };
};
