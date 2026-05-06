// export type SalesPerson = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   employeeId: string;
//   assignedArea: string;
// };

export type CreateUser = {
  name: string;
  email: string;
  password: string;
  role: string;
  employeeId: string;
  pin: string;
  company: string;
};

export type ResetPassword = {
  oldPassword: string;
  password: string;
};

export type SalesPersonId = {
  id: string;
  name: string;
  email: string;
  role: "sales";
  phone: string;
  employeeId: null | string;
  assignedArea: null | string;
  profileImage: null | string;
  companyId: null | string;
  company: {
    id: string;
    name: string;
  } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  pin: boolean;
  createdBy: null | string;

  device: {
    id: string;
    deviceId: string;
    platform: string;
    mobileNumber: null | string;
    appVersion: string;
    isBlocked: boolean;
    lastSeen: string;
  } | null;
};
export type SalesPerson = {
  id: string;
  name: string;
  email: string;

  phone?: string;
  employeeId?: string;
  assignedArea?: string;

  isActive?: boolean;

  inquiries?: {
    total: number;
    assigned: number;
    inProgress: number;
    followUp: number;
    closed: number;
    converted: number;
    conversionRate: string;
    closeRate: string;
  };

  attendance?: {
    present: number;
    halfDay: number;
    absent: number;
    totalDays: number;
  };
  profileImage?: string;
};

export type UpdateUser = {
  name: string;
  employeeId: string;
  phone: string;
  email: string;
};

export type SalesPersonReport = {
  total: number;
  closed: number;
  inProgress: number;
  followUp: number;
  converted: number;
  conversionRate: string;
  closeRate: string;
};
