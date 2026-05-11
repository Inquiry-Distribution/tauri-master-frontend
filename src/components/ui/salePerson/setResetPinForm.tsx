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
  const { resetPin, loading } = useSetResetPin();

  const [form, setForm] = useState({
    pin: "",
    confirmPin: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // clear error on typing
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.pin) {
      newErrors.pin = "PIN is required";
    } else if (!/^\d+$/.test(form.pin)) {
      newErrors.pin = "PIN must be numeric";
    } else if (form.pin.length < 4) {
      newErrors.pin = "PIN must be at least 4 digits";
    }

    if (!form.confirmPin) {
      newErrors.confirmPin = "Confirm PIN is required";
    } else if (form.pin !== form.confirmPin) {
      newErrors.confirmPin = "PINs do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await resetPin(salesPersonId, { pin: form.pin });

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
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Pin"
          inputType="password"
          inputName="pin"
          placeholder="Enter PIN"
          inputValue={form.pin}
          onChange={handleChange}
          error={errors.pin}
          showLabel={false}
        />

        <Input
          label="Confirm Pin"
          inputType="password"
          inputName="confirmPin"
          placeholder="Confirm PIN"
          inputValue={form.confirmPin}
          onChange={handleChange}
          error={errors.confirmPin}
          showLabel={false}
        />

        <div className="flex justify-center">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <ButtonLoader /> : "Set Pin"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SetResetPinForm;
