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

const UpdateSalesPersonForm = ({
  salesPersonId,
  person,
  onClose,
}: {
  salesPersonId: string;
  person: SalesPerson;
  onClose: () => void;
}) => {
  const { updateUser, loading, error } = useUpdateUser();

  const [form, setForm] = useState<UpdateUser>({
    name: person.name,
    email: person.email,
    phone: person?.phone || "",
  });

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      // ✅ append files correctly
      console.log(form);

      await updateUser(salesPersonId, form);
      Swal.fire({
        icon: "success",
        title: "Sales Person Updated.",
        text: "Your sales person has been updated successfully!",
      });
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Updating Sales Person.",
        text: "Please try again later!",
      });
    }
  };
  return (
    <form>
      <div className="space-y-4 ">
        <Input
          label="Name"
          inputName="name"
          placeholder="Name"
          inputValue={form.name}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          inputName="phone"
          placeholder="9876543210"
          inputValue={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Email"
          inputName="email"
          placeholder="Email"
          inputType="email"
          inputValue={form.email}
          onChange={handleChange}
        />
        <div>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <ButtonLoader /> : "Update"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateSalesPersonForm;
