import type { DocTheme } from "@/lib/themes";
import type { BrandingConfig } from "@/lib/branding";

// خيارات موحّدة تُمرّر لكل المولّدات (اختيارية للحفاظ على التوافق)
export interface GenOptions {
  theme: DocTheme;
  branding: BrandingConfig;
}
