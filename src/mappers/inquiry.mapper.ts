// src/mappers/inquiry.mapper.ts

import { Inquiry } from "../types/inquiry";

export const mapInquiryFormToPayload = (formValues: FormData) => {
  return {
    description: formValues.get("description"),
    mobile: formValues.get("mobile"),
    inquiryTime: formValues.get("inquiryTime"),
    salesPersonId: formValues.get("salesPersonId"),
    images: formValues.getAll("images"), // ✅ correct
  };
};

export const formatInquiryForExport = (data: Inquiry[]) => {
  return data.map((row) => ({
    "INQ ID": row.id.slice(0, 8).toUpperCase(),

    Inquiry: row.description || "",

    Mobile: row.mobile || "",

    Priority: row.priority,

    Status: row.status.replace("_", " "),

    "Assignee Name": row.assignedTo?.name || "Unassigned",

    "Assignee Email": row.assignedTo?.email || "",

    Date: new Date(row.createdAt).toLocaleDateString(),
  }));
};
