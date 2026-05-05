export type AttendanceSessions = {
  id: string;
  attendanceId: string;
  checkInTime: string;
  checkInLat: string | null;
  checkInLng: string | null;
  checkInAddress: string | null;
  checkOutTime: string | null;
  checkOutLat: string | null;
  checkOutLng: string | null;
  checkOutAddress: string | null;
  durationMinutes: number | null;
  autoFinalized: boolean;
  isLate: boolean;
  isEarlyExit: boolean;
  adminNote: string | null;
  adminEditedAt: string | null;
  adminEditedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Attendance = {
  id: string;
  salespersonId: string;
  date: string;
  totalMinutes: number;
  sessionsCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  view: boolean;
  checkIn: string;
  checkOut: string;

  salesperson: {
    id: string;
    name: string;
    email: string;
    allowRemote: boolean;
  };

  sessions: AttendanceSessions[];
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

/// AttendancePersonResponse
export interface AttendanceSession {
  id: string;
  attendanceId: string;
  checkInTime: string;
  checkInLat: string;
  checkInLng: string;
  checkInAddress: string | null;
  checkOutTime: string | null;
  checkOutLat: string | null;
  checkOutLng: string | null;
  checkOutAddress: string | null;
  durationMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  salespersonId: string;
  date: string;
  totalMinutes: number;
  sessionsCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  salesperson: Salesperson;
  sessions: AttendanceSession[];
}

export interface AttendanceResponse {
  records: AttendanceRecord[];
  total: number;
}
