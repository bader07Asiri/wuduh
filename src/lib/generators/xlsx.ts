// ============================
// وضوح | Wuduh — XLSX Generator
// يولّد ملفات Excel من بيانات AI
// ============================

import ExcelJS from "exceljs";

// Brand colors
const NAVY    = "0F2057";
const PRIMARY = "2563EB";
const ACCENT  = "0EA5E9";
const GOLD    = "F59E0B";
const SUCCESS = "10B981";
const DANGER  = "EF4444";
const WARNING = "F97316";
const BG_LIGHT = "F8FAFC";
const BORDER  = "E2E8F0";
const TEXT    = "0F172A";
const TEXT_MID = "334155";
const TEXT_LIGHT = "64748B";
const WHITE   = "FFFFFF";

// ============================
// Helpers
// ============================
function styleHeaderRow(row: ExcelJS.Row, bgColor = NAVY) {
  row.eachCell(cell => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${bgColor}` } };
    cell.font = { bold: true, color: { argb: `FF${WHITE}` }, size: 11, name: "Calibri" };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: `FF${BORDER}` } },
      bottom: { style: "thin", color: { argb: `FF${BORDER}` } },
      left: { style: "thin", color: { argb: `FF${BORDER}` } },
      right: { style: "thin", color: { argb: `FF${BORDER}` } },
    };
  });
  row.height = 28;
}

function styleDataRow(row: ExcelJS.Row, even: boolean) {
  row.eachCell(cell => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: even ? `FFFFFFFF` : `FFF8FAFC` } };
    cell.font = { size: 10, color: { argb: `FF${TEXT}` }, name: "Calibri" };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "hair", color: { argb: `FFE2E8F0` } },
      bottom: { style: "hair", color: { argb: `FFE2E8F0` } },
      left: { style: "hair", color: { argb: `FFE2E8F0` } },
      right: { style: "hair", color: { argb: `FFE2E8F0` } },
    };
  });
  row.height = 22;
}

function addCoverSheet(wb: ExcelJS.Workbook, title: string, projectName: string) {
  const ws = wb.addWorksheet("Cover", { properties: { tabColor: { argb: `FF${NAVY}` } } });
  ws.getColumn(1).width = 10;
  ws.getColumn(2).width = 60;
  ws.getColumn(3).width = 20;

  // Brand header row
  ws.mergeCells("B2:C3");
  ws.getCell("B2").value = "Wuduh | وضوح";
  ws.getCell("B2").font = { bold: true, size: 24, color: { argb: `FF${PRIMARY}` }, name: "Calibri" };
  ws.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

  ws.mergeCells("B4:C4");
  ws.getCell("B4").value = "PMI/PMBOK Guide 7th Edition Compliant AI Platform";
  ws.getCell("B4").font = { size: 11, color: { argb: `FF${TEXT_LIGHT}` }, italic: true, name: "Calibri" };
  ws.getCell("B4").alignment = { horizontal: "center" };

  ws.getRow(5).height = 20;

  ws.mergeCells("B6:C7");
  ws.getCell("B6").value = title;
  ws.getCell("B6").font = { bold: true, size: 20, color: { argb: `FF${NAVY}` }, name: "Calibri" };
  ws.getCell("B6").alignment = { horizontal: "center", vertical: "middle" };

  ws.mergeCells("B8:C8");
  ws.getCell("B8").value = projectName;
  ws.getCell("B8").font = { size: 14, color: { argb: `FF${TEXT_MID}` }, name: "Calibri" };
  ws.getCell("B8").alignment = { horizontal: "center" };

  ws.getRow(9).height = 20;

  ws.getCell("B10").value = "Generated:";
  ws.getCell("B10").font = { size: 10, color: { argb: `FF${TEXT_LIGHT}` } };
  ws.getCell("C10").value = new Date().toLocaleDateString("en-GB");
  ws.getCell("C10").font = { size: 10, color: { argb: `FF${TEXT}` } };
}

// ============================
// 1. WBS (Work Breakdown Structure) XLSX
// ============================
export async function generateWBSXLSX(agendaData: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Wuduh AI";
  wb.created = new Date();

  addCoverSheet(wb, "Work Breakdown Structure (WBS)", projectName);

  const ws = wb.addWorksheet("WBS", { properties: { tabColor: { argb: `FF${PRIMARY}` } } });

  // Freeze header row
  ws.views = [{ state: "frozen", ySplit: 3, activeCell: "A4" }];

  // Title row
  ws.mergeCells("A1:H1");
  ws.getCell("A1").value = `Work Breakdown Structure — ${projectName}`;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: `FF${WHITE}` }, name: "Calibri" };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 32;

  // Sub-title row
  ws.mergeCells("A2:H2");
  ws.getCell("A2").value = "PMI/PMBOK Guide 7th Edition";
  ws.getCell("A2").font = { size: 10, color: { argb: `FF${WHITE}` }, italic: true };
  ws.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${PRIMARY}` } };
  ws.getCell("A2").alignment = { horizontal: "center" };
  ws.getRow(2).height = 22;

  // Headers
  const headers = ["WBS Code", "Work Package", "Phase", "Description", "Duration (days)", "Effort (hrs)", "Dependencies", "Deliverable"];
  ws.addRow(headers);
  styleHeaderRow(ws.lastRow!);

  // Column widths
  ws.getColumn(1).width = 14;
  ws.getColumn(2).width = 40;
  ws.getColumn(3).width = 22;
  ws.getColumn(4).width = 50;
  ws.getColumn(5).width = 16;
  ws.getColumn(6).width = 14;
  ws.getColumn(7).width = 20;
  ws.getColumn(8).width = 35;

  const phases = (agendaData.phases as Array<{name:string; description:string; tasks?: Array<{name:string; duration_days:number; effort_hours:number; dependencies:string[]; deliverables:string[]}>}>) || [];
  let rowIdx = 0;
  phases.forEach((phase, pi) => {
    // Phase row
    const phaseRow = ws.addRow([
      `${pi + 1}`,
      phase.name.toUpperCase(),
      phase.name,
      phase.description,
      "", "", "", "",
    ]);
    phaseRow.eachCell(cell => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${ACCENT}` } };
      cell.font = { bold: true, size: 11, color: { argb: `FFFFFFFF` }, name: "Calibri" };
      cell.alignment = { vertical: "middle" };
      cell.border = { bottom: { style: "thin", color: { argb: `FF${BORDER}` } } };
    });
    phaseRow.height = 24;
    rowIdx++;

    const tasks = phase.tasks || [];
    tasks.forEach((task, ti) => {
      const r = ws.addRow([
        `${pi + 1}.${ti + 1}`,
        task.name,
        phase.name,
        `Work package for ${task.name}`,
        task.duration_days || 5,
        task.effort_hours || 20,
        (task.dependencies || []).join(", ") || "—",
        (task.deliverables || []).join(", ") || "—",
      ]);
      styleDataRow(r, rowIdx % 2 === 0);
      rowIdx++;
    });
  });

  // Summary stats at bottom
  ws.addRow([]);
  const summaryRow = ws.addRow(["Summary", "", "", "", `=SUM(E4:E${ws.rowCount - 1})`, `=SUM(F4:F${ws.rowCount - 1})`, "", ""]);
  styleHeaderRow(summaryRow, SUCCESS);

  return wb.xlsx.writeBuffer() as unknown as Promise<Uint8Array>;
}

// ============================
// 2. Risk Register XLSX
// ============================
export async function generateRiskRegisterXLSX(data: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Wuduh AI";
  wb.created = new Date();

  addCoverSheet(wb, "Risk Register", projectName);

  // Dashboard sheet
  const dash = wb.addWorksheet("Dashboard", { properties: { tabColor: { argb: `FF${GOLD}` } } });
  const summary = (data.summary as {total_risks:number;critical:number;high:number;medium:number;low:number;overall_risk_level:string}) || {};
  dash.mergeCells("A1:F1");
  dash.getCell("A1").value = `Risk Dashboard — ${projectName}`;
  dash.getCell("A1").font = { bold: true, size: 14, color: { argb: `FF${WHITE}` } };
  dash.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
  dash.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  dash.getRow(1).height = 32;

  const dashHeaders = ["Metric", "Value"];
  dash.addRow(dashHeaders);
  styleHeaderRow(dash.lastRow!, PRIMARY);

  const dashData = [
    ["Total Risks", summary.total_risks || 0],
    ["Critical Risks", summary.critical || 0],
    ["High Risks", summary.high || 0],
    ["Medium Risks", summary.medium || 0],
    ["Low Risks", summary.low || 0],
    ["Overall Risk Level", summary.overall_risk_level || "Medium"],
  ];
  dashData.forEach((row, i) => {
    const r = dash.addRow(row);
    styleDataRow(r, i % 2 === 0);
    if (row[0] === "Critical Risks" && Number(row[1]) > 0) {
      r.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FFFEECEC` } };
    }
  });

  dash.getColumn(1).width = 30;
  dash.getColumn(2).width = 20;

  // Register sheet
  const ws = wb.addWorksheet("Risk Register", { properties: { tabColor: { argb: `FF${DANGER}` } } });
  ws.views = [{ state: "frozen", ySplit: 3, activeCell: "A4" }];

  ws.mergeCells("A1:M1");
  ws.getCell("A1").value = `Risk Register — ${projectName}`;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: `FF${WHITE}` } };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 32;

  ws.mergeCells("A2:M2");
  ws.getCell("A2").value = "PMBOK 7th Edition Risk Management";
  ws.getCell("A2").font = { size: 10, italic: true, color: { argb: `FF${WHITE}` } };
  ws.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${PRIMARY}` } };
  ws.getCell("A2").alignment = { horizontal: "center" };
  ws.getRow(2).height = 20;

  const headers = ["ID","Risk Statement","Category","P (1-5)","I (1-5)","Risk Score","Level","Response Strategy","Response Actions","Contingency Plan","Owner","Review Date","Status"];
  ws.addRow(headers);
  styleHeaderRow(ws.lastRow!);

  ws.getColumn(1).width = 10;
  ws.getColumn(2).width = 50;
  ws.getColumn(3).width = 18;
  ws.getColumn(4).width = 10;
  ws.getColumn(5).width = 10;
  ws.getColumn(6).width = 12;
  ws.getColumn(7).width = 14;
  ws.getColumn(8).width = 20;
  ws.getColumn(9).width = 40;
  ws.getColumn(10).width = 40;
  ws.getColumn(11).width = 20;
  ws.getColumn(12).width = 16;
  ws.getColumn(13).width = 14;

  const risks = (data.risks as Array<{
    id:string; risk_statement:string; category:string;
    probability_score:number; impact_score:number; risk_score:number;
    risk_level:string; response_strategy:string; response_actions:string[];
    contingency_plan:string; owner:string; review_date:string; status:string;
  }>) || [];

  risks.forEach((risk, i) => {
    const row = ws.addRow([
      risk.id, risk.risk_statement, risk.category,
      risk.probability_score, risk.impact_score, risk.risk_score,
      risk.risk_level, risk.response_strategy,
      (risk.response_actions || []).join("; "),
      risk.contingency_plan, risk.owner, risk.review_date || "", risk.status,
    ]);
    styleDataRow(row, i % 2 === 0);

    // Color score cell
    const scoreCell = row.getCell(6);
    if (risk.risk_score >= 15) scoreCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFECACA" } };
    else if (risk.risk_score >= 8) scoreCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
    else if (risk.risk_score >= 4) scoreCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF9C3" } };
    else scoreCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFA7F3D0" } };
    scoreCell.font = { bold: true, size: 10 };
  });

  // Auto filter
  ws.autoFilter = { from: "A3", to: `M3` };

  return wb.xlsx.writeBuffer() as unknown as Promise<Uint8Array>;
}

// ============================
// 3. Gantt Chart XLSX
// ============================
export async function generateGanttXLSX(agendaData: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Wuduh AI";
  wb.created = new Date();

  addCoverSheet(wb, "Project Schedule (Gantt)", projectName);

  const ws = wb.addWorksheet("Gantt Chart", { properties: { tabColor: { argb: `FF${SUCCESS}` } } });
  const totalWeeks = Number(agendaData.duration_weeks) || 12;

  // Title
  ws.mergeCells(`A1:${String.fromCharCode(65 + 6 + totalWeeks)}1`);
  ws.getCell("A1").value = `Project Schedule — ${projectName}`;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: `FF${WHITE}` } };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 32;

  // Fixed columns
  ws.getColumn(1).width = 6;  // #
  ws.getColumn(2).width = 35; // Task Name
  ws.getColumn(3).width = 22; // Phase
  ws.getColumn(4).width = 12; // Start Wk
  ws.getColumn(5).width = 12; // End Wk
  ws.getColumn(6).width = 12; // Duration
  ws.getColumn(7).width = 16; // Owner

  // Week columns
  for (let w = 1; w <= totalWeeks; w++) {
    ws.getColumn(7 + w).width = 4.5;
  }

  // Header row
  const headerCells = ["#", "Task / Work Package", "Phase", "Start Wk", "End Wk", "Duration", "Owner"];
  for (let w = 1; w <= totalWeeks; w++) headerCells.push(`W${w}`);
  ws.addRow(headerCells);
  styleHeaderRow(ws.lastRow!);

  // Freeze panes
  ws.views = [{ state: "frozen", xSplit: 7, ySplit: 2, activeCell: "H3" }];

  let rowNum = 0;
  const phases = (agendaData.phases as Array<{name:string; start_week:number; end_week:number; tasks?: Array<{name:string;start_week:number;end_week:number;duration_days:number;owner?:string}>}>) || [];

  phases.forEach((phase, pi) => {
    // Phase header
    const phaseRow: (string | number)[] = [`${pi + 1}`, phase.name, "", phase.start_week, phase.end_week, `${phase.end_week - phase.start_week + 1} wks`, ""];
    for (let w = 1; w <= totalWeeks; w++) {
      phaseRow.push(w >= phase.start_week && w <= phase.end_week ? "█" : "");
    }
    const pr = ws.addRow(phaseRow);
    pr.eachCell((cell, col) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${col <= 7 ? ACCENT : "0EA5E9"}` } };
      cell.font = { bold: true, size: 10, color: { argb: `FF${WHITE}` } };
      cell.alignment = { horizontal: col <= 7 ? "left" : "center", vertical: "middle" };
    });
    pr.height = 22;
    rowNum++;

    const tasks = phase.tasks || [];
    tasks.forEach((task, ti) => {
      const taskRow: (string | number)[] = [`${pi + 1}.${ti + 1}`, task.name, phase.name, task.start_week, task.end_week, task.duration_days ? `${task.duration_days}d` : "—", task.owner || "TBD"];
      for (let w = 1; w <= totalWeeks; w++) {
        taskRow.push(w >= task.start_week && w <= task.end_week ? "■" : "");
      }
      const tr = ws.addRow(taskRow);
      styleDataRow(tr, rowNum % 2 === 0);

      // Color gantt cells
      for (let w = 1; w <= totalWeeks; w++) {
        const cell = tr.getCell(7 + w);
        if (w >= task.start_week && w <= task.end_week) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${PRIMARY}` } };
          cell.font = { size: 8, color: { argb: `FFFFFFFF` } };
        }
        cell.alignment = { horizontal: "center" };
      }
      rowNum++;
    });
  });

  // Add milestones sheet
  const msWs = wb.addWorksheet("Milestones", { properties: { tabColor: { argb: `FF${GOLD}` } } });
  msWs.getColumn(1).width = 35;
  msWs.getColumn(2).width = 12;
  msWs.getColumn(3).width = 50;
  msWs.getColumn(4).width = 45;

  msWs.addRow(["Milestone Name", "Week", "Description", "Success Criteria"]);
  styleHeaderRow(msWs.lastRow!, GOLD);

  const milestones = (agendaData.key_milestones as Array<{name:string;week:number;description:string;success_criteria:string}>) || [];
  milestones.forEach((m, i) => {
    const r = msWs.addRow([m.name, m.week, m.description, m.success_criteria]);
    styleDataRow(r, i % 2 === 0);
    r.getCell(1).font = { bold: true, size: 10, color: { argb: `FF${NAVY}` } };
  });

  return wb.xlsx.writeBuffer() as unknown as Promise<Uint8Array>;
}

// ============================
// 4. Budget Tracker XLSX
// ============================
export async function generateBudgetXLSX(agendaData: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Wuduh AI";
  wb.created = new Date();

  addCoverSheet(wb, "Budget Tracker", projectName);

  const ws = wb.addWorksheet("Budget", { properties: { tabColor: { argb: `FF${SUCCESS}` } } });

  // Title
  ws.mergeCells("A1:G1");
  ws.getCell("A1").value = `Project Budget — ${projectName}`;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: `FF${WHITE}` } };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 32;

  ws.getColumn(1).width = 30;
  ws.getColumn(2).width = 20;
  ws.getColumn(3).width = 16;
  ws.getColumn(4).width = 16;
  ws.getColumn(5).width = 16;
  ws.getColumn(6).width = 16;
  ws.getColumn(7).width = 25;

  ws.addRow(["Category", "Description", "Planned (SAR)", "Actual (SAR)", "Variance", "% Used", "Notes"]);
  styleHeaderRow(ws.lastRow!);

  const phases = (agendaData.phases as Array<{name:string; description:string; tasks?: Array<{name:string; effort_hours:number}>}>) || [];
  let totalPlanned = 0;
  let rowIdx = 0;

  phases.forEach((phase, pi) => {
    const phaseRow = ws.addRow([phase.name, "Phase Budget", "", "", "", "", ""]);
    phaseRow.eachCell(cell => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${ACCENT}` } };
      cell.font = { bold: true, size: 10, color: { argb: `FF${WHITE}` } };
    });

    const tasks = phase.tasks || [];
    tasks.forEach((task, ti) => {
      const planned = (task.effort_hours || 20) * 150; // ~150 SAR/hr
      totalPlanned += planned;
      const r = ws.addRow([
        task.name,
        phase.name,
        planned,
        0,
        { formula: `C${ws.rowCount}-D${ws.rowCount}` },
        { formula: `IF(C${ws.rowCount}>0,D${ws.rowCount}/C${ws.rowCount}*100,0)` },
        "",
      ]);
      styleDataRow(r, rowIdx % 2 === 0);
      r.getCell(3).numFmt = "#,##0.00 SAR";
      r.getCell(4).numFmt = "#,##0.00 SAR";
      r.getCell(5).numFmt = "#,##0.00 SAR";
      r.getCell(6).numFmt = "0.0%";
      rowIdx++;
    });
  });

  // Totals
  ws.addRow([]);
  const totalRow = ws.addRow(["TOTAL", "", totalPlanned, 0, { formula: `C${ws.rowCount}-D${ws.rowCount}` }, "", ""]);
  styleHeaderRow(totalRow, SUCCESS);
  totalRow.getCell(3).numFmt = "#,##0.00 SAR";
  totalRow.getCell(4).numFmt = "#,##0.00 SAR";
  totalRow.getCell(5).numFmt = "#,##0.00 SAR";

  return wb.xlsx.writeBuffer() as unknown as Promise<Uint8Array>;
}
