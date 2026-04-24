import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Device } from "../types/devices";
import { formatDeviceForExport } from "../mappers/device.mapper";

export const exportDeviceExcel = async (data: Device[]) => {
  const workbook = new ExcelJS.Workbook();

  const formatted = formatDeviceForExport(data);

  // =========================
  // 📊 DASHBOARD
  // =========================
  const dashboard = workbook.addWorksheet("Dashboard");

  const total = data.length;
  const activeCount = data.filter((d) => !d.isBlocked).length;
  const blockedCount = data.filter((d) => d.isBlocked).length;

  dashboard.mergeCells("A1:C1");
  dashboard.getCell("A1").value = "Device Monitoring Dashboard";
  dashboard.getCell("A1").font = { size: 16, bold: true };
  dashboard.getCell("A1").alignment = { horizontal: "center" };

  dashboard.addRow([]);
  dashboard.addRow(["Metric", "Value"]);

  [
    ["Total Devices", total],
    ["Active Devices", activeCount],
    ["Blocked Devices", blockedCount],
  ].forEach((r) => dashboard.addRow(r));

  dashboard.columns = [{ width: 25 }, { width: 15 }];

  // =========================
  // 📄 SHEET CREATOR
  // =========================
  const createSheet = (name: string, rows: any[]) => {
    const sheet = workbook.addWorksheet(name);

    sheet.columns = [
      { header: "Device ID", key: "id", width: 18 },
      { header: "Salesperson", key: "salesperson", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Employee ID", key: "employeeId", width: 15 },

      { header: "Platform", key: "platform", width: 12 },
      { header: "App Version", key: "appVersion", width: 12 },

      { header: "Status", key: "status", width: 12 },
      { header: "Block Reason", key: "blockReason", width: 25 },

      { header: "Last Seen", key: "lastSeen", width: 22 },
      { header: "Location", key: "location", width: 25 },
      { header: "Address", key: "address", width: 35 },
    ];

    // 🔥 Header styling
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E40AF" },
      };
      cell.alignment = { horizontal: "center" };
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: "A1", to: "L1" };

    rows.forEach((row) => sheet.addRow(row));

    const lastRow = sheet.rowCount;

    // =========================
    // 🎯 STATUS COLORS
    // =========================
    sheet.addConditionalFormatting({
      ref: `H2:H${lastRow}`,
      rules: [
        {
          type: "containsText",
          operator: "containsText",
          text: "Blocked",
          priority: 1,
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
          text: "Active",
          priority: 2,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "10B981" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
      ],
    });

    // =========================
    // 🧊 WRAP TEXT
    // =========================
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
  // 📄 FILTERED SHEETS
  // =========================
  const active = formatted.filter((d) => d.status === "Active");
  const blocked = formatted.filter((d) => d.status === "Blocked");

  createSheet("All Devices", formatted);
  createSheet("Active Devices", active);
  createSheet("Blocked Devices", blocked);

  // =========================
  // 📤 EXPORT
  // =========================
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "device_report.xlsx");
};
