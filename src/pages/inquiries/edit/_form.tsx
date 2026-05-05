import { Button } from "@/src/components/ui/button";
import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import Select from "@/src/components/ui/form/select";
import TextArea from "@/src/components/ui/form/textArea";
import FullPageLoader from "@/src/components/ui/loader/fullPageLoader";
import { useCreateInquiry } from "@/src/hooks/inquiry/useCreateInquiry";
import { useEditInquiry } from "@/src/hooks/inquiry/useEditInquiry";
import { Inquiry } from "@/src/types/inquiry";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SOURCE_OPTIONS } from "../create/_form";

type Props = {
  initialData?: Partial<Inquiry>;
  onClose?: () => void;
  onSuccess?: (updated: Inquiry) => void;
};

const EditInquiryForm = ({ initialData, onClose, onSuccess }: Props) => {
  const { editInquiry, loading, error } = useEditInquiry();
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

  // 👇 populate when modal opens / data changes
  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description || "",
        mobile: initialData.mobile || "",
        inquiryTime: initialData.inquiryTime || "",
        source: initialData.source || "",
        images: [], // existing images are URLs, not File objects
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("description", form.description);
      formData.append("mobile", form.mobile);
      formData.append("inquiryTime", form.inquiryTime);

      formData.append("source", form.source);

      // ✅ append files correctly
      if (form.images && form.images.length > 0) {
        form.images.forEach((file) => {
          formData.append("images", file); // important: same key "images"
        });
      }
      await editInquiry(initialData?.id || "", formData);
      if (onSuccess && initialData) {
        onSuccess({
          ...(initialData as Inquiry),
          description: form.description,
          mobile: form.mobile,
          inquiryTime: form.inquiryTime,
          source: form.source,
          // 👇 don't touch images
          images: initialData.images || [],
        });
      }
      Swal.fire({
        icon: "success",
        title: "Inquiry Updated.",
        text: "Your inquiry has been updated successfully!",
      });
      setForm({
        description: "",
        mobile: "",
        inquiryTime: "",
        source: "",
        images: [],
      });
      //   navigate("/inquiries");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Updating Inquiry.",
        text: "Please try again later!",
      });
    }
  };
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
            }}
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
        {/* <InquiryDistributor
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          form={form}
          onConfirmShare={handleSubmit}
        /> */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Update</Button>
        </div>
      </div>
      {loading && <FullPageLoader />}
    </form>
  );
};

export default EditInquiryForm;
