import type { DocTheme } from "@/lib/themes";
import type { BrandingConfig } from "@/lib/branding";

export type DocLang = "ar" | "en";

// خيارات موحّدة تُمرّر لكل المولّدات (اختيارية للحفاظ على التوافق)
export interface GenOptions {
  theme: DocTheme;
  branding: BrandingConfig;
  lang?: DocLang;      // لغة نصوص القالب الثابتة (الافتراضي: عربي)
  fontArabic?: string; // الخط العربي المعتمد (مثبّت على السيرفر) — الافتراضي Noto Sans Arabic
}
