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

export type WorkloadStatus = "Available" | "Busy" | "Overloaded";

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

export interface ShareInquiryModalProps {
  person: UISalesPerson;
  workload?: PersonWorkload;
  loading: boolean;
  onClose: () => void;
  onConfirm: (person: UISalesPerson) => void;
}
