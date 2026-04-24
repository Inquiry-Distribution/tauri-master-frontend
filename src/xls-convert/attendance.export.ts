import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Attendance } from "../types/attendance";
import { formatAttendanceForExport } from "../mappers/attendance.mapper";

// export const exportAttendanceExcel = (data: Attendance[]) => {
//   const formattedData = formatAttendanceForExport(data);

//   const worksheet = XLSX.utils.json_to_sheet(formattedData);

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });

//   const file = new Blob([excelBuffer], {
//     type: "application/octet-stream",
//   });

//   saveAs(file, "attendance.xlsx");
// };

import ExcelJS from "exceljs";

export const exportAttendanceExcel = async (data: Attendance[]) => {
  const workbook = new ExcelJS.Workbook();

  // =========================
  // 📊 DASHBOARD SHEET
  // =========================
  const dashboard = workbook.addWorksheet("Dashboard");

  const total = data.length;
  const present = data.filter((d) => d.status === "present").length;
  const absent = data.filter((d) => d.status === "absent").length;
  const halfDay = data.filter((d) => d.status === "half_day").length;

  dashboard.mergeCells("A1:D1");
  dashboard.getCell("A1").value = "Attendance Dashboard";
  dashboard.getCell("A1").font = { size: 16, bold: true };
  dashboard.getCell("A1").alignment = { horizontal: "center" };

  dashboard.addRow([]);
  dashboard.addRow(["Metric", "Count"]);

  [
    ["Total Records", total],
    ["Present", present],
    ["Absent", absent],
    ["Half Day", halfDay],
  ].forEach((r) => dashboard.addRow(r));

  dashboard.getRow(3).font = { bold: true };

  // Status breakdown table (for charts)
  dashboard.addRow([]);
  dashboard.addRow(["Status", "Count"]);
  [
    ["Present", present],
    ["Absent", absent],
    ["Half Day", halfDay],
  ].forEach((r) => dashboard.addRow(r));

  dashboard.columns = [{ width: 25 }, { width: 15 }];

  // =========================
  // 📄 SHEET CREATOR
  // =========================
  const createSheet = (name: string, rows: Attendance[]) => {
    const sheet = workbook.addWorksheet(name);

    sheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "Salesperson", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Date", key: "date", width: 18 },
      { header: "Check In", key: "checkIn", width: 20 },
      { header: "Check Out", key: "checkOut", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Address", key: "address", width: 40 },
    ];

    // 🔥 Header styling
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" },
      };
      cell.alignment = { horizontal: "center" };
    });

    // Freeze + filter
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: "A1", to: "H1" };

    rows.forEach((row) => {
      sheet.addRow({
        id: row.id.slice(0, 8).toUpperCase(),
        name: row.salesperson?.name || "",
        email: row.salesperson?.email || "",
        date: new Date(row.date).toLocaleDateString(),
        checkIn: row.checkInTime
          ? new Date(row.checkInTime).toLocaleTimeString()
          : "",
        checkOut: row.checkOutTime
          ? new Date(row.checkOutTime).toLocaleTimeString()
          : "",
        status: row.status.replace("_", " "),
        address: row.checkInAddress || row.checkOutAddress || "",
      });
    });

    const lastRow = sheet.rowCount;

    // 🎨 CONDITIONAL FORMATTING (STATUS)
    sheet.addConditionalFormatting({
      ref: `G2:G${lastRow}`,
      rules: [
        {
          type: "containsText",
          operator: "containsText",
          text: "present",
          priority: 1,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "10B981" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
        {
          type: "containsText",
          operator: "containsText",
          text: "absent",
          priority: 2,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "EF4444" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
        {
          type: "containsText",
          operator: "containsText",
          text: "half day",
          priority: 3,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "F59E0B" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
      ],
    });

    // ✅ Wrap text
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
        };
      });
    });
  };

  // =========================
  // 📄 MULTIPLE SHEETS
  // =========================
  const presentData = data.filter((d) => d.status === "present");
  const absentData = data.filter((d) => d.status === "absent");
  const halfDayData = data.filter((d) => d.status === "half_day");

  createSheet("All", data);
  createSheet("Present", presentData);
  createSheet("Absent", absentData);
  createSheet("Half Day", halfDayData);

  // =========================
  // 📤 EXPORT
  // =========================
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "attendance_report.xlsx");
};
