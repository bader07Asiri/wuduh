// ============================
// وضوح | Wuduh — DOCX Generator (عربي RTL + تسميات موحّدة + ألوان مخصصة)
// ============================

import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, Header, Footer, PageNumber, ImageRun,
  TableLayoutType, VerticalAlign, PageBreak,
  convertInchesToTwip,
} from "docx";
import { getTheme } from "@/lib/themes";
import type { GenOptions, DocLang } from "./types";
import { L, isRTL, docDate, type DocStrings } from "./labels";

// Brand colors as hex
let NAVY    = "0F2057";
let PRIMARY = "2563EB";
let ACCENT  = "0EA5E9";
const BG_LIGHT = "F8FAFC";
const TEXT    = "0F172A";
const TEXT_MID = "334155";
const TEXT_LIGHT = "64748B";
const WHITE   = "FFFFFF";

// حالة الثيم واللغة والهوية (تُضبط لكل مستند عبر applyTheme)
let BRAND = "";
let WM = false;
let WM_TEXT = "";
let LANG: DocLang = "ar";
let RTL = true;
let S: DocStrings = L("ar");

function applyTheme(opts?: GenOptions) {
  // نستخدم كائن الثيم مباشرة (يدعم الألوان المخصّصة) بدل البحث بالمعرّف
  const t = opts?.theme ?? getTheme(null);
  NAVY = (t.dark || "#0F2057").replace("#", "");
  PRIMARY = (t.primary || "#2563EB").replace("#", "");
  ACCENT = (t.accent || "#0EA5E9").replace("#", "");
  const org = opts?.branding?.org ?? null;
  BRAND = org?.name ?? "";
  WM = !!opts?.branding?.showWatermark;
  WM_TEXT = opts?.branding?.watermarkText ?? "وضوح";
  LANG = opts?.lang ?? "ar";
  RTL = isRTL(LANG);
  S = L(LANG);
}

const dir = () => (RTL ? AlignmentType.RIGHT : AlignmentType.LEFT);

// ============================
// Helpers (RTL-aware)
// ============================
function run(text: string, opts: { size?: number; bold?: boolean; color?: string; italics?: boolean } = {}): TextRun {
  return new TextRun({
    text: text ?? "",
    size: opts.size ?? 20,
    bold: opts.bold,
    color: opts.color ?? TEXT,
    italics: opts.italics,
    rightToLeft: RTL,
  });
}

function headerParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: (BRAND ? BRAND + "  •  " : "") + S.standard, size: 16, color: TEXT_LIGHT, rightToLeft: RTL }),
      new TextRun({ text: `\t${text}`, size: 16, color: TEXT_LIGHT, rightToLeft: RTL }),
    ],
    bidirectional: RTL,
    alignment: dir(),
    tabStops: [{ type: RTL ? "left" : "right", position: convertInchesToTwip(6.5) }],
  });
}

function footerParagraph(): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: (WM ? WM_TEXT + "  •  " : "") + (BRAND ? BRAND + "  •  " : "") + S.standard, size: 16, color: TEXT_LIGHT, rightToLeft: RTL }),
      new TextRun({ text: `\t${S.page} `, size: 16, color: TEXT_LIGHT, rightToLeft: RTL }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: TEXT_LIGHT }),
      new TextRun({ text: ` ${LANG === "en" ? "of" : "من"} `, size: 16, color: TEXT_LIGHT, rightToLeft: RTL }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: TEXT_LIGHT }),
    ],
    bidirectional: RTL,
    alignment: dir(),
    tabStops: [{ type: RTL ? "left" : "right", position: convertInchesToTwip(6.5) }],
  });
}

// شعار وضوح الأبيض (يُحمَّل مرة واحدة) — للغلاف الداكن
let _logo: Buffer | null | undefined;
function getLogo(): Buffer | null {
  if (_logo !== undefined) return _logo;
  try {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const fs = require("fs");
    const path = require("path");
    _logo = fs.readFileSync(path.join(process.cwd(), "public", "wuduh-assets", "logo-full.png")) as Buffer;
  } catch {
    _logo = null;
  }
  return _logo!;
}

// تلوين خلايا الجداول حسب المعنى (RACI / مستويات المخاطر) — للخلايا القصيرة فقط
function cellTint(text: string): string | null {
  const t = (text || "").trim();
  if (t.length > 14) return null;
  if (/^(r\/a|a\/r|r)$/i.test(t)) return "DCFCE7";
  if (/^a$/i.test(t)) return "DBEAFE";
  if (/^c$/i.test(t)) return "FEF9C3";
  if (/^i$/i.test(t)) return "EEF2F7";
  if (/حرج|critical/i.test(t)) return "FECACA";
  if (/عال[ٍيِ]|high/i.test(t)) return "FED7AA";
  if (/متوسط|medium/i.test(t)) return "FEF9C3";
  if (/منخفض|low/i.test(t)) return "DCFCE7";
  return null;
}

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } as const;
const NO_BORDERS = {
  top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
  insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
};

function sectionHeading(text: string): Paragraph {
  const m = text.match(/^\s*(\d+)\.\s*(.*)$/);
  const children = m
    ? [
        new TextRun({ text: `  ${m[1]}  `, bold: true, color: WHITE, size: 24, shading: { type: ShadingType.SOLID, fill: PRIMARY, color: "auto" }, rightToLeft: RTL }),
        new TextRun({ text: "  ", size: 24 }),
        new TextRun({ text: m[2], size: 28, bold: true, color: NAVY, rightToLeft: RTL }),
      ]
    : [new TextRun({ text, size: 28, bold: true, color: PRIMARY, rightToLeft: RTL })];
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: RTL,
    alignment: dir(),
    children,
    spacing: { before: 400, after: 140 },
    border: { bottom: { color: ACCENT, size: 8, style: BorderStyle.SINGLE, space: 6 } },
  });
}

function subHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: RTL,
    alignment: dir(),
    children: [new TextRun({ text, size: 22, bold: true, color: NAVY, rightToLeft: RTL })],
    spacing: { before: 300, after: 80 },
  });
}

function bodyText(text: string): Paragraph {
  return new Paragraph({
    bidirectional: RTL,
    alignment: dir(),
    children: [run(text, { size: 20, color: TEXT_MID })],
    spacing: { after: 100 },
  });
}

function bulletItem(text: string): Paragraph {
  return new Paragraph({
    bidirectional: RTL,
    alignment: dir(),
    children: [run(text, { size: 20, color: TEXT_MID })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

function centerTitle(text: string, size: number, color: string, spacing?: { before?: number; after?: number }): Paragraph {
  return new Paragraph({
    bidirectional: RTL,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, size, bold: true, color, rightToLeft: RTL })],
    spacing,
  });
}

function cellPara(text: string, o: { size?: number; bold?: boolean; color?: string } = {}): Paragraph {
  return new Paragraph({
    bidirectional: RTL,
    alignment: dir(),
    children: [run(text || "—", o)],
  });
}

function infoRow(label: string, value: string): TableRow {
  const labelCell = new TableCell({
    children: [cellPara(label, { size: 18, bold: true, color: NAVY })],
    shading: { fill: "EFF6FF", type: ShadingType.CLEAR, color: "auto" },
    width: { size: 30, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 80 },
  });
  const valueCell = new TableCell({
    children: [cellPara(value, { size: 18, color: TEXT })],
    width: { size: 70, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 80 },
  });
  // في RTL نضع خانة التسمية على اليمين
  return new TableRow({ children: RTL ? [valueCell, labelCell] : [labelCell, valueCell] });
}

function makeTable(headers: string[], rows: string[][]): Table {
  // في RTL نعكس ترتيب الأعمدة بصرياً لتُقرأ من اليمين لليسار
  const H = RTL ? [...headers].reverse() : headers;
  const R = RTL ? rows.map(r => [...r].reverse()) : rows;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        tableHeader: true,
        children: H.map(h =>
          new TableCell({
            children: [cellPara(h, { size: 18, bold: true, color: WHITE })],
            shading: { fill: NAVY, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 80, bottom: 80, left: 100, right: 60 },
          })
        ),
      }),
      ...R.map((row, rowIdx) =>
        new TableRow({
          children: row.map(cell => {
            const tint = cellTint(cell);
            const bg = tint ?? (rowIdx % 2 === 0 ? "FFFFFF" : BG_LIGHT);
            return new TableCell({
              children: [cellPara(cell, { size: 17, color: tint ? NAVY : TEXT, bold: !!tint })],
              shading: { fill: bg, type: ShadingType.CLEAR, color: "auto" },
              margins: { top: 80, bottom: 80, left: 110, right: 70 },
              verticalAlign: VerticalAlign.CENTER,
            });
          }),
        })
      ),
    ],
  });
}

function coverWhite(text: string, size: number, color: string, bold = true): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    bidirectional: RTL,
    spacing: { after: 140 },
    children: [new TextRun({ text, size, bold, color, rightToLeft: RTL })],
  });
}

// محتوى شريط الغلاف: شعار (إن وُجد) + اسم المؤسسة + عنوان المستند + اسم المشروع
function coverBandChildren(title: string, projectName: string): Paragraph[] {
  const out: Paragraph[] = [];
  const logo = getLogo();
  if (logo) {
    out.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [new ImageRun({ data: logo, transformation: { width: 172, height: 75 } })],
    }));
  }
  if (BRAND) out.push(coverWhite(BRAND, 26, ACCENT));
  else if (!logo) out.push(coverWhite("وضوح", 30, ACCENT));
  out.push(coverWhite(title, 46, WHITE));
  out.push(coverWhite(projectName, 26, "E2E8F0", false));
  return out;
}

// غلاف بهوية لونية: شريط علوي بلون العلامة + عنوان أبيض + اسم المشروع، ثم فاصل مميّز وسطر بيانات
function coverBlock(title: string, projectName: string, badge?: string): (Paragraph | Table)[] {
  const band = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: NAVY, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 560, bottom: 560, left: 360, right: 360 },
            verticalAlign: VerticalAlign.CENTER,
            children: coverBandChildren(title, projectName),
          }),
        ],
      }),
    ],
  });

  const rule = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 220, after: 120 },
    border: { bottom: { color: ACCENT, size: 14, style: BorderStyle.SINGLE, space: 1 } },
    children: [new TextRun({ text: "", size: 2 })],
  });

  const meta = new Paragraph({
    alignment: AlignmentType.CENTER,
    bidirectional: RTL,
    spacing: { after: 80 },
    children: [new TextRun({
      text: (badge ? badge + "  •  " : "") + `${S.generated}: ${docDate(LANG)}`,
      size: 18, color: TEXT_LIGHT, italics: true, rightToLeft: RTL,
    })],
  });

  return [
    new Paragraph({ spacing: { before: 900 }, children: [new TextRun({ text: "", size: 2 })] }),
    band,
    rule,
    meta,
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildDoc(title: string, children: (Paragraph | Table)[]): Promise<Uint8Array> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20, color: TEXT },
          paragraph: { spacing: { line: 288 } },
        },
      },
    },
    sections: [{
      properties: { page: { margin: { top: 1134, bottom: 1134, left: 1080, right: 1080 } } },
      headers: { default: new Header({ children: [headerParagraph(title)] }) },
      footers: { default: new Footer({ children: [footerParagraph()] }) },
      children,
    }],
  });
  return Packer.toBuffer(doc) as unknown as Promise<Uint8Array>;
}

// ============================
// مولّد Word عام مرن — يعرض أي مستند من مخطّط موحّد
// ============================
type GenericSection = {
  heading?: string;
  kind?: "text" | "list" | "table" | "keyvalue";
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  pairs?: [string, string][];
};

export async function generateGenericDOCX(
  data: Record<string, unknown>,
  projectName: string,
  docTitleText: string,
  opts?: GenOptions
): Promise<Uint8Array> {
  applyTheme(opts);
  const title = (data.title as string) || docTitleText;
  const children: (Paragraph | Table)[] = [...coverBlock(title, projectName, S.compliant)];

  if (data.subtitle) children.push(bodyText(data.subtitle as string));

  const sections = (data.sections as GenericSection[]) || [];
  let n = 0;
  for (const sec of sections) {
    n++;
    if (sec.heading) {
      // إزالة أي ترقيم يضعه الذكاء في بداية العنوان لتفادي التكرار «1. 1.»
      const cleanHeading = sec.heading.replace(/^(\s*\d+[.)\-]\s*)+/, "").trim();
      children.push(sectionHeading(`${n}. ${cleanHeading}`));
    }
    const kind = sec.kind
      ?? (sec.rows ? "table" : sec.pairs ? "keyvalue" : sec.items ? "list" : "text");
    if (kind === "text" && sec.text) {
      children.push(bodyText(sec.text));
    } else if (kind === "list" && sec.items?.length) {
      sec.items.forEach(it => children.push(bulletItem(it)));
    } else if (kind === "table" && sec.rows?.length) {
      children.push(makeTable(sec.headers || [], sec.rows.map(r => r.map(c => String(c ?? "")))));
      // مفتاح ألوان RACI عند جدول المسؤوليات
      if (/raci|مصفوفة المسؤول/i.test(sec.heading || "")) {
        children.push(new Paragraph({
          bidirectional: RTL, alignment: dir(), spacing: { before: 100, after: 60 },
          children: [new TextRun({
            text: "R = المسؤول عن التنفيذ   ·   A = المعتمِد/المساءل   ·   C = يُستشار   ·   I = يُبلَّغ",
            size: 16, italics: true, color: TEXT_LIGHT, rightToLeft: RTL,
          })],
        }));
      }
    } else if (kind === "keyvalue" && sec.pairs?.length) {
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: sec.pairs.map(([k, v]) => infoRow(k, String(v ?? ""))),
      }));
    } else if (sec.text) {
      children.push(bodyText(sec.text));
    }
  }

  // احتياطي: لو المخطّط فارغ، لا نُخرج مستنداً فاضياً
  if (sections.length === 0) {
    children.push(sectionHeading(S.overview));
    children.push(bodyText((data.project_overview as string) || (data.description as string) || projectName));
  }

  return buildDoc(title, children);
}

// ============================
// 1. ميثاق المشروع
// ============================
export async function generateCharterDOCX(data: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  applyTheme(opts);
  const title = S.projectName === "Project Name" ? "Project Charter" : "ميثاق المشروع";
  const children: (Paragraph | Table)[] = [...coverBlock(title, projectName, S.compliant)];

  children.push(sectionHeading(`1. ${S.docInfo}`));
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      infoRow(S.projectName, (data.project_name as string) || projectName),
      infoRow(S.docNumber, (data.project_number as string) || "WUD-001"),
      infoRow(S.version, (data.version as string) || "1.0"),
      infoRow(S.prepDate, (data.preparation_date as string) || new Date().toISOString().split("T")[0]),
      infoRow(S.preparedBy, (data.prepared_by as string) || S.aiAuthor),
    ],
  }));

  children.push(sectionHeading(`2. ${S.purpose}`));
  children.push(bodyText((data.purpose as string) || ""));

  children.push(sectionHeading(`3. ${S.description}`));
  children.push(bodyText((data.description as string) || ""));

  children.push(sectionHeading(`4. ${S.objectives}`));
  ((data.objectives as string[]) || []).forEach(obj => children.push(bulletItem(obj)));

  children.push(sectionHeading(`5. ${S.scope}`));
  children.push(subHeading(`5.1 ${S.inScope}`));
  ((data.scope_included as string[]) || []).forEach(s => children.push(bulletItem(s)));
  children.push(subHeading(`5.2 ${S.outScope}`));
  ((data.scope_excluded as string[]) || []).forEach(s => children.push(bulletItem(s)));

  children.push(sectionHeading(`6. ${S.stakeholders}`));
  const stakeholders = (data.stakeholders as Array<{name:string;role:string;influence:string;interest:string}>) || [];
  if (stakeholders.length > 0) {
    children.push(makeTable(
      [S.name, S.role, S.influence, S.interest],
      stakeholders.map(s => [s.name, s.role, s.influence, s.interest])
    ));
  }

  children.push(sectionHeading(`7. ${S.budgetSummary}`));
  const budget = (data.budget_summary as {total:number;currency:string;notes:string}) || {};
  children.push(makeTable(
    [S.totalBudget, S.currency, S.notes],
    [[String(budget.total || 0), budget.currency || "SAR", budget.notes || ""]]
  ));

  children.push(sectionHeading(`8. ${S.assumptionsConstraints}`));
  children.push(subHeading(`8.1 ${S.assumptions}`));
  ((data.assumptions as string[]) || []).forEach(a => children.push(bulletItem(a)));
  children.push(subHeading(`8.2 ${S.constraints}`));
  ((data.constraints as string[]) || []).forEach(c => children.push(bulletItem(c)));

  children.push(sectionHeading(`9. ${S.highLevelRisks}`));
  ((data.risks_summary as string[]) || []).forEach(r => children.push(bulletItem(r)));

  children.push(sectionHeading(`10. ${S.successCriteria}`));
  ((data.success_criteria as string[]) || []).forEach(c => children.push(bulletItem(c)));

  children.push(sectionHeading(`11. ${S.authorization}`));
  const sigCell = (roleLabel: string) => new TableCell({
    children: [
      cellPara(roleLabel, { size: 18, bold: true, color: NAVY }),
      cellPara(`${S.name}: ________________________`, { size: 18, color: TEXT_MID }),
      cellPara(`${S.signature}: ____________________`, { size: 18, color: TEXT_MID }),
      cellPara(`${S.date}: _________________________`, { size: 18, color: TEXT_MID }),
    ],
    margins: { top: 160, bottom: 160, left: 200, right: 200 },
  });
  const cells = [sigCell(S.sponsor), sigCell(S.projectManager)];
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: RTL ? cells.reverse() : cells })],
  }));

  return buildDoc(title, children);
}

// ============================
// 2. خطة إدارة المشروع
// ============================
export async function generateProjectPlanDOCX(agendaData: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  applyTheme(opts);
  const title = LANG === "en" ? "Project Management Plan" : "خطة إدارة المشروع";
  const children: (Paragraph | Table)[] = [...coverBlock(title, projectName, S.compliant)];

  children.push(sectionHeading(`1. ${S.overview}`));
  children.push(bodyText((agendaData.project_overview as string) || ""));

  const effort = agendaData.estimated_effort_hours || 0;
  const dur = agendaData.duration_weeks || agendaData.duration || 0;
  const team = agendaData.team_size_recommended || agendaData.team_size || 0;
  children.push(sectionHeading(`2. ${S.methodology}`));
  children.push(makeTable(
    [S.methodology, S.estEffort, S.duration, S.teamSize],
    [[
      String(agendaData.methodology || "—"),
      `${effort} ${S.hours}`,
      `${dur} ${S.weeks}`,
      `${team} ${S.members}`,
    ]]
  ));

  children.push(sectionHeading(`3. ${S.phases}`));
  const phases = (agendaData.phases as Array<{name:string;start_week:number;end_week:number;description:string;deliverables:string[]}>) || [];
  if (phases.length > 0) {
    children.push(makeTable(
      [S.phase, S.startWeek, S.endWeek, S.description, S.keyDeliverables],
      phases.map(p => [p.name, `${S.week} ${p.start_week}`, `${S.week} ${p.end_week}`, p.description, (p.deliverables || []).join("، ")])
    ));
  }

  children.push(sectionHeading(`4. ${S.milestones}`));
  const milestones = (agendaData.key_milestones as Array<{name:string;week:number;description:string;success_criteria:string}>) || [];
  if (milestones.length > 0) {
    children.push(makeTable(
      [S.milestone, S.week, S.description, S.successCriteria],
      milestones.map(m => [m.name, `${S.week} ${m.week}`, m.description, m.success_criteria])
    ));
  }

  children.push(sectionHeading(`5. ${S.kpis}`));
  const kpis = (agendaData.kpis as Array<{name:string;target:string;measurement_method:string;frequency:string}>) || [];
  if (kpis.length > 0) {
    children.push(makeTable(
      [S.kpi, S.target, S.measurement, S.frequency],
      kpis.map(k => [k.name, k.target, k.measurement_method, k.frequency])
    ));
  }

  children.push(sectionHeading(`6. ${S.criticalFactors}`));
  ((agendaData.critical_success_factors as string[]) || []).forEach(f => children.push(bulletItem(f)));

  children.push(sectionHeading(`7. ${S.recommendations}`));
  ((agendaData.recommendations as string[]) || []).forEach(r => children.push(bulletItem(r)));

  return buildDoc(title, children);
}

// ============================
// 3. سجل المخاطر
// ============================
export async function generateRiskRegisterDOCX(data: Record<string, unknown>, projectName: string, opts?: GenOptions): Promise<Uint8Array> {
  applyTheme(opts);
  const title = S.riskRegister;
  const children: (Paragraph | Table)[] = [...coverBlock(title, projectName, S.compliant)];

  const risks = (data.risks as Array<{
    id:string; risk_statement:string; category:string;
    probability_score:number; impact_score:number; risk_score:number;
    risk_level:string; response_strategy:string; contingency_plan:string; owner:string; status:string;
  }>) || [];

  // ملخّص محسوب من المخاطر (يتجنّب ظهور أصفار عندما لا يرسل الذكاء ملخّصاً)
  const sm = (data.summary as {total_risks:number;critical:number;high:number;medium:number;low:number;overall_risk_level:string}) || {} as Record<string, number>;
  const lvl = (r: {risk_level?: string}) => (r.risk_level || "").toLowerCase();
  const count = (k: string) => risks.filter(r => lvl(r).includes(k)).length;
  const total = sm.total_risks || risks.length;
  const crit = sm.critical ?? count("crit");
  const hi = sm.high ?? count("high");
  const med = sm.medium ?? count("med");
  const lo = sm.low ?? count("low");

  children.push(sectionHeading(`1. ${S.riskSummary}`));
  children.push(makeTable(
    [S.totalRisks, S.critical, S.high, S.medium, S.low],
    [[String(total), String(crit), String(hi), String(med), String(lo)]]
  ));

  children.push(sectionHeading(`2. ${S.riskRegister}`));
  if (risks.length > 0) {
    children.push(makeTable(
      [S.id, S.riskStatement, S.category, S.probability, S.impact, S.score, S.level, S.strategy, S.owner],
      risks.map(r => [r.id, r.risk_statement, r.category, String(r.probability_score), String(r.impact_score), String(r.risk_score), r.risk_level, r.response_strategy, r.owner])
    ));
  }

  children.push(sectionHeading(`3. ${S.responseDetails}`));
  risks.forEach(r => {
    children.push(subHeading(`${r.id}: ${(r.risk_statement || "").substring(0, 60)}`));
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        infoRow(S.strategy, r.response_strategy),
        infoRow(S.contingency, r.contingency_plan),
        infoRow(S.owner, r.owner),
        infoRow(S.status, r.status),
      ],
    }));
  });

  return buildDoc(title, children);
}
