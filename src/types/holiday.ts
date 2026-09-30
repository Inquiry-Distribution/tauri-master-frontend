export type Holiday = {
  id: string;
  date: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type HolidayPayload = {
  date: string;
  name: string;
  isActive?: boolean;
};
