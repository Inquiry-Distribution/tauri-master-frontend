import { api } from "../api/axios";
import { Broadcast, Notification } from "../types/notification";

export const NotificationService = {
  getMyNotifications: async () => {
    const { data } = await api.get("/notifications");
    return data;
  },
  markAsRead: async (id: string) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },
  markAllAsRead: async () => {
    const { data } = await api.patch(`/notifications/read-all`);
    return data;
  },
  sendNotification: async (payload: Notification) => {
    const { data } = await api.post("/notifications/send", payload, {});
    return data;
  },
  broadcastNotification: async (payload: Broadcast) => {
    const { data } = await api.post("/notifications/broadcast", payload, {});
    return data;
  },
};
