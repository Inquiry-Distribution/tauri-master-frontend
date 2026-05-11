import { writeFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import ExcelJS from "exceljs";
import { Attendance } from "../types/attendance";

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

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" },
      };
      cell.alignment = { horizontal: "center" };
    });

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

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { wrapText: true, vertical: "middle" };
      });
    });
  };

  createSheet("All", data);
  createSheet(
    "Present",
    data.filter((d) => d.status === "present"),
  );
  createSheet(
    "Absent",
    data.filter((d) => d.status === "absent"),
  );
  createSheet(
    "Half Day",
    data.filter((d) => d.status === "half_day"),
  );

  // =========================
  // 📤 EXPORT
  // =========================
  const buffer = await workbook.xlsx.writeBuffer();
  const uint8Array = new Uint8Array(buffer as ArrayBuffer);

  // ✅ Check for Tauri environment correctly
  const isTauri = "__TAURI_INTERNALS__" in window;

  if (isTauri) {
    const filePath = await save({
      defaultPath: "attendance_report.xlsx",
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    // User cancelled the dialog
    if (!filePath) return;

    // ✅ Tauri v2: writeFile(path, data)
    await writeFile(filePath, uint8Array);
  } else {
    const blob = new Blob([uint8Array], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // ✅ Clean up the object URL
  }
};
