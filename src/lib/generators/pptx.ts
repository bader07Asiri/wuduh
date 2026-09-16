// ============================
// وضوح | Wuduh — PPTX Generator (عربي RTL + تسميات موحّدة + ألوان مخصصة)
// ============================

import PptxGenJS from "pptxgenjs";
import { getTheme } from "@/lib/themes";
import type { GenOptions, DocLang } from "./types";
import { L, isRTL, docDate, type DocStrings } from "./labels";

// Brand colors
let NAVY    = "0F2057";
let PRIMARY = "2563EB";
let ACCENT  = "0EA5E9";
const GOLD    = "F59E0B";
const SUCCESS = "10B981";
const DANGER  = "EF4444";
const BG_LIGHT = "F8FAFC";
const BORDER  = "E2E8F0";
const TEXT    = "0F172A";
const TEXT_MID = "334155";
const TEXT_LIGHT = "64748B";
const WHITE   = "FFFFFF";

let BRAND = "";
let BRAND_INITIAL = "";
let WM = false;
let WM_TEXT = "";
let LANG: DocLang = "ar";
let RTL = true;
let S: DocStrings = L("ar");

function applyTheme(opts?: GenOptions) {
  const t = opts?.theme ?? getTheme(null);
  NAVY = (t.dark || "#0F2057").replace("#", "");
  PRIMARY = (t.primary || "#2563EB").replace("#", "");
  ACCENT = (t.accent || "#0EA5E9").replace("#", "");
  const org = opts?.branding?.org ?? null;
  BRAND = org?.name ?? "";
  BRAND_INITIAL = BRAND ? Array.from(BRAND)[0] : "و";
  WM = !!opts?.branding?.showWatermark;
  WM_TEXT = opts?.branding?.watermarkText ?? "وضوح";
  LANG = opts?.lang ?? "ar";
  RTL = isRTL(LANG);
  S = L(LANG);
}

const ar = (arText: string, enText: string) => (RTL ? arText : enText);
const bodyAlign = (): "right" | "left" => (RTL ? "right" : "left");
const footerText = () => (WM ? WM_TEXT + "  •  " : "") + (BRAND ? BRAND + "  •  " : "") + S.standard;

// ============================
// Helpers
// ============================
function createPptx(): PptxGenJS {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.rtlMode = RTL;
  pptx.title = BRAND || "وضوح";
  pptx.subject = S.standard;
  pptx.author = BRAND || "Wuduh";
  return pptx;
}

function addCoverSlide(pptx: PptxGenJS, title: string, subtitle: string, projectName: string) {
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: "100%", fill: { color: ACCENT } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 0.4, w: 1.2, h: 1.2, fill: { color: PRIMARY }, line: { color: ACCENT, width: 2 } });
  slide.addText(BRAND_INITIAL, { x: 0.5, y: 0.4, w: 1.2, h: 1.2, fontSize: 36, bold: true, color: WHITE, align: "center", valign: "middle" });
  slide.addText(BRAND || "وضوح", { x: 2, y: 0.4, w: 5, h: 0.6, fontSize: 22, bold: true, color: ACCENT, rtlMode: RTL });
  slide.addText(S.compliant, { x: 2, y: 0.95, w: 6, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, rtlMode: RTL });
  slide.addText(title, { x: 0.5, y: 2.2, w: 12.5, h: 1.2, fontSize: 40, bold: true, color: WHITE, align: "center", rtlMode: RTL });
  slide.addText(projectName, { x: 0.5, y: 3.5, w: 12.5, h: 0.7, fontSize: 22, color: ACCENT, align: "center", rtlMode: RTL });
  if (subtitle) slide.addText(subtitle, { x: 0.5, y: 4.3, w: 12.5, h: 0.5, fontSize: 14, italic: true, color: TEXT_LIGHT, align: "center", rtlMode: RTL });
  slide.addText(docDate(LANG), { x: 0.5, y: 6.5, w: 12.5, h: 0.4, fontSize: 11, color: TEXT_LIGHT, align: "center" });
  slide.addShape(pptx.ShapeType.line, { x: 3, y: 6.0, w: 7.5, h: 0, line: { color: PRIMARY, width: 1.5 } });
}

function addSlideHeader(slide: any, pptx: PptxGenJS, title: string) {
  slide.background = { color: WHITE };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.7, fill: { color: NAVY } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.7, w: "100%", h: 0.05, fill: { color: ACCENT } });
  slide.addText(BRAND || "وضوح", { x: 0.2, y: 0.05, w: 3, h: 0.5, fontSize: 12, color: ACCENT, bold: true, align: RTL ? "left" : "left", rtlMode: RTL });
  slide.addText(title, { x: 3.5, y: 0.08, w: 8.5, h: 0.55, fontSize: 18, bold: true, color: WHITE, align: RTL ? "right" : "left", rtlMode: RTL });
}

function slideTitle(slide: any, title: string) {
  slide.addText(title, { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY, align: bodyAlign(), rtlMode: RTL });
}

// ============================
// 1. عرض انطلاق المشروع
// ============================
export async function generateKickoffPPTX(agendaData: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  applyTheme(opts);
  const pptx = createPptx();

  addCoverSlide(pptx, ar("اجتماع انطلاق المشروع", "Project Kickoff Meeting"), ar("انطلاقة المشروع", "Kickoff"), projectName);

  // جدول الأعمال
  const agendaSlide = pptx.addSlide();
  addSlideHeader(agendaSlide, pptx, ar("جدول الأعمال", "Meeting Agenda"));
  slideTitle(agendaSlide, ar("جدول أعمال اليوم", "Today's Agenda"));

  const agendaItems = RTL ? [
    "1. نظرة عامة على المشروع وأهدافه",
    "2. النطاق والمخرجات",
    "3. الجدول الزمني للمشروع",
    "4. الفريق والمسؤوليات",
    "5. نظرة على الميزانية",
    "6. المخاطر وإجراءات التخفيف",
    "7. خطة التواصل",
    "8. الخطوات التالية والأسئلة",
  ] : [
    "1. Project Overview & Objectives", "2. Scope & Deliverables", "3. Project Timeline",
    "4. Team & Responsibilities", "5. Budget Overview", "6. Risks & Mitigation",
    "7. Communication Plan", "8. Next Steps & Q&A",
  ];
  agendaItems.forEach((item, i) => {
    agendaSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (i % 2) * 6.5, y: 1.6 + Math.floor(i / 2) * 1.2, w: 6, h: 1.0,
      fill: { color: i % 2 === 0 ? "EFF6FF" : "F0FDF4" },
      line: { color: i % 2 === 0 ? PRIMARY : SUCCESS, width: 2 },
    });
    agendaSlide.addText(item, {
      x: 0.7 + (i % 2) * 6.5, y: 1.65 + Math.floor(i / 2) * 1.2, w: 5.6, h: 0.9,
      fontSize: 12, color: TEXT, valign: "middle", rtlMode: RTL, align: bodyAlign(),
    });
  });

  // نظرة عامة
  const overviewSlide = pptx.addSlide();
  addSlideHeader(overviewSlide, pptx, S.overview);
  slideTitle(overviewSlide, S.overview);
  const overview = (agendaData.project_overview as string) || "";
  overviewSlide.addText(overview, { x: 0.5, y: 1.6, w: 12.5, h: 2.0, fontSize: 13, color: TEXT_MID, wrap: true, rtlMode: RTL, align: bodyAlign() });

  const infoBoxes = [
    { label: S.methodology, value: String(agendaData.methodology || "—"), color: PRIMARY },
    { label: S.duration, value: `${agendaData.duration_weeks || agendaData.duration || 0} ${S.weeks}`, color: SUCCESS },
    { label: S.teamSize, value: `${agendaData.team_size_recommended || agendaData.team_size || 0} ${S.members}`, color: ACCENT },
    { label: S.estEffort, value: `${agendaData.estimated_effort_hours || 0} ${S.hours}`, color: GOLD },
  ];
  infoBoxes.forEach((box, i) => {
    overviewSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5 + i * 3.2, y: 3.8, w: 3.0, h: 1.6, fill: { color: "FFFFFF" }, line: { color: box.color, width: 3 } });
    overviewSlide.addShape(pptx.ShapeType.rect, { x: 0.5 + i * 3.2, y: 3.8, w: 3.0, h: 0.4, fill: { color: box.color } });
    overviewSlide.addText(box.label, { x: 0.5 + i * 3.2, y: 3.82, w: 3.0, h: 0.36, fontSize: 10, bold: true, color: WHITE, align: "center", rtlMode: RTL });
    overviewSlide.addText(box.value, { x: 0.5 + i * 3.2, y: 4.3, w: 3.0, h: 1.0, fontSize: 16, bold: true, color: box.color, align: "center", valign: "middle", rtlMode: RTL });
  });

  // المراحل
  const objSlide = pptx.addSlide();
  addSlideHeader(objSlide, pptx, S.phases);
  slideTitle(objSlide, S.phases);
  const phases = (agendaData.phases as Array<{name:string;description:string}>) || [];
  phases.slice(0, 6).forEach((phase, i) => {
    objSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5 + (i % 3) * 4.4, y: 1.7 + Math.floor(i / 3) * 2.0, w: 4.1, h: 1.8, fill: { color: BG_LIGHT }, line: { color: ACCENT, width: 1.5 } });
    objSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5 + (i % 3) * 4.4, y: 1.7 + Math.floor(i / 3) * 2.0, w: 4.1, h: 0.45, fill: { color: PRIMARY } });
    objSlide.addText(`${S.phase} ${i + 1}: ${phase.name}`, { x: 0.6 + (i % 3) * 4.4, y: 1.72 + Math.floor(i / 3) * 2.0, w: 3.9, h: 0.4, fontSize: 10, bold: true, color: WHITE, rtlMode: RTL, align: bodyAlign() });
    objSlide.addText((phase.description || "").substring(0, 120), { x: 0.6 + (i % 3) * 4.4, y: 2.2 + Math.floor(i / 3) * 2.0, w: 3.9, h: 1.2, fontSize: 9, color: TEXT_MID, wrap: true, rtlMode: RTL, align: bodyAlign() });
  });

  // الجدول الزمني
  const timelineSlide = pptx.addSlide();
  addSlideHeader(timelineSlide, pptx, ar("الجدول الزمني", "Project Timeline"));
  slideTitle(timelineSlide, ar("الجدول الزمني للمشروع", "Project Timeline"));
  const allPhases = (agendaData.phases as Array<{name:string;start_week:number;end_week:number}>) || [];
  const totalWeeks = Number(agendaData.duration_weeks) || 12;
  const barWidth = 11.5, barX = 0.8, barY = 1.7, phaseHeight = 0.55;
  const colors = [PRIMARY, SUCCESS, ACCENT, GOLD, "8B5CF6", DANGER];
  allPhases.forEach((phase, i) => {
    const x = barX + ((phase.start_week - 1) / totalWeeks) * barWidth;
    const w = ((phase.end_week - phase.start_week + 1) / totalWeeks) * barWidth;
    const y = barY + i * (phaseHeight + 0.15);
    timelineSlide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: phaseHeight, fill: { color: colors[i % colors.length] }, line: { color: colors[i % colors.length], width: 0 } });
    timelineSlide.addText(phase.name, { x, y, w, h: phaseHeight, fontSize: 9, bold: true, color: WHITE, align: "center", valign: "middle", rtlMode: RTL });
  });
  for (let w = 1; w <= totalWeeks; w += 2) {
    timelineSlide.addText(`${ar("أ", "W")}${w}`, { x: barX + ((w - 1) / totalWeeks) * barWidth - 0.1, y: 1.4, w: 0.5, h: 0.3, fontSize: 8, color: TEXT_LIGHT, align: "center" });
  }

  // المخاطر
  const teamSlide = pptx.addSlide();
  addSlideHeader(teamSlide, pptx, ar("المخاطر الرئيسية", "Key Risks"));
  slideTitle(teamSlide, ar("المخاطر الرئيسية", "Key Risks"));
  const risks = ((agendaData.risk_summary || agendaData.risks) as Array<{risk?:string;name?:string;probability?:string;impact?:string;response_strategy?:string;mitigation_action?:string;response?:string}>) || [];
  risks.slice(0, 6).forEach((risk, i) => {
    const isHigh = /high|عالي|حرج/i.test(`${risk.probability || ""}${risk.impact || ""}`);
    const isMed = /medium|متوسط/i.test(`${risk.probability || ""}${risk.impact || ""}`);
    teamSlide.addShape(pptx.ShapeType.rect, { x: RTL ? 12.8 : 0.5, y: 1.7 + i * 0.75, w: 0.2, h: 0.55, fill: { color: isHigh ? DANGER : isMed ? GOLD : SUCCESS } });
    const rname = risk.risk || risk.name || "";
    const rresp = risk.response_strategy || risk.mitigation_action || risk.response || "";
    teamSlide.addText(`${rname}${rresp ? ` — ${ar("الاستجابة", "Response")}: ${rresp}` : ""}`, { x: RTL ? 0.5 : 0.85, y: 1.75 + i * 0.75, w: 11.9, h: 0.5, fontSize: 11, color: TEXT, rtlMode: RTL, align: bodyAlign() });
  });

  // الخطوات التالية
  const nextSlide = pptx.addSlide();
  addSlideHeader(nextSlide, pptx, ar("الخطوات التالية", "Next Steps"));
  slideTitle(nextSlide, ar("الخطوات التالية الفورية", "Immediate Next Steps"));
  const steps = (agendaData.next_steps as string[]) || (RTL ? [
    "مراجعة واعتماد ميثاق المشروع",
    "استكمال إسناد أدوار الفريق ومصفوفة المسؤوليات (RACI)",
    "تهيئة أدوات إدارة المشروع وقنوات التواصل",
    "عقد جلسات التخطيط التفصيلي مع أصحاب المصلحة",
    "بدء أنشطة المرحلة الأولى وفق الجدول المعتمد",
  ] : [
    "Review and approve Project Charter",
    "Finalize team assignments and RACI matrix",
    "Set up project management tools and communication channels",
    "Conduct detailed planning sessions with all stakeholders",
    "Begin Phase 1 activities per the approved schedule",
  ]);
  steps.slice(0, 5).forEach((step, i) => {
    nextSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.7 + i * 0.95, w: 12.5, h: 0.8, fill: { color: i === 0 ? "EFF6FF" : BG_LIGHT }, line: { color: i === 0 ? PRIMARY : BORDER, width: i === 0 ? 2 : 1 } });
    nextSlide.addShape(pptx.ShapeType.ellipse, { x: RTL ? 12.35 : 0.6, y: 1.77 + i * 0.95, w: 0.55, h: 0.55, fill: { color: i === 0 ? PRIMARY : TEXT_LIGHT } });
    nextSlide.addText(String(i + 1), { x: RTL ? 12.35 : 0.6, y: 1.77 + i * 0.95, w: 0.55, h: 0.55, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle" });
    nextSlide.addText(step, { x: RTL ? 0.7 : 1.3, y: 1.77 + i * 0.95, w: 11.5, h: 0.6, fontSize: 12, color: i === 0 ? PRIMARY : TEXT, valign: "middle", rtlMode: RTL, align: bodyAlign() });
  });

  // الشكر
  const endSlide = pptx.addSlide();
  endSlide.background = { color: NAVY };
  endSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: "100%", fill: { color: ACCENT } });
  endSlide.addText(ar("شكراً لكم", "Thank You"), { x: 0.5, y: 2.5, w: 12.5, h: 1.5, fontSize: 52, bold: true, color: WHITE, align: "center", rtlMode: RTL });
  endSlide.addText(ar("أسئلة ونقاش", "Questions & Discussion"), { x: 0.5, y: 4.1, w: 12.5, h: 0.6, fontSize: 22, color: ACCENT, align: "center", rtlMode: RTL });
  endSlide.addText(footerText(), { x: 0.5, y: 5.8, w: 12.5, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, align: "center", rtlMode: RTL });

  return pptx.write({ outputType: "arraybuffer" }) as Promise<Uint8Array>;
}

// ============================
// 2. عرض أصحاب المصلحة
// ============================
export async function generateStakeholderPPTX(agendaData: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  applyTheme(opts);
  const pptx = createPptx();

  addCoverSlide(pptx, ar("إحاطة أصحاب المصلحة", "Stakeholder Briefing"), ar("إحاطة تنفيذية", "Briefing"), projectName);

  const execSlide = pptx.addSlide();
  addSlideHeader(execSlide, pptx, ar("الملخص التنفيذي", "Executive Summary"));
  slideTitle(execSlide, ar("الملخص التنفيذي", "Executive Summary"));
  const kpis = (agendaData.kpis as Array<{name:string;target:string}>) || [];
  kpis.slice(0, 4).forEach((kpi, i) => {
    execSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5 + (i % 2) * 6.5, y: 1.7 + Math.floor(i / 2) * 2.0, w: 6.0, h: 1.8, fill: { color: "EFF6FF" }, line: { color: PRIMARY, width: 2 } });
    execSlide.addText(kpi.name, { x: 0.7 + (i % 2) * 6.5, y: 1.8 + Math.floor(i / 2) * 2.0, w: 5.6, h: 0.5, fontSize: 11, bold: true, color: NAVY, rtlMode: RTL, align: bodyAlign() });
    execSlide.addText(kpi.target, { x: 0.7 + (i % 2) * 6.5, y: 2.3 + Math.floor(i / 2) * 2.0, w: 5.6, h: 0.9, fontSize: 18, bold: true, color: PRIMARY, align: "center", valign: "middle", rtlMode: RTL });
  });

  const valueSlide = pptx.addSlide();
  addSlideHeader(valueSlide, pptx, ar("القيمة والفوائد", "Value & Benefits"));
  slideTitle(valueSlide, ar("القيمة والفوائد للأعمال", "Business Value & Benefits"));
  const factors = (agendaData.critical_success_factors as string[]) || [];
  factors.slice(0, 6).forEach((factor, i) => {
    valueSlide.addShape(pptx.ShapeType.ellipse, { x: RTL ? 12.8 : 0.5, y: 1.7 + i * 0.75, w: 0.5, h: 0.5, fill: { color: SUCCESS } });
    valueSlide.addText("✓", { x: RTL ? 12.8 : 0.5, y: 1.7 + i * 0.75, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
    valueSlide.addText(factor, { x: RTL ? 0.5 : 1.2, y: 1.72 + i * 0.75, w: 12, h: 0.55, fontSize: 12, color: TEXT, rtlMode: RTL, align: bodyAlign() });
  });

  const endSlide = pptx.addSlide();
  endSlide.background = { color: NAVY };
  endSlide.addText(ar("أسئلتكم؟", "Questions?"), { x: 0.5, y: 2.8, w: 12.5, h: 1.5, fontSize: 52, bold: true, color: WHITE, align: "center", rtlMode: RTL });
  endSlide.addText(footerText(), { x: 0.5, y: 6.0, w: 12.5, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, align: "center", rtlMode: RTL });

  return pptx.write({ outputType: "arraybuffer" }) as Promise<Uint8Array>;
}

// ============================
// 3. عرض تقدّم المشروع
// ============================
export async function generateProgressReportPPTX(reportData: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  applyTheme(opts);
  const pptx = createPptx();
  // مخطّط تقرير الحالة من الذكاء يأتي داخل report_template — نفكّه هنا مع fallback
  const rt = ((reportData.report_template as Record<string, unknown>) ?? reportData) as Record<string, unknown>;
  const overall = (rt.overall_status as { status?: string; summary?: string }) ?? {};

  addCoverSlide(pptx, ar("تقرير التقدّم", "Progress Report"), ar("تقرير دوري", "Status"), projectName);

  const dashSlide = pptx.addSlide();
  addSlideHeader(dashSlide, pptx, ar("لوحة الحالة", "Status Dashboard"));
  slideTitle(dashSlide, ar("لوحة حالة المشروع", "Project Status Dashboard"));
  const statusItems = [
    { label: ar("الحالة العامة", "Overall"), status: overall.status || ar("ضمن الخطة", "On Track"), color: SUCCESS },
    { label: ar("الميزانية", "Budget"), status: (reportData.budget_status as string) || ar("ضمن الميزانية", "On Budget"), color: SUCCESS },
    { label: ar("النطاق", "Scope"), status: (reportData.scope_status as string) || ar("مُنضبط", "Controlled"), color: ACCENT },
    { label: ar("الجودة", "Quality"), status: (reportData.quality_status as string) || ar("مطابق للمعايير", "Meeting Standards"), color: PRIMARY },
  ];
  statusItems.forEach((item, i) => {
    dashSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5 + i * 3.2, y: 1.7, w: 3.0, h: 2.0, fill: { color: "FFFFFF" }, line: { color: item.color, width: 3 } });
    dashSlide.addShape(pptx.ShapeType.rect, { x: 0.5 + i * 3.2, y: 1.7, w: 3.0, h: 0.45, fill: { color: item.color } });
    dashSlide.addText(item.label, { x: 0.5 + i * 3.2, y: 1.72, w: 3.0, h: 0.4, fontSize: 11, bold: true, color: WHITE, align: "center", rtlMode: RTL });
    dashSlide.addText("●", { x: 0.5 + i * 3.2, y: 2.2, w: 3.0, h: 0.8, fontSize: 28, color: item.color, align: "center" });
    dashSlide.addText(item.status, { x: 0.5 + i * 3.2, y: 3.0, w: 3.0, h: 0.6, fontSize: 10, color: TEXT_MID, align: "center", rtlMode: RTL });
  });
  const summary = (rt.executive_summary as string) || overall.summary || "";
  if (summary) dashSlide.addText(summary, { x: 0.5, y: 4.0, w: 12.5, h: 1.5, fontSize: 12, color: TEXT_MID, wrap: true, rtlMode: RTL, align: bodyAlign() });

  const accompSlide = pptx.addSlide();
  addSlideHeader(accompSlide, pptx, ar("الإنجازات والخطوات التالية", "Accomplishments & Next Steps"));
  slideTitle(accompSlide, ar("أبرز إنجازات الفترة", "This Period Highlights"));
  const accomplishments = (rt.accomplishments as string[]) || [];
  accomplishments.slice(0, 4).forEach((item, i) => {
    accompSlide.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.7 + i * 1.1, w: 12.5, h: 0.9, fill: { color: BG_LIGHT }, line: { color: SUCCESS, width: 1.5 } });
    accompSlide.addText("✓", { x: RTL ? 12.3 : 0.6, y: 1.75 + i * 1.1, w: 0.5, h: 0.8, fontSize: 14, bold: true, color: SUCCESS, valign: "middle" });
    accompSlide.addText(item, { x: RTL ? 0.6 : 1.2, y: 1.75 + i * 1.1, w: 11.6, h: 0.8, fontSize: 12, color: TEXT, valign: "middle", rtlMode: RTL, align: bodyAlign() });
  });

  const endSlide = pptx.addSlide();
  endSlide.background = { color: NAVY };
  endSlide.addText(ar("تقرير التقدّم", "Progress Report"), { x: 0.5, y: 2.5, w: 12.5, h: 1.5, fontSize: 48, bold: true, color: WHITE, align: "center", rtlMode: RTL });
  endSlide.addText(projectName, { x: 0.5, y: 4.1, w: 12.5, h: 0.6, fontSize: 22, color: ACCENT, align: "center", rtlMode: RTL });
  endSlide.addText(footerText(), { x: 0.5, y: 6.0, w: 12.5, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, align: "center", rtlMode: RTL });

  return pptx.write({ outputType: "arraybuffer" }) as Promise<Uint8Array>;
}
