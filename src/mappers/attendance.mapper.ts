import { Attendance } from "../types/attendance";

export const formatAttendanceForExport = (data: Attendance[]) => {
  return data.map((row) => ({
    "Attendance ID": row.id.slice(0, 8).toUpperCase(),

    "Salesperson Name": row.salesperson?.name || "",
    "Salesperson Email": row.salesperson?.email || "",

    "Check In Time": row.checkInTime
      ? new Date(row.checkInTime).toLocaleTimeString()
      : "",

    "Check In Address": row.checkInAddress || "",

    "Check Out Time": row.checkOutTime
      ? new Date(row.checkOutTime).toLocaleTimeString()
      : "",

    "Check Out Address": row.checkOutAddress || "",

    Status: row.status.replace("_", " "),

    Date: new Date(row.date).toDateString(),
  }));
};
