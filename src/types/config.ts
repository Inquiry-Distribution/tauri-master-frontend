export type ConfigLoginLimit = {
  enabled: boolean;
  maxAttempts: number;
  lockoutMinutes: number;
};
export type ConfigAttendanceHours = {
  workStart: string;
  workEnd: string;
  workStartHour?: number;
  workStartMinute?: number;
  workEndHour?: number;
  workEndMinute?: number;
  lateGraceMinute: number;
  notice?: string;
};
