import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";
import FileInput from "@/src/components/ui/form/fileUpload";
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
        <InquiryDistributor />
      </div>
    </form>
  );
};

export default InquiryForm;
