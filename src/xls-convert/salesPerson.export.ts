import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SalesPerson } from "../types/users";
import { formatSalesPerson } from "../mappers/salesPerson.mapper";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

export const exportSalesPersonExcel = async (data: SalesPerson[]) => {
  const workbook = new ExcelJS.Workbook();

  const formatted = formatSalesPerson(data);

  // =========================
  // 📊 DASHBOARD
  // =========================
  const dashboard = workbook.addWorksheet("Dashboard");

  const total = data.length;
  const active = data.filter((d) => d.isActive).length;
  const inactive = total - active;

  dashboard.mergeCells("A1:D1");
  dashboard.getCell("A1").value = "Sales Performance Dashboard";
  dashboard.getCell("A1").font = { size: 16, bold: true };
  dashboard.getCell("A1").alignment = { horizontal: "center" };

  dashboard.addRow([]);
  dashboard.addRow(["Metric", "Value"]);

  [
    ["Total Salespersons", total],
    ["Active", active],
    ["Inactive", inactive],
  ].forEach((r) => dashboard.addRow(r));

  dashboard.getRow(3).font = { bold: true };

  dashboard.columns = [{ width: 30 }, { width: 15 }];

  // =========================
  // 📄 SHEET CREATOR
  // =========================
  const createSheet = (name: string, rows: any[]) => {
    const sheet = workbook.addWorksheet(name);

    sheet.columns = [
      { header: "ID", key: "id", width: 12 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Area", key: "area", width: 20 },
      { header: "Status", key: "active", width: 12 },

      { header: "Total Inquiries", key: "totalInquiries", width: 18 },
      { header: "Closed", key: "closed", width: 12 },

      { header: "Conversion %", key: "conversionRate", width: 18 },
      { header: "Attendance %", key: "attendanceScore", width: 18 },
    ];

    // Header style
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
    sheet.autoFilter = { from: "A1", to: "J1" };

    rows.forEach((row) => sheet.addRow(row));

    const lastRow = sheet.rowCount;

    // =========================
    // 🎯 CONDITIONAL FORMATTING
    // =========================

    // 🟢 ACTIVE / 🔴 INACTIVE
    sheet.addConditionalFormatting({
      ref: `F2:F${lastRow}`,
      rules: [
        {
          type: "containsText",
          operator: "containsText",
          text: "Active",
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
          text: "Inactive",
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
      ],
    });

    // =========================
    // 📊 PROGRESS BARS
    // =========================

    sheet.addConditionalFormatting({
      ref: `I2:I${lastRow}`,
      rules: [
        {
          type: "colorScale",
          priority: 3,
          cfvo: [
            { type: "min" },
            { type: "percentile", value: 50 },
            { type: "max" },
          ],
          color: [
            { argb: "EF4444" }, // red
            { argb: "F59E0B" }, // yellow
            { argb: "10B981" }, // green
          ],
        },
      ],
    });

    // Conversion %
    // sheet.addConditionalFormatting({
    //   ref: `I2:I${lastRow}`,
    //   rules: [
    //     {
    //       type: "dataBar",
    //       priority: 3,
    //       cfvo: [{ type: "min" }, { type: "max" }],
    //       color: "3B82F6", // blue
    //     } as any,
    //   ],
    // });

    // // Attendance %
    // sheet.addConditionalFormatting({
    //   ref: `J2:J${lastRow}`,
    //   rules: [
    //     {
    //       type: "dataBar",
    //       priority: 4,
    //       cfvo: [{ type: "min" }, { type: "max" }],
    //       color: "10B981", // green
    //     } as any,
    //   ],
    // });

    // Wrap text
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { wrapText: true };
      });
    });
  };

  // =========================
  // 📄 MULTIPLE SHEETS
  // =========================
  createSheet("All", formatted);
  createSheet(
    "Active",
    formatted.filter((r) => r.active === "Active"),
  );
  createSheet(
    "Inactive",
    formatted.filter((r) => r.active === "Inactive"),
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
      defaultPath: "salesperson_report.xlsx",
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
    a.download = "salesperson_report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // ✅ Clean up the object URL
  }
};
