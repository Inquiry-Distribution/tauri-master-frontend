import { api } from "../api/axios";
import { Broadcast, Notification } from "../types/notification";

export const NotificationService = {
  sendNotification: async (payload: Notification) => {
    const { data } = await api.post("/notifications/send", payload, {});
    return data;
  },
  broadcastNotification: async (payload: Broadcast) => {
    const { data } = await api.post("/notifications/broadcast", payload, {});
    return data;
  },
};
