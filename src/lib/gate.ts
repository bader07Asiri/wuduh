// ============================
// وضوح | Wuduh — جدار الدخول المؤقّت (ما قبل الإطلاق)
// يُقفل الموقع كاملاً خلف رقم سري حتى الانطلاقة.
// للإلغاء عند الإطلاق: اجعل SITE_GATE_ENABLED=false (أو احذف فحص الجدار من middleware).
// ============================

// مفعّل افتراضياً؛ لإطفائه ضع SITE_GATE_ENABLED=false في متغيرات البيئة.
export const GATE_ENABLED = process.env.SITE_GATE_ENABLED !== "false";

// الرقم السري (يُفضّل ضبطه عبر متغير بيئة SITE_GATE_PASSWORD؛ وإلا يُستخدم الافتراضي).
export const GATE_PASSWORD = process.env.SITE_GATE_PASSWORD || "Bader147852";

export const GATE_COOKIE = "wuduh_gate";
