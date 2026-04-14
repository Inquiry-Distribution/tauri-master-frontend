import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import TextArea from "@/src/components/ui/form/textArea";
import { useCreateInquiry } from "@/src/hooks/inquiry/useCreateInquiry";
import React, { useState } from "react";

const InquiryForm = () => {
  const { createInquiry, loading, error } = useCreateInquiry();
  const [form, setForm] = useState({
    description: "",
    mobile: "",
    inquiryTime: "",
    salesPersonId: "",
  });

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await createInquiry({
      description: formData.get("description"),
      mobile: formData.get("mobile"),
      inquiryTime: formData.get("inquiryTime"),
    });
  };
  return (
    <form>
      <div className="space-y-4 ">
        <FileInput label="Upload Inquiry" inputName="inquiry" />
        <TextArea
          label="Inquiry Description"
          inputName="description"
          placeholder="Description"
          inputValue={form.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Mobile"
            inputName="mobile"
            placeholder="9876543210"
            inputValue={form.mobile}
            onChange={handleChange}
          />
          <Input
            label="Time"
            inputName="inquiryTime"
            placeholder="10:00 AM"
            inputType="time"
            inputValue={form.inquiryTime}
            onChange={handleChange}
          />
        </div>
        <InquiryDistributor
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          form={form}
          createInquiry={createInquiry}
        />
      </div>
    </form>
  );
};

export default InquiryForm;
