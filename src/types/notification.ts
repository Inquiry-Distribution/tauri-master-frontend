export type Notification = {
  recipientIds: string[];
  title: string;
  body: string;
  data: any;
};
export type Broadcast = {
  title: string;
  body: string;
  data: any;
};
export type NotificationContextType = {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export interface UINotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "danger";
}
