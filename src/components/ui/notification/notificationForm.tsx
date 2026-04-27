import { useCreateNotification } from "@/src/hooks/notification/useSendNotification";
import { useState } from "react";
import { Modal } from "../modal";
import Input from "../form/input";
import TextArea from "../form/textArea";
import { Button } from "../button";
import ButtonLoader from "../loader/buttonLoader";
import Swal from "sweetalert2";

type Props = {
  recipientIds: string[] | string; // can be single userId or array of userIds
  onClose: () => void;
};

export const NotificationForm = ({ recipientIds, onClose }: Props) => {
  const { createNotification, loading, error } = useCreateNotification();

  const [form, setForm] = useState({
    title: "",
    body: "",
    data: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Sending notification to:", recipientIds);
      await createNotification({
        recipientIds: Array.isArray(recipientIds)
          ? recipientIds
          : [recipientIds], // wrap single userId in array
        title: form.title,
        body: form.body,
        data: form.data,
      });
      Swal.fire({
        icon: "success",
        title: "Notification sent successfully",
      });
      onClose();
    } catch (err) {
      console.error("Error sending notification:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to send notification",
        text: error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form>
      <div className="space-y-4">
        <Input
          inputName="title"
          label="Title"
          placeholder="Enter notification title"
          inputValue={form.title}
          onChange={handleChange}
          required
        />

        <TextArea
          inputName="body"
          label="Message"
          placeholder="Enter notification message"
          inputValue={form.body}
          onChange={handleChange}
          rows={4}
          required
        />

        <TextArea
          inputName="data"
          label="Extra Data (JSON / string)"
          placeholder='e.g. {"type":"inquiry"}'
          inputValue={form.data}
          onChange={handleChange}
          rows={3}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
};
