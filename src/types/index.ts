// ============================
// وضوح | Wuduh — Core Types
// ============================

export type UserType = "individual" | "small_company" | "enterprise";

export type Industry =
  | "construction"
  | "technology"
  | "healthcare"
  | "manufacturing"
  | "education"
  | "retail"
  | "finance"
  | "government"
  | "energy"
  | "oil_gas"
  | "transportation"
  | "logistics"
  | "hospitality"
  | "tourism"
  | "real_estate"
  | "telecom"
  | "media"
  | "agriculture"
  | "defense"
  | "legal"
  | "consulting"
  | "nonprofit"
  | "other";

export type ProjectStatus =
  | "draft"
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type DeliverableType =
  | "project_charter"
  | "project_plan"
  | "scope_statement"
  | "wbs"
  | "stakeholder_register"
  | "gantt_chart"
  | "schedule"
  | "milestone_chart"
  | "resource_plan"
  | "budget"
  | "cost_estimates"
  | "earned_value"
  | "risk_register"
  | "risk_response"
  | "quality_plan"
  | "quality_checklist"
  | "communication_plan"
  | "status_report"
  | "meeting_minutes"
  | "dashboard"
  | "kickoff_presentation"
  | "stakeholder_presentation"
  | "progress_presentation"
  | "closure_report"
  | "lessons_learned"
  | "closure_checklist";

export type DeliverableFormat = "pdf" | "docx" | "xlsx" | "pptx";

export type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise";

// ---- User Profile ----
export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  industry: Industry;
  company_name?: string;
  team_size?: number;
  subscription_plan: SubscriptionPlan;
  subscription_status: "active" | "cancelled" | "past_due" | "trialing";
  stripe_customer_id?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Project ----
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  industry: Industry;
  client_name?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency: "SAR" | "USD" | "EUR";
  team_size: number;
  objectives: string[];
  constraints?: string;
  assumptions?: string;
  status: ProjectStatus;
  ai_agenda?: AIAgenda;
  user_notes?: string;
  agenda_approved: boolean;
  created_at: string;
  updated_at: string;
}

// ---- AI Agenda (output from Claude) ----
export interface AIAgenda {
  project_overview: string;
  methodology: string; // e.g. "Predictive (Waterfall)" | "Agile" | "Hybrid"
  phases: ProjectPhase[];
  key_milestones: Milestone[];
  risk_summary: RiskItem[];
  resource_summary: ResourceItem[];
  kpis: KPI[];
  recommendations: string[];
  pmbok_processes: string[]; // Which PMBOK process groups apply
  estimated_effort_hours: number;
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  start_week: number;
  end_week: number;
  deliverables: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  dependencies?: string[];
  responsible: string;
  priority: "critical" | "high" | "medium" | "low";
}

export interface Milestone {
  name: string;
  week: number;
  description: string;
  success_criteria: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  category: "technical" | "schedule" | "cost" | "resource" | "external" | "quality";
  probability: "very_high" | "high" | "medium" | "low" | "very_low";
  impact: "very_high" | "high" | "medium" | "low" | "very_low";
  risk_score: number; // 1-25
  response_strategy: "avoid" | "mitigate" | "transfer" | "accept";
  mitigation_action: string;
  owner: string;
}

export interface ResourceItem {
  role: string;
  count: number;
  allocation_percentage: number;
  notes?: string;
}

export interface KPI {
  name: string;
  target: string;
  measurement_method: string;
  frequency: string;
}

// ---- Deliverable ----
export interface Deliverable {
  id: string;
  project_id: string;
  type: DeliverableType;
  format: DeliverableFormat;
  status: "pending" | "generating" | "ready" | "error";
  file_url?: string;
  file_size?: number;
  generated_at?: string;
  created_at: string;
}

// ---- Onboarding Form ----
export interface OnboardingData {
  user_type: UserType;
  industry: Industry;
  company_name?: string;
  team_size?: number;
  main_challenge?: string;
  projects_per_year?: number;
  avg_project_duration?: string;
  has_pmp_certified?: boolean;
}

// ---- Project Form ----
export interface ProjectFormData {
  name: string;
  description: string;
  client_name?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency: "SAR" | "USD" | "EUR";
  team_size: number;
  objectives: string[];
  constraints?: string;
  assumptions?: string;
  pmbok_edition?: "7" | "8";
}

// ---- Organization & Departments ----
export type OrgRole = "owner" | "admin" | "member";
export type MemberStatus = "active" | "invited" | "suspended";

export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  name_en?: string;
  logo_url?: string;
  industry?: Industry;
  cr_number?: string;
  created_at: string;
  updated_at: string;
}

export interface OrgDepartment {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  member_count?: number;
  project_count?: number;
}

export interface OrgMember {
  id: string;
  org_id: string;
  dept_id?: string;
  user_id: string;
  email: string;
  full_name?: string;
  role: OrgRole;
  status: MemberStatus;
  invited_at: string;
  joined_at?: string;
  department?: OrgDepartment;
}

// ---- Subscription Plans ----
export const PLANS = {
  starter: {
    name: "Starter",
    name_ar: "المبتدئ",
    price_monthly: 29,
    price_yearly: 290,
    currency: "USD",
    max_projects: 3,
    features: [
      "3 مشاريع نشطة",
      "كل المخرجات الأساسية",
      "تصدير PDF & DOCX",
      "دعم بالبريد الإلكتروني",
    ],
  },
  professional: {
    name: "Professional",
    name_ar: "الاحترافي",
    price_monthly: 79,
    price_yearly: 790,
    currency: "USD",
    max_projects: 15,
    features: [
      "15 مشروع نشط",
      "كل المخرجات (PDF, DOCX, XLSX, PPTX)",
      "تحليل المخاطر المتقدم",
      "Gantt Chart تفاعلي",
      "دعم أولوية",
    ],
  },
  enterprise: {
    name: "Enterprise",
    name_ar: "المؤسسي",
    price_monthly: 199,
    price_yearly: 1990,
    currency: "USD",
    max_projects: -1, // unlimited
    features: [
      "مشاريع غير محدودة",
      "API للتكامل مع أنظمتك",
      "تخصيص القوالب",
      "تقارير المحفظة (Portfolio)",
      "مدير حساب مخصص",
      "SLA 99.9%",
    ],
  },
} as const;

// ---- Industry Labels ----
export const INDUSTRY_LABELS: Record<Industry, string> = {
  construction:   "البناء والإنشاءات",
  technology:     "التقنية والبرمجيات",
  healthcare:     "الصحة والطب",
  manufacturing:  "التصنيع والصناعة",
  education:      "التعليم والتدريب",
  retail:         "التجزئة والتجارة",
  finance:        "المالية والبنوك",
  government:     "الحكومة والقطاع العام",
  energy:         "الطاقة والكهرباء",
  oil_gas:        "النفط والغاز",
  transportation: "النقل والمواصلات",
  logistics:      "اللوجستيك وسلاسل التوريد",
  hospitality:    "الضيافة والفنادق",
  tourism:        "السياحة والترفيه",
  real_estate:    "العقارات والتطوير العمراني",
  telecom:        "الاتصالات وتقنية المعلومات",
  media:          "الإعلام والتسويق",
  agriculture:    "الزراعة والأغذية",
  defense:        "الدفاع والأمن",
  legal:          "القانون والاستشارات القانونية",
  consulting:     "الاستشارات الإدارية",
  nonprofit:      "المنظمات غير الربحية",
  other:          "قطاع آخر",
};

export const USER_TYPE_LABELS: Record<UserType, string> = {
  individual:    "فرد / مستقل",
  small_company: "شركة صغيرة (أقل من 50 موظف)",
  enterprise:    "مؤسسة / شركة كبيرة",
};

export const DELIVERABLE_LABELS: Record<DeliverableType, string> = {
  project_charter:          "ميثاق المشروع",
  project_plan:             "خطة إدارة المشروع",
  scope_statement:          "بيان النطاق",
  wbs:                      "هيكل تقسيم العمل (WBS)",
  stakeholder_register:     "سجل أصحاب المصلحة",
  gantt_chart:              "مخطط جانت",
  schedule:                 "الجدول الزمني التفصيلي",
  milestone_chart:          "مخطط المعالم",
  resource_plan:            "خطة إدارة الموارد",
  budget:                   "الميزانية التفصيلية",
  cost_estimates:           "تقديرات التكاليف",
  earned_value:             "تحليل القيمة المكتسبة",
  risk_register:            "سجل المخاطر",
  risk_response:            "خطة الاستجابة للمخاطر",
  quality_plan:             "خطة إدارة الجودة",
  quality_checklist:        "قوائم مراجعة الجودة",
  communication_plan:       "خطة الاتصالات",
  status_report:            "قالب تقرير الحالة",
  meeting_minutes:          "قالب محاضر الاجتماعات",
  dashboard:                "لوحة متابعة المشروع",
  kickoff_presentation:     "عرض اجتماع الانطلاق",
  stakeholder_presentation: "عرض أصحاب المصلحة",
  progress_presentation:    "عرض التقدم الدوري",
  closure_report:           "تقرير إغلاق المشروع",
  lessons_learned:          "سجل الدروس المستفادة",
  closure_checklist:        "قائمة مراجعة الإغلاق",
};
