// src/mappers/inquiry.mapper.ts

export const mapInquiryFormToPayload = (formValues: any) => {
  return {
    description: formValues.inquirydescription,
    mobile: formValues.mobile,
    inquiryTime: formValues.time,
  };
};
