export type ConfigLoginLimit = {
  enabled: boolean;
  maxAttempts: number;
  lockoutMinutes: number;
};
export type ConfigAttendanceHours = {
  workStartHour: number;
  workEndHour: number;
  lateGraceMinute: number;
};
