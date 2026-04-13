import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
import Input from "@/src/components/ui/form/input";
import TextArea from "@/src/components/ui/form/textArea";
import React from "react";

const InquiryForm = () => {
  return (
    <form>
      <div className="space-y-4 ">
        <FileInput label="Upload Inquiry" inputName="inquiry" />
        <TextArea
          label="Inquiry Description"
          inputName="inquirydescription"
          placeholder="Description"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Mobile" inputName="mobile" placeholder="9876543210" />
          <Input
            label="Time"
            inputName="time"
            placeholder="10:00 AM"
            inputType="time"
          />
        </div>
        <InquiryDistributor />
      </div>
    </form>
  );
};

export default InquiryForm;
