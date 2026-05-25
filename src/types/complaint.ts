export type ComplaintType = "complaint" | "suggestion";
export type ComplaintStatus = "pending" | "reviewed" | "resolved";

export interface ComplaintUser {
  id: string;
  name: string;
  email: string;
  employeeId?: string | null;
}

export interface Complaint {
  id: string;
  type: ComplaintType;
  subject: string;
  message: string;
  status: ComplaintStatus;
  reviewNote: string | null;
  submittedById: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  submittedBy: ComplaintUser;
  reviewedBy: ComplaintUser | null;
}

export interface ComplaintListResponse {
  success: boolean;
  message: string;
  data: {
    records: Complaint[];
    total: number;
  };
}

export interface ReviewComplaintPayload {
  status: "reviewed" | "resolved";
  reviewNote?: string;
}
