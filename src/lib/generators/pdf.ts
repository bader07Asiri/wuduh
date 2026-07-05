// ============================
// وضوح | Wuduh — PDF Generator (themes + identity + Arabic)
// ============================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { hexToRgb, getTheme } from "@/lib/themes";
import { shapeArabic, containsArabic, registerArabicFont } from "./arabic";
import type { GenOptions } from "./types";

type RGB = [number, number, number];

interface Palette {
  navyDark: RGB; navy: RGB; primary: RGB; accent: RGB;
  gold: RGB; success: RGB; text: RGB; textMid: RGB; textLight: RGB;
  bgLight: RGB; border: RGB; white: RGB;
}

function palette(opts?: GenOptions): Palette {
  const theme = getTheme(opts?.theme?.id ?? null);
  return {
    navyDark: hexToRgb(theme.dark), navy: hexToRgb(theme.dark),
    primary: hexToRgb(theme.primary), accent: hexToRgb(theme.accent),
    gold: [245, 158, 11], success: [16, 185, 129],
    text: [15, 23, 42], textMid: [51, 65, 85], textLight: [100, 116, 139],
    bgLight: hexToRgb(theme.light), border: [226, 232, 240], white: [255, 255, 255],
  };
}

interface Ctx { C: Palette; arabicFont: string | null; opts?: GenOptions; }

function createBasePDF(opts?: GenOptions): { doc: jsPDF; ctx: Ctx } {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.setLanguage("ar");
  const arabicFont = registerArabicFont(doc);
  return { doc, ctx: { C: palette(opts), arabicFont, opts } };
}

function T(doc: jsPDF, ctx: Ctx, text: string, x: number, y: number, options?: Parameters<jsPDF["text"]>[3]) {
  let out = text ?? "";
  if (ctx.arabicFont && containsArabic(out)) { out = shapeArabic(out); doc.setFont(ctx.arabicFont, "normal"); }
  doc.text(out, x, y, options);
}

function shapeCells(ctx: Ctx) {
  return (hookData: { cell: { text: string[] } }) => {
    if (!ctx.arabicFont) return;
    hookData.cell.text = hookData.cell.text.map((line) => containsArabic(line) ? shapeArabic(line) : line);
  };
}

function tableFont(ctx: Ctx): string { return ctx.arabicFont ?? "helvetica"; }

function addWatermark(doc: jsPDF, ctx: Ctx) {
  if (!ctx.opts?.branding?.showWatermark) return;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const txt = ctx.opts.branding.watermarkText || "وضوح";
  const shaped = ctx.arabicFont && containsArabic(txt) ? shapeArabic(txt) : txt;
  doc.saveGraphicsState();
  // @ts-expect-error GState available at runtime
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(60);
  if (ctx.arabicFont) doc.setFont(ctx.arabicFont, "normal"); else doc.setFont("helvetica", "bold");
  doc.text(shaped, W / 2, H / 2, { align: "center", angle: 35 });
  doc.restoreGraphicsState();
}

function addHeader(doc: jsPDF, ctx: Ctx, title: string, subtitle?: string, pageNum = 1) {
  const W = doc.internal.pageSize.getWidth();
  const C = ctx.C;
  const org = ctx.opts?.branding?.org;
  doc.setFillColor(...C.navyDark);
  doc.rect(0, 0, W, 35, "F");
  if (org?.name) {
    doc.setFontSize(12); doc.setTextColor(...C.white); T(doc, ctx, org.name, 12, 14);
    if (org.letterhead_text) { doc.setFontSize(7); doc.setTextColor(200, 210, 235); T(doc, ctx, org.letterhead_text, 12, 20); }
    else if (org.name_en) { doc.setFontSize(7); doc.setTextColor(200, 210, 235); doc.setFont("helvetica", "normal"); doc.text(org.name_en, 12, 20); }
  }
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(...C.white);
  doc.text(title, W - 15, 16, { align: "right" });
  if (subtitle) { doc.setFontSize(8); doc.setTextColor(200, 210, 235); T(doc, ctx, subtitle, W - 15, 24, { align: "right" }); }
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(180, 195, 225);
  doc.text(`Page ${pageNum}`, W - 10, 32, { align: "right" });
  addWatermark(doc, ctx);
}

function addFooter(doc: jsPDF, ctx: Ctx) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const C = ctx.C;
  const org = ctx.opts?.branding?.org;
  doc.setFillColor(...C.bgLight); doc.rect(0, H - 12, W, 12, "F");
  doc.setDrawColor(...C.border); doc.line(0, H - 12, W, H - 12);
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
  const footerLeft = org?.name ? org.name : "PMI/PMBOK Guide 7th Edition";
  T(doc, ctx, footerLeft, 15, H - 5);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString("en-GB"), W - 15, H - 5, { align: "right" });
}

function addSectionTitle(doc: jsPDF, ctx: Ctx, title: string, y: number): number {
  doc.setFillColor(...ctx.C.primary); doc.rect(15, y, 3, 7, "F");
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...ctx.C.navy);
  T(doc, ctx, title, 22, y + 5.5);
  return y + 14;
}

function addInfoBox(doc: jsPDF, ctx: Ctx, label: string, value: string, x: number, y: number, w: number, h: number) {
  doc.setFillColor(...ctx.C.bgLight); doc.setDrawColor(...ctx.C.border);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...ctx.C.textLight);
  T(doc, ctx, label, x + 4, y + 5);
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...ctx.C.text);
  T(doc, ctx, value, x + 4, y + 11);
}

function addSignatureBlock(doc: jsPDF, ctx: Ctx, y: number): number {
  const org = ctx.opts?.branding?.org;
  if (!ctx.opts?.branding?.includeSignature || !org) return y;
  const W = doc.internal.pageSize.getWidth();
  doc.setDrawColor(...ctx.C.border); doc.line(W - 80, y + 14, W - 15, y + 14);
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...ctx.C.text);
  if (org.signatory_name) T(doc, ctx, org.signatory_name, W - 15, y + 20, { align: "right" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...ctx.C.textMid);
  const line2 = [org.signatory_title, org.department].filter(Boolean).join(" — ");
  if (line2) T(doc, ctx, line2, W - 15, y + 26, { align: "right" });
  return y + 32;
}

export async function generateCharterPDF(data: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  const { doc, ctx } = createBasePDF(opts);
  const C = ctx.C; const W = doc.internal.pageSize.getWidth(); let y = 45;
  addHeader(doc, ctx, "Project Charter", `ميثاق المشروع — ${projectName}`); addFooter(doc, ctx);
  const boxes = [
    { label: "Project Name", value: (data.project_name as string) || projectName },
    { label: "Document No.", value: (data.project_number as string) || "WUD-001" },
    { label: "Version", value: (data.version as string) || "1.0" },
    { label: "Date", value: (data.preparation_date as string) || new Date().toISOString().split("T")[0] },
  ];
  const boxW = (W - 30) / 4;
  boxes.forEach((box, i) => addInfoBox(doc, ctx, box.label, box.value, 15 + i * (boxW + 2), y, boxW, 18));
  y += 28;
  y = addSectionTitle(doc, ctx, "1. Purpose & Description", y);
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid);
  const purposeLines = doc.splitTextToSize((data.purpose as string) || "", W - 30) as string[];
  purposeLines.forEach((ln, i) => T(doc, ctx, ln, 15, y + i * 5)); y += purposeLines.length * 5 + 5;
  const descLines = doc.splitTextToSize((data.description as string) || "", W - 30) as string[];
  descLines.forEach((ln, i) => T(doc, ctx, ln, 15, y + i * 5)); y += descLines.length * 5 + 8;
  y = addSectionTitle(doc, ctx, "2. Objectives", y);
  const objectives = (data.objectives as string[]) || [];
  objectives.forEach((obj) => {
    doc.setFillColor(...C.accent); doc.circle(W - 18, y + 1.5, 1.5, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid);
    const lines = doc.splitTextToSize(`${obj}`, W - 35) as string[];
    lines.forEach((ln, j) => T(doc, ctx, ln, W - 22, y + 3 + j * 5, { align: "right" }));
    y += lines.length * 5 + 3;
  });
  y += 5;
  y = addSectionTitle(doc, ctx, "3. Scope", y);
  autoTable(doc, {
    startY: y, head: [["In Scope", "Out of Scope"]],
    body: [[(data.scope_included as string[] || []).join("\n"), (data.scope_excluded as string[] || []).join("\n")]],
    styles: { font: tableFont(ctx), fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.navy, textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: (W - 30) / 2 }, 1: { cellWidth: (W - 30) / 2 } },
    margin: { left: 15, right: 15 }, didParseCell: shapeCells(ctx),
  });
  y = (doc as any).lastAutoTable.finalY + 10;
  if (y > 220) { doc.addPage(); addHeader(doc, ctx, "Project Charter", `ميثاق المشروع — ${projectName}`, 2); addFooter(doc, ctx); y = 45; }
  y = addSectionTitle(doc, ctx, "4. Key Stakeholders", y);
  const stakeholders = (data.stakeholders as Array<{name:string; role:string; influence:string; interest:string}>) || [];
  if (stakeholders.length > 0) {
    autoTable(doc, {
      startY: y, head: [["Name/Role", "Role", "Influence", "Interest"]],
      body: stakeholders.map(s => [s.name, s.role, s.influence, s.interest]),
      styles: { font: tableFont(ctx), fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: C.navy, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: C.bgLight }, margin: { left: 15, right: 15 }, didParseCell: shapeCells(ctx),
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }
  if (data.budget_summary) {
    y = addSectionTitle(doc, ctx, "5. Budget Summary", y);
    const budget = data.budget_summary as { total: number; currency: string; notes: string };
    addInfoBox(doc, ctx, "Total Budget", `${budget.total?.toLocaleString()} ${budget.currency}`, 15, y, 80, 18);
    if (budget.notes) { doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid); T(doc, ctx, budget.notes, 100, y + 9); }
    y += 28;
  }
  if (y > 220) { doc.addPage(); addHeader(doc, ctx, "Project Charter", `ميثاق المشروع — ${projectName}`, 3); addFooter(doc, ctx); y = 45; }
  y = addSectionTitle(doc, ctx, "6. High-Level Risks", y);
  const risks = (data.risks_summary as string[]) || [];
  risks.forEach((risk) => {
    doc.setFillColor(...C.gold); doc.rect(W - 17, y, 2, 4, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid);
    const lines = doc.splitTextToSize(`${risk}`, W - 35) as string[];
    lines.forEach((ln, j) => T(doc, ctx, ln, W - 20, y + 3 + j * 5, { align: "right" }));
    y += lines.length * 5 + 2;
  });
  y += 5;
  y = addSectionTitle(doc, ctx, "7. Success Criteria", y);
  const criteria = (data.success_criteria as string[]) || [];
  criteria.forEach((c) => {
    doc.setFillColor(...C.success); doc.circle(W - 18, y + 1.5, 1.5, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid);
    const lines = doc.splitTextToSize(`${c}`, W - 35) as string[];
    lines.forEach((ln, j) => T(doc, ctx, ln, W - 22, y + 3 + j * 5, { align: "right" }));
    y += lines.length * 5 + 2;
  });
  if (y > 210) { doc.addPage(); addHeader(doc, ctx, "Project Charter", `ميثاق المشروع — ${projectName}`, 4); addFooter(doc, ctx); y = 45; }
  y += 10;
  doc.setFillColor(...C.bgLight); doc.setDrawColor(...C.border);
  doc.roundedRect(15, y, W - 30, 30, 3, 3, "FD");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
  T(doc, ctx, "الاعتماد | Authorization", 20, y + 8);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid);
  doc.text("Project Sponsor: _______________________________", 20, y + 18);
  doc.text("Project Manager: _______________________________", 20, y + 26);
  doc.text("Date: ____________", W / 2, y + 26);
  y += 34; addSignatureBlock(doc, ctx, y);
  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export async function generateRiskRegisterPDF(data: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  const { doc, ctx } = createBasePDF(opts);
  const C = ctx.C; const W = doc.internal.pageSize.getWidth(); let y = 45;
  addHeader(doc, ctx, "Risk Register", `سجل المخاطر — ${projectName}`); addFooter(doc, ctx);
  const summary = data.summary as { total_risks: number; critical: number; high: number; medium: number; low: number } || {};
  const summBoxes = [
    { label: "Total Risks", value: String(summary.total_risks || 0) },
    { label: "Critical", value: String(summary.critical || 0) },
    { label: "High", value: String(summary.high || 0) },
    { label: "Medium", value: String(summary.medium || 0) },
    { label: "Low", value: String(summary.low || 0) },
  ];
  const bw = (W - 30) / 5;
  summBoxes.forEach((b, i) => addInfoBox(doc, ctx, b.label, b.value, 15 + i * (bw + 1), y, bw - 1, 18));
  y += 28;
  const risks = (data.risks as Array<{ id: string; risk_statement: string; category: string; probability_score: number; impact_score: number; risk_score: number; risk_level: string; response_strategy: string; owner: string; }>) || [];
  autoTable(doc, {
    startY: y, head: [["ID", "Risk Statement", "Cat.", "P", "I", "Score", "Level", "Strategy", "Owner"]],
    body: risks.map(r => [r.id, (r.risk_statement || "").substring(0, 60) + ((r.risk_statement || "").length > 60 ? "..." : ""), r.category, r.probability_score, r.impact_score, r.risk_score, r.risk_level, r.response_strategy, r.owner]),
    styles: { font: tableFont(ctx), fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: C.navy, textColor: 255, fontStyle: "bold", fontSize: 7 },
    alternateRowStyles: { fillColor: C.bgLight },
    columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 55 }, 2: { cellWidth: 16 }, 3: { cellWidth: 8, halign: "center" }, 4: { cellWidth: 8, halign: "center" }, 5: { cellWidth: 12, halign: "center" }, 6: { cellWidth: 16 }, 7: { cellWidth: 18 }, 8: { cellWidth: 20 } },
    didParseCell: (hookData) => {
      if (ctx.arabicFont) hookData.cell.text = hookData.cell.text.map((line) => containsArabic(line) ? shapeArabic(line) : line);
      if (hookData.column.index === 5 && hookData.section === "body") {
        const score = Number(hookData.cell.raw);
        if (score >= 15) hookData.cell.styles.fillColor = [254, 202, 202];
        else if (score >= 8) hookData.cell.styles.fillColor = [254, 215, 170];
        else if (score >= 4) hookData.cell.styles.fillColor = [254, 249, 195];
        else hookData.cell.styles.fillColor = [167, 243, 208];
      }
    },
    margin: { left: 15, right: 15 },
  });
  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export async function generateProjectPlanPDF(agendaData: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  const { doc, ctx } = createBasePDF(opts);
  const C = ctx.C; const W = doc.internal.pageSize.getWidth(); let y = 45; let pageNum = 1;
  addHeader(doc, ctx, "Project Management Plan", `خطة إدارة المشروع — ${projectName}`, pageNum); addFooter(doc, ctx);
  y = addSectionTitle(doc, ctx, "1. Project Overview", y);
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textMid);
  const overviewLines = doc.splitTextToSize((agendaData.project_overview as string) || "", W - 30) as string[];
  overviewLines.forEach((ln, i) => T(doc, ctx, ln, 15, y + i * 5)); y += overviewLines.length * 5 + 6;
  doc.setFillColor(...C.primary); doc.roundedRect(15, y, 70, 10, 2, 2, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text(`Methodology: ${agendaData.methodology || "Predictive"}`, 50, y + 7, { align: "center" });
  doc.setFillColor(...C.gold); doc.roundedRect(90, y, 70, 10, 2, 2, "F"); doc.setTextColor(30, 30, 30);
  doc.text(`Est. Effort: ${agendaData.estimated_effort_hours || 0} hrs`, 125, y + 7, { align: "center" });
  y += 20;
  y = addSectionTitle(doc, ctx, "2. Project Phases", y);
  const phases = (agendaData.phases as Array<{ name: string; start_week: number; end_week: number; description: string; deliverables: string[] }>) || [];
  autoTable(doc, {
    startY: y, head: [["Phase", "Start Wk", "End Wk", "Description", "Key Deliverables"]],
    body: phases.map(p => [p.name, `Wk ${p.start_week}`, `Wk ${p.end_week}`, (p.description || "").substring(0, 50), (p.deliverables || []).slice(0, 2).join(", ")]),
    styles: { font: tableFont(ctx), fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.navy, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.bgLight },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 16, halign: "center" }, 2: { cellWidth: 16, halign: "center" }, 3: { cellWidth: 65 }, 4: { cellWidth: 50 } },
    margin: { left: 15, right: 15 }, didParseCell: shapeCells(ctx),
  });
  y = (doc as any).lastAutoTable.finalY + 12;
  doc.addPage(); pageNum++;
  addHeader(doc, ctx, "Project Management Plan", `خطة إدارة المشروع — ${projectName}`, pageNum); addFooter(doc, ctx); y = 45;
  y = addSectionTitle(doc, ctx, "3. Key Milestones", y);
  const milestones = (agendaData.key_milestones as Array<{ name: string; week: number; description: string; success_criteria: string }>) || [];
  autoTable(doc, {
    startY: y, head: [["Milestone", "Week", "Description", "Success Criteria"]],
    body: milestones.map(m => [m.name, `Wk ${m.week}`, m.description, m.success_criteria]),
    styles: { font: tableFont(ctx), fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.navy, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.bgLight },
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 15, halign: "center" }, 2: { cellWidth: 60 }, 3: { cellWidth: 60 } },
    margin: { left: 15, right: 15 }, didParseCell: shapeCells(ctx),
  });
  y = (doc as any).lastAutoTable.finalY + 12;
  y = addSectionTitle(doc, ctx, "4. Key Performance Indicators (KPIs)", y);
  const kpis = (agendaData.kpis as Array<{ name: string; target: string; measurement_method: string; frequency: string }>) || [];
  autoTable(doc, {
    startY: y, head: [["KPI", "Target", "Measurement Method", "Frequency"]],
    body: kpis.map(k => [k.name, k.target, k.measurement_method, k.frequency]),
    styles: { font: tableFont(ctx), fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.success, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    margin: { left: 15, right: 15 }, didParseCell: shapeCells(ctx),
  });
  return doc.output("arraybuffer") as unknown as Uint8Array;
}
