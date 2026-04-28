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
