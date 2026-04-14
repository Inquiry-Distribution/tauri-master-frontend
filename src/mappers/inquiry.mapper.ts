// src/mappers/inquiry.mapper.ts

export const mapInquiryFormToPayload = (formValues: FormData) => {
  return {
    description: formValues.get("description"),
    mobile: formValues.get("mobile"),
    inquiryTime: formValues.get("inquiryTime"),
    salesPersonId: formValues.get("salesPersonId"),
    images: formValues.getAll("images"), // ✅ correct
  };
};
