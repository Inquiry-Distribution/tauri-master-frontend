// src/types/inquiry.ts

export type CreateInquiryPayload = {
  description: string;
  mobile: string;
  inquiryTime: string;
  salesPersonId: string;
  source: string;
  images: File;
};
export type EditInquiryPayload = {
  description: string;
  mobile: string;
  inquiryTime: string;
  // salesPersonId: string;
  source: string;
  images: File;
};

// ===== Root Response =====
export interface InquiryListResponse {
  success: boolean;
  message: string;
  data: InquiryListData;
}

export interface InquiryListData {
  total: number;
  page: number;
  limit: number;
  inquiries: Inquiry[];
}

// ===== Main Inquiry Type =====
export interface Inquiry {
  id: string;
  title: string | null;
  description: string | null;
  type: InquiryType;
  source: string | null;

  status: InquiryStatus;
  priority: Priority;

  mobile: string | null;
  inquiryTime: string | null;

  assignedToId: string | null;
  assignedById: string | null;
  uploadedById: string;

  assignedAt: string | null;
  visibleUntil: string | null;

  isConverted: boolean;
  convertedAt: string | null;

  createdAt: string;
  updatedAt: string;

  assignedTo: User | null;
  assignedBy: User | null;
  uploadedBy: User;

  images: InquiryImage[];
  notes: InquiryNote[];
  statusHistory: StatusHistory[];
}

// ===== Supporting Types =====
export interface User {
  id: string;
  name: string;
  email?: string; // optional because not always present
}

export interface InquiryImage {
  id: string;
  inquiryId: string;
  url: string;
  filename: string;
  size: number | null;
  createdAt: string;
}

export interface InquiryNote {
  id: string;
  inquiryId: string;
  text: string;
  addedById: string;
  createdAt: string;
  addedBy: User;
}

export interface StatusHistory {
  id: string;
  inquiryId: string;
  status: InquiryStatus;
  changedById: string;
  changedAt: string;
  changedBy: User;
}

// ===== Enums / Union Types =====
export type InquiryType = "text" | "text_image" | string;

export type InquiryStatus =
  | "unassigned"
  | "assigned"
  | "in_progress"
  | "follow_up"
  | "closed"
  | string;

export type Priority = "low" | "medium" | "high" | string;
