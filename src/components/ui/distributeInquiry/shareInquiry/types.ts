// export interface SalesPerson {
//   id: string;
//   name: string;
//   email: string;
//   mobile: string;
//   role: string;
//   initials: string;
//   avatarColor: string;
// }

import { SalesPerson } from "@/src/types/users";

export type WorkloadStatus = "Available" | "Busy" | "Overloaded" | string;

export type UISalesPerson = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  initials: string;
  avatarColor: string;
};

export interface PersonWorkload {
  status: WorkloadStatus;
  inquiriesOpen: number;
  inquiriesLimit: number;
  capacityUsed: number;
  capacityLimit: number;
  avgResponseMin: number;
  conversionRate: number;
  lastActive: string; // e.g. "2 min ago"
  lastActiveType: "online" | "away";
}

// export interface ShareInquiryModalProps {
//   person: UISalesPerson;
//   workload?: PersonWorkload;
//   loading: boolean;
//   onClose: () => void;
//   onConfirm: (person: UISalesPerson) => void;
// }
export interface ShareInquiryModalProps {
  person: ShareInquiryPerson;
  onClose: () => void;
  onConfirm: (person: ShareInquiryPerson) => void;
  loading?: boolean;
}
// export type ShareInquiryPerson = {
//   id: string;
//   name: string;
//   email: string;
//   role?: string;

//   initials: string;
//   avatarColor: string;

//   // API-driven (optional)
//   inquiries?: SalesPerson["inquiries"];
//   attendance?: SalesPerson["attendance"];

//   // fallback workload (dummy)
//   workload?: {
//     inquiriesOpen: number;
//     inquiriesLimit: number;
//     avgResponseMin: number;
//     conversionRate: number;
//     lastActive: string;
//     lastActiveType: "online" | "away";
//     capacityUsed: number;
//     capacityLimit: number;
//     status: "active" | "busy" | "overloaded";
//   };
// };
export type ShareInquiryPerson = {
  id: string;
  name: string;
  email: string;
  mobile?: string; // ← add this
  role?: string;
  initials: string;
  avatarColor: string;
  inquiries?: SalesPerson["inquiries"];
  attendance?: SalesPerson["attendance"];
  workload?: {
    inquiriesOpen: number;
    inquiriesLimit: number;
    avgResponseMin: number;
    conversionRate: number;
    lastActive: string;
    lastActiveType: string;
    capacityUsed: number;
    capacityLimit: number;
    status: string;
  };
};
