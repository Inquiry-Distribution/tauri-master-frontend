import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import TextArea from "@/src/components/ui/form/textArea";
import FullPageLoader from "@/src/components/ui/loader/fullPageLoader";
import { useCreateInquiry } from "@/src/hooks/inquiry/useCreateInquiry";
import { useUpdateUser } from "@/src/hooks/salesPerson/useUpdateUser";
import { SalesPerson, UpdateUser } from "@/src/types/users";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../button";
import ButtonLoader from "../loader/buttonLoader";
import { useSetResetPin } from "@/src/hooks/salesPerson/useSetResetPin";

const SetResetPinForm = ({
  salesPersonId,

  onClose,
}: {
  salesPersonId: string;

  onClose: () => void;
}) => {
  const { resetPin, loading, error } = useSetResetPin();

  const [form, setForm] = useState<{ pin: string }>({
    pin: "",
  });

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updated = await resetPin(salesPersonId, form);

      Swal.fire({
        icon: "success",
        title: "Pin Set Successfully.",
      });

      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Resetting Pin.",
      });
    }
  };
  return (
    <form>
      <div className="space-y-4 ">
        <Input
          label="Pin"
          inputType="password"
          inputName="pin"
          placeholder="Pin"
          inputValue={form.pin}
          showLabel={false}
          onChange={handleChange}
        />

        <div className="flex justify-center">
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <ButtonLoader /> : "Set Pin"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SetResetPinForm;
