// ============================
// وضوح | Wuduh — Rate Limiter
// حماية API من الإغراق والاستخدام المفرط
// ============================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (يُعاد للصفر عند إعادة تشغيل الخادم — كافٍ للـ MVP)
const store = new Map<string, RateLimitEntry>();

// تنظيف تلقائي كل 5 دقائق
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of Array.from(store.entries())) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** عدد الطلبات المسموح بها في النافذة الزمنية */
  limit: number;
  /** النافذة الزمنية بالثواني */
  windowSecs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSecs * 1000;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // نافذة جديدة
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: options.limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

// حدود جاهزة للاستخدام
export const LIMITS = {
  /** AI generation — 10 طلبات/دقيقة لكل مستخدم */
  AI_GENERATE: { limit: 10, windowSecs: 60 },
  /** إنشاء مشاريع — 20 مشروع/ساعة */
  PROJECT_CREATE: { limit: 20, windowSecs: 3600 },
  /** تحميل ملفات — 30 تحميل/دقيقة */
  DELIVERABLE_DOWNLOAD: { limit: 30, windowSecs: 60 },
  /** توليد مخرجات — 15 طلب/دقيقة */
  DELIVERABLE_GENERATE: { limit: 15, windowSecs: 60 },
} as const;
