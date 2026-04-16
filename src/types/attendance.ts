export type Attendance = {
  id: string;
  salespersonId: string;
  deviceId: string;
  date: string;
  checkInTime: string;
  checkInLat: number | null;
  checkInLng: number | null;
  checkInAddress: string | null;
  checkOutTime: string | null;
  checkOutLat: number | null;
  checkOutLng: number | null;
  checkOutAddress: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  salesperson: {
    id: string;
    name: string;
    email: string;
  };
};

export type AttendancePerson = {
  id: string;
  salespersonId: string;
  deviceId: string;
  date: string;
  checkInTime: string;
  checkInLat: number | null;
  checkInLng: number | null;
  checkInAddress: string | null;
  checkOutTime: string;
  checkOutLat: number | null;
  checkOutLng: number | null;
  checkOutAddress: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};
