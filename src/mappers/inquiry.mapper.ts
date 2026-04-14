// src/mappers/inquiry.mapper.ts

export const mapInquiryFormToPayload = (formValues: any) => {
  return {
    description: formValues.description,
    mobile: formValues.mobile,
    inquiryTime: formValues.inquiryTime,
    salesPersonId: formValues.salesPersonId,
  };
};
