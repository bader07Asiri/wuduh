// ============================
// وضوح | Wuduh — قاموس تسميات المستندات (عربي/إنجليزي)
// كل النصوص الثابتة في القوالب تُقرأ من هنا حسب اللغة، بدل كتابتها إنجليزي داخل الكود.
// ============================

import type { DocLang } from "./types";
import type { DeliverableType } from "@/types";

export interface DocStrings {
  standard: string;          // مرجع المعيار في الترويسة
  compliant: string;         // شارة الالتزام في الغلاف
  generated: string;         // "أُنشئ في"
  page: string;              // "صفحة"
  // معلومات المستند
  docInfo: string;
  projectName: string;
  docNumber: string;
  version: string;
  prepDate: string;
  preparedBy: string;
  aiAuthor: string;
  projectManager: string;
  // ميثاق المشروع
  purpose: string;
  description: string;
  objectives: string;
  scope: string;
  inScope: string;
  outScope: string;
  stakeholders: string;
  budgetSummary: string;
  totalBudget: string;
  currency: string;
  notes: string;
  assumptionsConstraints: string;
  assumptions: string;
  constraints: string;
  highLevelRisks: string;
  successCriteria: string;
  authorization: string;
  sponsor: string;
  name: string;
  signature: string;
  date: string;
  // جداول عامة
  role: string;
  influence: string;
  interest: string;
  // خطة إدارة المشروع
  overview: string;
  methodology: string;
  estEffort: string;
  duration: string;
  teamSize: string;
  hours: string;
  weeks: string;
  members: string;
  phases: string;
  phase: string;
  startWeek: string;
  endWeek: string;
  keyDeliverables: string;
  milestones: string;
  milestone: string;
  week: string;
  kpis: string;
  kpi: string;
  target: string;
  measurement: string;
  frequency: string;
  criticalFactors: string;
  recommendations: string;
  // سجل المخاطر
  riskSummary: string;
  totalRisks: string;
  critical: string;
  high: string;
  medium: string;
  low: string;
  overallLevel: string;
  riskRegister: string;
  id: string;
  riskStatement: string;
  category: string;
  probability: string;
  impact: string;
  score: string;
  level: string;
  strategy: string;
  owner: string;
  status: string;
  responseDetails: string;
  contingency: string;
  field: string;
  details: string;
  // عناصر عامة للمولّد العام
  items: string;
  value: string;
}

const AR: DocStrings = {
  standard: "دليل PMBOK — الإصدار السابع",
  compliant: "متوافق مع دليل PMBOK الإصدار السابع",
  generated: "أُنشئ في",
  page: "صفحة",
  docInfo: "معلومات المستند",
  projectName: "اسم المشروع",
  docNumber: "رقم المستند",
  version: "الإصدار",
  prepDate: "تاريخ الإعداد",
  preparedBy: "أعدّه",
  aiAuthor: "وضوح | مساعد إدارة المشاريع",
  projectManager: "مدير المشروع",
  purpose: "غرض المشروع",
  description: "وصف المشروع",
  objectives: "أهداف المشروع",
  scope: "نطاق المشروع",
  inScope: "داخل النطاق",
  outScope: "خارج النطاق",
  stakeholders: "أصحاب المصلحة",
  budgetSummary: "ملخّص الميزانية",
  totalBudget: "إجمالي الميزانية",
  currency: "العملة",
  notes: "ملاحظات",
  assumptionsConstraints: "الافتراضات والقيود",
  assumptions: "الافتراضات",
  constraints: "القيود",
  highLevelRisks: "المخاطر عالية المستوى",
  successCriteria: "معايير النجاح",
  authorization: "الاعتماد والتوقيع",
  sponsor: "راعي المشروع",
  name: "الاسم",
  signature: "التوقيع",
  date: "التاريخ",
  role: "الدور",
  influence: "التأثير",
  interest: "الاهتمام",
  overview: "نظرة عامة",
  methodology: "المنهجية",
  estEffort: "الجهد التقديري",
  duration: "المدة",
  teamSize: "حجم الفريق",
  hours: "ساعة",
  weeks: "أسبوع",
  members: "عضو",
  phases: "مراحل المشروع",
  phase: "المرحلة",
  startWeek: "أسبوع البداية",
  endWeek: "أسبوع النهاية",
  keyDeliverables: "أهم المخرجات",
  milestones: "المعالم الرئيسية",
  milestone: "المعلم",
  week: "الأسبوع",
  kpis: "مؤشرات الأداء الرئيسية",
  kpi: "المؤشر",
  target: "المستهدف",
  measurement: "طريقة القياس",
  frequency: "التكرار",
  criticalFactors: "عوامل النجاح الحرجة",
  recommendations: "التوصيات",
  riskSummary: "ملخّص المخاطر",
  totalRisks: "إجمالي المخاطر",
  critical: "حرجة",
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
  overallLevel: "المستوى العام",
  riskRegister: "سجل المخاطر",
  id: "الرقم",
  riskStatement: "وصف الخطر",
  category: "الفئة",
  probability: "الاحتمال",
  impact: "الأثر",
  score: "الدرجة",
  level: "المستوى",
  strategy: "الاستراتيجية",
  owner: "المسؤول",
  status: "الحالة",
  responseDetails: "تفاصيل الاستجابة للمخاطر",
  contingency: "خطة الطوارئ",
  field: "البند",
  details: "التفاصيل",
  items: "العناصر",
  value: "القيمة",
};

const EN: DocStrings = {
  standard: "PMI/PMBOK Guide 7th Edition",
  compliant: "PMI/PMBOK Guide 7th Edition Compliant",
  generated: "Generated",
  page: "Page",
  docInfo: "Document Information",
  projectName: "Project Name",
  docNumber: "Document Number",
  version: "Version",
  prepDate: "Preparation Date",
  preparedBy: "Prepared By",
  aiAuthor: "Wuduh | PM Assistant",
  projectManager: "Project Manager",
  purpose: "Project Purpose",
  description: "Project Description",
  objectives: "Project Objectives",
  scope: "Project Scope",
  inScope: "In Scope",
  outScope: "Out of Scope",
  stakeholders: "Key Stakeholders",
  budgetSummary: "Budget Summary",
  totalBudget: "Total Budget",
  currency: "Currency",
  notes: "Notes",
  assumptionsConstraints: "Assumptions & Constraints",
  assumptions: "Assumptions",
  constraints: "Constraints",
  highLevelRisks: "High-Level Risks",
  successCriteria: "Success Criteria",
  authorization: "Authorization",
  sponsor: "Project Sponsor",
  name: "Name",
  signature: "Signature",
  date: "Date",
  role: "Role",
  influence: "Influence",
  interest: "Interest",
  overview: "Project Overview",
  methodology: "Methodology",
  estEffort: "Estimated Effort",
  duration: "Duration",
  teamSize: "Team Size",
  hours: "hrs",
  weeks: "weeks",
  members: "members",
  phases: "Project Phases",
  phase: "Phase",
  startWeek: "Start Week",
  endWeek: "End Week",
  keyDeliverables: "Key Deliverables",
  milestones: "Key Milestones",
  milestone: "Milestone",
  week: "Week",
  kpis: "Key Performance Indicators",
  kpi: "KPI",
  target: "Target",
  measurement: "Measurement Method",
  frequency: "Frequency",
  criticalFactors: "Critical Success Factors",
  recommendations: "Recommendations",
  riskSummary: "Risk Summary",
  totalRisks: "Total Risks",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  overallLevel: "Overall Level",
  riskRegister: "Risk Register",
  id: "ID",
  riskStatement: "Risk Statement",
  category: "Category",
  probability: "P",
  impact: "I",
  score: "Score",
  level: "Level",
  strategy: "Strategy",
  owner: "Owner",
  status: "Status",
  responseDetails: "Risk Response Details",
  contingency: "Contingency Plan",
  field: "Field",
  details: "Details",
  items: "Items",
  value: "Value",
};

export function L(lang?: DocLang): DocStrings {
  return lang === "en" ? EN : AR;
}

export function isRTL(lang?: DocLang): boolean {
  return lang !== "en";
}

// تاريخ الإنشاء — ميلادي دائماً (نتفادى التقويم الهجري) بأرقام مناسبة للغة
export function docDate(lang?: DocLang, d: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "ar", {
      calendar: "gregory", day: "numeric", month: "long", year: "numeric",
    }).format(d);
  } catch {
    return d.toISOString().split("T")[0];
  }
}

// عناوين المستندات لكل نوع مخرج (تُستخدم في الغلاف والترويسة)
export const DOC_TITLES: Record<DeliverableType, { ar: string; en: string }> = {
  project_charter:          { ar: "ميثاق المشروع", en: "Project Charter" },
  project_plan:             { ar: "خطة إدارة المشروع", en: "Project Management Plan" },
  scope_statement:          { ar: "بيان نطاق المشروع", en: "Project Scope Statement" },
  wbs:                      { ar: "هيكل تجزئة العمل", en: "Work Breakdown Structure" },
  stakeholder_register:     { ar: "سجل أصحاب المصلحة", en: "Stakeholder Register" },
  gantt_chart:              { ar: "المخطط الزمني (جانت)", en: "Gantt Chart" },
  schedule:                 { ar: "الجدول الزمني للمشروع", en: "Project Schedule" },
  milestone_chart:          { ar: "مخطط المعالم", en: "Milestone Chart" },
  resource_plan:            { ar: "خطة الموارد", en: "Resource Plan" },
  budget:                   { ar: "ميزانية المشروع", en: "Project Budget" },
  cost_estimates:           { ar: "تقديرات التكلفة", en: "Cost Estimates" },
  earned_value:             { ar: "تحليل القيمة المكتسبة", en: "Earned Value Analysis" },
  risk_register:            { ar: "سجل المخاطر", en: "Risk Register" },
  risk_response:            { ar: "خطة الاستجابة للمخاطر", en: "Risk Response Plan" },
  quality_plan:             { ar: "خطة إدارة الجودة", en: "Quality Management Plan" },
  quality_checklist:        { ar: "قائمة فحص الجودة", en: "Quality Checklist" },
  communication_plan:       { ar: "خطة التواصل", en: "Communication Plan" },
  status_report:            { ar: "تقرير حالة المشروع", en: "Project Status Report" },
  meeting_minutes:          { ar: "محضر اجتماع", en: "Meeting Minutes" },
  dashboard:                { ar: "لوحة مؤشرات المشروع", en: "Project Dashboard" },
  kickoff_presentation:     { ar: "عرض انطلاق المشروع", en: "Kickoff Presentation" },
  stakeholder_presentation: { ar: "عرض أصحاب المصلحة", en: "Stakeholder Presentation" },
  progress_presentation:    { ar: "عرض تقدّم المشروع", en: "Progress Presentation" },
  closure_report:           { ar: "تقرير إغلاق المشروع", en: "Project Closure Report" },
  lessons_learned:          { ar: "الدروس المستفادة", en: "Lessons Learned" },
  closure_checklist:        { ar: "قائمة إغلاق المشروع", en: "Closure Checklist" },
};

export function docTitle(type: DeliverableType, lang?: DocLang): string {
  const t = DOC_TITLES[type];
  if (!t) return "";
  return lang === "en" ? t.en : t.ar;
}
