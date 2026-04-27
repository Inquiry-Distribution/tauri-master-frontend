import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Inquiry } from "../types/inquiry";
import { formatInquiryForExport } from "../mappers/inquiry.mapper";

// export const exportInquiryExcel = (data: Inquiry[]) => {

import ExcelJS from "exceljs";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

const createDashboardSheet = (workbook: ExcelJS.Workbook, data: Inquiry[]) => {
  const sheet = workbook.addWorksheet("Dashboard");

  // 🔹 KPI calculations
  const total = data.length;

  const statusCount = {
    assigned: data.filter((i) => i.status === "assigned").length,
    unassigned: data.filter((i) => i.status === "unassigned").length,
    in_progress: data.filter((i) => i.status === "in_progress").length,
    follow_up: data.filter((i) => i.status === "follow_up").length,
    closed: data.filter((i) => i.status === "closed").length,
  };

  const priorityCount = {
    high: data.filter((i) => i.priority === "high").length,
    medium: data.filter((i) => i.priority === "medium").length,
    low: data.filter((i) => i.priority === "low").length,
  };

  // 🔥 Title
  sheet.mergeCells("A1:D1");
  sheet.getCell("A1").value = "Inquiries Dashboard";
  sheet.getCell("A1").font = { size: 16, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  // 🔹 KPIs
  sheet.addRow([]);
  sheet.addRow(["Metric", "Value"]);

  const kpiRows = [
    ["Total Inquiries", total],
    ["Assigned", statusCount.assigned],
    ["Unassigned", statusCount.unassigned],
    ["In Progress", statusCount.in_progress],
    ["Follow Up", statusCount.follow_up],
    ["Closed", statusCount.closed],
  ];

  kpiRows.forEach((r) => sheet.addRow(r));

  // Style header
  sheet.getRow(3).font = { bold: true };

  // 🔹 Status breakdown table (for chart)
  const statusStartRow = sheet.rowCount + 3;

  sheet.getCell(`A${statusStartRow}`).value = "Status Breakdown";
  sheet.getCell(`A${statusStartRow}`).font = { bold: true };

  //   sheet.getCell("D5").value = "👉 Select Status table → Insert → Pie Chart";

  const statusTable = [
    ["Status", "Count"],
    ["Assigned", statusCount.assigned],
    ["Unassigned", statusCount.unassigned],
    ["In Progress", statusCount.in_progress],
    ["Follow Up", statusCount.follow_up],
    ["Closed", statusCount.closed],
  ];

  statusTable.forEach((r) => sheet.addRow(r));

  // 🔹 Priority breakdown table
  const priorityStartRow = sheet.rowCount + 3;

  sheet.getCell(`A${priorityStartRow}`).value = "Priority Breakdown";
  sheet.getCell(`A${priorityStartRow}`).font = { bold: true };

  const priorityTable = [
    ["Priority", "Count"],
    ["High", priorityCount.high],
    ["Medium", priorityCount.medium],
    ["Low", priorityCount.low],
  ];

  priorityTable.forEach((r) => sheet.addRow(r));

  // 🔥 Make it look clean
  sheet.columns = [{ width: 25 }, { width: 15 }, { width: 15 }, { width: 15 }];
};
export const exportInquiryStyled = async (data: Inquiry[]) => {
  const workbook = new ExcelJS.Workbook();

  // 🔹 Dashboard first
  createDashboardSheet(workbook, data);
  // 🔹 Helper to create sheet
  const createSheet = (name: string, rows: Inquiry[]) => {
    const sheet = workbook.addWorksheet(name);

    sheet.columns = [
      { header: "INQ ID", key: "id", width: 15 },
      { header: "Inquiry", key: "description", width: 35 },
      { header: "Mobile", key: "mobile", width: 18 },
      { header: "Priority", key: "priority", width: 12 },
      { header: "Status", key: "status", width: 18 },
      { header: "Assignee", key: "assignee", width: 25 },
      { header: "Date", key: "date", width: 18 },
    ];

    // 🔥 Header styling
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E40AF" }, // dark blue
      };
      cell.alignment = { horizontal: "center" };
    });

    // Freeze header
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    // Auto filter
    sheet.autoFilter = {
      from: "A1",
      to: "G1",
    };

    // Add rows
    rows.forEach((row) => {
      sheet.addRow({
        id: row.id.slice(0, 8).toUpperCase(),
        description: row.description || "",
        mobile: row.mobile || "",
        priority: row.priority,
        status: row.status.replace("_", " "),
        assignee: row.assignedTo?.name || "Unassigned",
        date: new Date(row.createdAt).toLocaleDateString(),
      });
    });

    const lastRow = sheet.rowCount;

    // 🎯 CONDITIONAL FORMATTING (STATUS)
    sheet.addConditionalFormatting({
      ref: `E2:E${lastRow}`,
      rules: [
        {
          type: "containsText",
          operator: "containsText",
          text: "closed",
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
          text: "in progress",
          priority: 2,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "F59E0B" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
        {
          type: "containsText",
          operator: "containsText",
          text: "assigned",
          priority: 3,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "3B82F6" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
        {
          type: "containsText",
          operator: "containsText",
          text: "unassigned",
          priority: 4,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "9CA3AF" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
      ],
    });

    // 🎯 CONDITIONAL FORMATTING (PRIORITY)
    sheet.addConditionalFormatting({
      ref: `D2:D${lastRow}`,
      rules: [
        {
          type: "containsText",
          operator: "containsText",
          text: "high",
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
          text: "medium",
          priority: 2,
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "F59E0B" },
            },
            font: { color: { argb: "FFFFFF" }, bold: true },
          },
        },
        {
          type: "containsText",
          operator: "containsText",
          text: "low",
          priority: 3,
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
  };

  // 🔹 Create filtered datasets
  const assigned = data.filter((i) => i.status === "assigned");
  const closed = data.filter((i) => i.status === "closed");

  // 🔹 Create sheets
  createSheet("All", data);
  createSheet("Assigned", assigned);
  createSheet("Closed", closed);

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const uint8Array = new Uint8Array(buffer as ArrayBuffer);

  // ✅ Check for Tauri environment correctly
  const isTauri = "__TAURI_INTERNALS__" in window;

  if (isTauri) {
    const filePath = await save({
      defaultPath: "inquiries_report.xlsx",
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
    a.download = "inquiries_report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // ✅ Clean up the object URL
  }
};
