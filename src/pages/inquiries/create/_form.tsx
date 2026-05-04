import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import Select from "@/src/components/ui/form/select";
import TextArea from "@/src/components/ui/form/textArea";
import FullPageLoader from "@/src/components/ui/loader/fullPageLoader";
import { useCreateInquiry } from "@/src/hooks/inquiry/useCreateInquiry";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const SOURCE_OPTIONS = [
  { label: "Walk-in", value: "Walk-in" },
  { label: "Phone Call", value: "Phone Call" },
  { label: "Email", value: "Email" },
  { label: "Referral", value: "Referral" },
  { label: "Social Media", value: "Social Media" },
  { label: "Website", value: "Website" },
  { label: "Whatsapp", value: "Whatsapp" },
  { label: "Other", value: "Other" },
];

const InquiryForm = () => {
  const { createInquiry, loading, error } = useCreateInquiry();
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    description: string;
    mobile: string;
    inquiryTime: string;
    source: string;
    // salesPersonId: string;
    images: File[];
  }>({
    description: "",
    mobile: "",
    inquiryTime: "",
    source: "",
    // salesPersonId: "",
    images: [],
  });

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const formData = new FormData(e.currentTarget);

  //   await createInquiry({
  //     description: formData.get("description"),
  //     mobile: formData.get("mobile"),
  //     inquiryTime: formData.get("inquiryTime"),
  //     images: formData.getAll("images") as File[],
  //   });
  // };
  const handleSubmit = async (salesPersonIdFromDistributor: string) => {
    // e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("description", form.description);
      formData.append("mobile", form.mobile);
      formData.append("inquiryTime", form.inquiryTime);
      formData.append("salesPersonId", salesPersonIdFromDistributor);
      formData.append("source", form.source);

      // ✅ append files correctly
      if (form.images && form.images.length > 0) {
        form.images.forEach((file) => {
          formData.append("images", file); // important: same key "images"
        });
      }
      await createInquiry(formData);
      Swal.fire({
        icon: "success",
        title: "Inquiry Created.",
        text: "Your inquiry has been created and shared successfully!",
      });
      setForm({
        description: "",
        mobile: "",
        inquiryTime: "",
        source: "",
        images: [],
      });
      navigate("/inquiries");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Creating Inquiry.",
        text: "Please try again later!",
      });
    }
  };
  return (
    <form encType="multipart/form-data">
      <div className="space-y-4 ">
        <FileInput
          maxSizeMB={5}
          limit={10}
          label="Upload Inquiry"
          inputName="images"
          onChange={(files) => setForm((prev) => ({ ...prev, images: files }))}
        />
        <TextArea
          label="Inquiry Description"
          inputName="description"
          placeholder="Description"
          inputValue={form.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-3  gap-4">
          <Input
            label="Mobile"
            inputName="mobile"
            placeholder="9876543210"
            inputValue={form.mobile}
            onChange={handleChange}
          />
          {/* <Input
            label="Source"
            inputName="source"
            placeholder="Enter Source..."
            inputValue={form.source}
            onChange={handleChange}
          /> */}
          <Select
            label="Source"
            options={SOURCE_OPTIONS}
            selectName="source"
            placeholder="Enter Source..."
            value={form.source}
            onChange={(opt) =>
              setForm((prev) => ({
                ...prev,
                source: opt.value as string,
              }))
            }
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
          onConfirmShare={handleSubmit}
        />
      </div>
      {loading && <FullPageLoader />}
    </form>
  );
};

export default InquiryForm;
