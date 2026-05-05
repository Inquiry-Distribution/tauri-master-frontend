import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import Select from "@/src/components/ui/form/select";
import TextArea from "@/src/components/ui/form/textArea";
import FullPageLoader from "@/src/components/ui/loader/fullPageLoader";
import { useCreateInquiry } from "@/src/hooks/inquiry/useCreateInquiry";
import { useCreateShareInquiry } from "@/src/hooks/inquiry/useCreateShareInquiry";
import { getCurrentTime } from "@/src/utils/utils";
import React, { useEffect, useState } from "react";
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
  const {
    createInquiry,
    loading: inquiryLoading,
    error: inquiryError,
  } = useCreateInquiry();
  const {
    createShareInquiry,
    loading: shareLoading,
    error: shareError,
  } = useCreateShareInquiry();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    inquiryTime: getCurrentTime(),
    source: "",
    // salesPersonId: "",
    images: [],
  });

  const [errors, setErrors] = useState<{
    description?: string;
    source?: string;
    images?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!form.images || form.images.length === 0) {
      newErrors.images = "Please upload at least one image.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Minimum 10 characters required.";
    }

    if (!form.source) {
      newErrors.source = "Please select a source.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
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
  const handleSubmit = async (salesPersonIdFromDistributor: string | null) => {
    // e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();

      formData.append("description", form.description);
      formData.append("mobile", form.mobile);
      formData.append("inquiryTime", form.inquiryTime);
      if (salesPersonIdFromDistributor) {
        formData.append("salesPersonId", salesPersonIdFromDistributor);
      }
      formData.append("source", form.source);

      // ✅ append files correctly
      if (form.images && form.images.length > 0) {
        form.images.forEach((file) => {
          formData.append("images", file); // important: same key "images"
        });
      }
      if (salesPersonIdFromDistributor) {
        console.log("share");
        await createShareInquiry(formData);
      } else {
        console.log("create");
        await createInquiry(formData);
      }
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

  useEffect(() => {
    setLoading(inquiryLoading || shareLoading);
  }, [inquiryLoading, shareLoading]);
  useEffect(() => {
    setError(inquiryError ? inquiryError : shareError ? shareError : null);
  }, [inquiryError, shareError]);
  return (
    <form encType="multipart/form-data">
      <div className="space-y-4 ">
        <FileInput
          maxSizeMB={25}
          limit={10}
          accept=".jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc,.ppt,.pptx,.mp4,.mkv"
          label="Upload Inquiry"
          inputName="images"
          onChange={(files) => setForm((prev) => ({ ...prev, images: files }))}
          error={errors.images}
        />
        <TextArea
          label="Inquiry Description"
          inputName="description"
          placeholder="Description"
          inputValue={form.description}
          onChange={handleChange}
          error={errors.description}
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
            onChange={(opt) => {
              setForm((prev) => ({
                ...prev,
                source: opt.value as string,
              }));
              setErrors((prev) => ({
                ...prev,
                source: "",
              }));
            }}
            error={errors.source}
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
