import { Button } from "@/src/components/ui/button";
import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import Select from "@/src/components/ui/form/select";
import TextArea from "@/src/components/ui/form/textArea";
import FullPageLoader from "@/src/components/ui/loader/fullPageLoader";
import { useCreateInquiry } from "@/src/hooks/inquiry/useCreateInquiry";
import { useEditInquiry } from "@/src/hooks/inquiry/useEditInquiry";
import { EditInquiryPayload, Inquiry } from "@/src/types/inquiry";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SOURCE_OPTIONS } from "../create/_form";
import { RichTextEditor } from "@/src/components/ui/form/richTextEditor";
import { useAddImagesInquiry } from "@/src/hooks/inquiry/useAddImagesInquiry";

type Props = {
  initialData?: Partial<Inquiry>;
  onClose?: () => void;
  onSuccess?: (updated: Inquiry) => void;
};

const EditInquiryForm = ({ initialData, onClose, onSuccess }: Props) => {
  const { editInquiry, loading, error } = useEditInquiry();
  const {
    addImagesInquiry,
    loading: addImagesLoading,
    error: addImagesError,
  } = useAddImagesInquiry();
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    mobile: string;
    inquiryTime: string;
    source: string;
    // salesPersonId: string;
    images: File[];
  }>({
    title: "",
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
        title: initialData.title || "",
        description: initialData.description || "",
        mobile: initialData.mobile || "",
        inquiryTime: initialData.inquiryTime || "",
        source: initialData.source || "Other",
        images: [], // existing images are URLs, not File objects
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState<{
    title?: string;
    mobile?: string;
  }>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // clear both cross-field errors once either title or mobile is filled
      if (name === "title" || name === "mobile") {
        if (updated.title?.trim() || updated.mobile?.trim()) {
          setErrors((prev) => ({ ...prev, title: "", mobile: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!form.title?.trim() && !form.mobile?.trim()) {
      newErrors.title = "At least one of Title or Mobile is required.";
      newErrors.mobile = "At least one of Title or Mobile is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    // e.preventDefault();
    try {
      const imagesFormData = new FormData();

      const payload: EditInquiryPayload = {
        title: form.title || undefined,
        description: form.description,
        mobile: form.mobile,
        inquiryTime: form.inquiryTime,
        source: form.source,
      };

      // ✅ append files correctly
      if (form.images && form.images.length > 0) {
        form.images.forEach((file) => {
          imagesFormData.append("images", file); // important: same key "images"
        });
      }
      await Promise.all([
        editInquiry(initialData?.id || "", payload),
        form.images.length > 0 &&
          addImagesInquiry(initialData?.id || "", imagesFormData),
      ]);
      // await editInquiry(initialData?.id || "", formData);
      if (onSuccess && initialData) {
        onSuccess({
          ...(initialData as Inquiry),
          title: form.title || null,
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
        title: "",
        description: "",
        mobile: "",
        inquiryTime: "",
        source: "",
        images: [],
      });
      //   navigate("/inquiries");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error Updating Inquiry.",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };
  return (
    <form encType="multipart/form-data">
      <div className="space-y-4 ">
        <Input
          label="Title"
          inputName="title"
          placeholder="Enter inquiry title"
          inputValue={form.title}
          onChange={handleChange}
          error={errors.title}
        />
        <FileInput
          maxSizeMB={25}
          limit={10}
          accept=".jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc,.ppt,.pptx,.mp4,.mkv"
          label="Upload Inquiry"
          inputName="images"
          onChange={(files) => setForm((prev) => ({ ...prev, images: files }))}
        />
        <RichTextEditor
          label="Inquiry Description"
          inputName="description"
          placeholder="Enter inquiry description..."
          value={form.description}
          onChange={(content) => {
            setForm((prev) => ({
              ...prev,
              description: content,
            }));
          }}
          height={220}
        />
        <div className="grid grid-cols-3  gap-4">
          <Input
            label="Mobile"
            inputName="mobile"
            placeholder="9876543210"
            inputValue={form.mobile}
            onChange={handleChange}
            error={errors.mobile}
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
