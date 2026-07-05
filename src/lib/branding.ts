// ============================
// وضوح | Wuduh — Document Branding Rules
// يحدّد العلامة المائية والشعار والهوية حسب الباقة
// ============================

export type Plan = "free" | "starter" | "professional" | "enterprise";

// الهوية البصرية للمؤسسة (تُجلب من جدول organizations عند توليد المستندات)
export interface OrgBranding {
  name?: string | null;
  name_en?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  letterhead_text?: string | null;   // نص الترويسة (العنوان، الهاتف، الموقع)
  signatory_name?: string | null;    // اسم الموقّع
  signatory_title?: string | null;   // منصب الموقّع
  department?: string | null;        // القسم
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

// خيارات يفعّلها المستخدم لحظة التوليد
export interface BrandingRequest {
  themeId?: string | null;
  useOrgIdentity?: boolean;   // تطبيق هوية المؤسسة (شعار + لتر هيد)
  includeSignature?: boolean; // إضافة كتلة التوقيع
}

// النتيجة النهائية التي تستهلكها المولّدات
export interface BrandingConfig {
  plan: Plan;
  showWatermark: boolean;      // علامة "وضوح" المائية (للمجاني فقط)
  watermarkText: string;
  showWuduhLogo: boolean;      // شعار وضوح في الترويسة — مطفأ دائماً حسب الطلب
  canUseOrgIdentity: boolean;  // هل الباقة تسمح بهوية المؤسسة
  org: OrgBranding | null;     // هوية المؤسسة إن وُجدت وسُمح بها
  includeSignature: boolean;
}

// الباقات التي يُسمح لها بتطبيق هوية المؤسسة (المتوسطة والأعلى)
const IDENTITY_PLANS: Plan[] = ["professional", "enterprise"];

// الباقات المدفوعة (بدون علامة مائية)
const PAID_PLANS: Plan[] = ["starter", "professional", "enterprise"];

export function resolveBranding(
  plan: Plan,
  org: OrgBranding | null,
  request: BrandingRequest
): BrandingConfig {
  const isPaid = PAID_PLANS.includes(plan);
  const canUseOrgIdentity = IDENTITY_PLANS.includes(plan);
  const applyOrg = canUseOrgIdentity && !!request.useOrgIdentity && !!org;

  return {
    plan,
    // المجاني فقط عليه علامة مائية
    showWatermark: !isPaid,
    watermarkText: "وضوح • WUDUH",
    // شعار وضوح لا يظهر في المستندات إطلاقاً حسب المتطلبات
    showWuduhLogo: false,
    canUseOrgIdentity,
    org: applyOrg ? org : null,
    includeSignature: applyOrg ? !!request.includeSignature : false,
  };
}
