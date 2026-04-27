import { Broadcast, Notification } from "../types/notification";

export const mapNotificationFormToPayload = (
  formValues: Notification | FormData,
) => {
  if (formValues instanceof FormData) {
    return {
      recipientIds: formValues.get("recipientIds"),
      title: formValues.get("title"),
      body: formValues.get("body"),
      data: formValues.get("data"),
    };
  } else {
    return {
      recipientIds: formValues.recipientIds,
      title: formValues.title,
      body: formValues.body,
      data: formValues.data,
    };
  }
};
export const mapBroadcastFormToPayload = (formValues: Broadcast | FormData) => {
  if (formValues instanceof FormData) {
    return {
      title: formValues.get("title"),
      body: formValues.get("body"),
      data: formValues.get("data"),
    };
  } else {
    return {
      title: formValues.title,
      body: formValues.body,
      data: formValues.data,
    };
  }
};
