export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  initials: string;
  avatarColor: string;
}

export type WorkloadStatus = "Available" | "Busy" | "Overloaded";

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
  person: SalesPerson;
  workload?: PersonWorkload;
  onClose: () => void;
  onConfirm: (person: SalesPerson) => void;
}
