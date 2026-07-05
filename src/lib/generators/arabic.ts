// ============================
// وضوح | Wuduh — Arabic text shaping for jsPDF
// jsPDF لا يشكّل العربية ولا يعالج الاتجاه؛ هذا الملف يقوم بذلك يدوياً.
// خوارزمية أشكال العرض (Presentation Forms) قياسية ومحدّدة في يونيكود.
// ============================

// خريطة الحروف العربية → [منفصل, نهائي, وسطي, ابتدائي]
// القيم من كتلة Arabic Presentation Forms-B (U+FE70..U+FEFF)
const FORMS: Record<string, [number, number, number, number]> = {
  "ء": [0xfe80, 0xfe80, 0xfe80, 0xfe80], // ء
  "آ": [0xfe81, 0xfe82, 0xfe82, 0xfe81], // آ
  "أ": [0xfe83, 0xfe84, 0xfe84, 0xfe83], // أ
  "ؤ": [0xfe85, 0xfe86, 0xfe86, 0xfe85], // ؤ
  "إ": [0xfe87, 0xfe88, 0xfe88, 0xfe87], // إ
  "ئ": [0xfe89, 0xfe8a, 0xfe8c, 0xfe8b], // ئ
  "ا": [0xfe8d, 0xfe8e, 0xfe8e, 0xfe8d], // ا
  "ب": [0xfe8f, 0xfe90, 0xfe92, 0xfe91], // ب
  "ة": [0xfe93, 0xfe94, 0xfe94, 0xfe93], // ة
  "ت": [0xfe95, 0xfe96, 0xfe98, 0xfe97], // ت
  "ث": [0xfe99, 0xfe9a, 0xfe9c, 0xfe9b], // ث
  "ج": [0xfe9d, 0xfe9e, 0xfea0, 0xfe9f], // ج
  "ح": [0xfea1, 0xfea2, 0xfea4, 0xfea3], // ح
  "خ": [0xfea5, 0xfea6, 0xfea8, 0xfea7], // خ
  "د": [0xfea9, 0xfeaa, 0xfeaa, 0xfea9], // د
  "ذ": [0xfeab, 0xfeac, 0xfeac, 0xfeab], // ذ
  "ر": [0xfead, 0xfeae, 0xfeae, 0xfead], // ر
  "ز": [0xfeaf, 0xfeb0, 0xfeb0, 0xfeaf], // ز
  "س": [0xfeb1, 0xfeb2, 0xfeb4, 0xfeb3], // س
  "ش": [0xfeb5, 0xfeb6, 0xfeb8, 0xfeb7], // ش
  "ص": [0xfeb9, 0xfeba, 0xfebc, 0xfebb], // ص
  "ض": [0xfebd, 0xfebe, 0xfec0, 0xfebf], // ض
  "ط": [0xfec1, 0xfec2, 0xfec4, 0xfec3], // ط
  "ظ": [0xfec5, 0xfec6, 0xfec8, 0xfec7], // ظ
  "ع": [0xfec9, 0xfeca, 0xfecc, 0xfecb], // ع
  "غ": [0xfecd, 0xfece, 0xfed0, 0xfecf], // غ
  "ف": [0xfed1, 0xfed2, 0xfed4, 0xfed3], // ف
  "ق": [0xfed5, 0xfed6, 0xfed8, 0xfed7], // ق
  "ك": [0xfed9, 0xfeda, 0xfedc, 0xfedb], // ك
  "ل": [0xfedd, 0xfede, 0xfee0, 0xfedf], // ل
  "م": [0xfee1, 0xfee2, 0xfee4, 0xfee3], // م
  "ن": [0xfee5, 0xfee6, 0xfee8, 0xfee7], // ن
  "ه": [0xfee9, 0xfeea, 0xfeec, 0xfeeb], // ه
  "و": [0xfeed, 0xfeee, 0xfeee, 0xfeed], // و
  "ى": [0xfeef, 0xfef0, 0xfef0, 0xfeef], // ى
  "ي": [0xfef1, 0xfef2, 0xfef4, 0xfef3], // ي
  "ـ": [0x0640, 0x0640, 0x0640, 0x0640], // ـ (تطويل)
};

// الحروف التي لا تتصل بما بعدها (تتصل من اليمين فقط)
const RIGHT_ONLY = new Set([
  "آ", "أ", "ؤ", "إ", "ا",
  "ة", "د", "ذ", "ر", "ز",
  "و", "ى",
]);

// لام + ألف → لامألف (ربطة إلزامية)
const LAM = "ل";
const LAM_ALEF: Record<string, [number, number]> = {
  "آ": [0xfef5, 0xfef6], // لآ
  "أ": [0xfef7, 0xfef8], // لأ
  "إ": [0xfef9, 0xfefa], // لإ
  "ا": [0xfefb, 0xfefc], // لا
};

const TASHKEEL = /[ً-ْٰـ]/; // حركات (نحذفها للعرض)

function isArabicLetter(ch: string): boolean {
  return ch in FORMS;
}

export function containsArabic(text: string): boolean {
  return /[؀-ۿ]/.test(text);
}

// يشكّل نصاً عربياً ويعكسه للعرض من اليمين لليسار في jsPDF
export function shapeArabic(input: string): string {
  if (!input || !containsArabic(input)) return input;

  // نعالج كل "كلمة/مقطع" مع الحفاظ على المقاطع اللاتينية والأرقام كما هي
  const tokens = input.split(/(\s+)/);
  const out: string[] = [];

  for (const token of tokens) {
    if (/^\s+$/.test(token)) { out.push(token); continue; }
    if (!containsArabic(token)) { out.push(token); continue; }
    out.push(shapeToken(token));
  }

  // عكس ترتيب المقاطع لأن jsPDF يرسم من اليسار
  return out.reverse().join("");
}

function shapeToken(token: string): string {
  // إزالة الحركات
  const chars = Array.from(token).filter((c) => !TASHKEEL.test(c) || c === "ـ");
  const result: number[] = [];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    // لام-ألف
    if (ch === LAM && i + 1 < chars.length && chars[i + 1] in LAM_ALEF) {
      const prev = chars[i - 1];
      const connectsBefore = !!prev && isArabicLetter(prev) && !RIGHT_ONLY.has(prev);
      const pair = LAM_ALEF[chars[i + 1]];
      result.push(connectsBefore ? pair[1] : pair[0]);
      i++; // تخطّي الألف
      continue;
    }

    if (!isArabicLetter(ch)) {
      result.push(ch.codePointAt(0)!);
      continue;
    }

    const prev = chars[i - 1];
    const next = chars[i + 1];
    const connectsBefore = !!prev && isArabicLetter(prev) && !RIGHT_ONLY.has(prev);
    const connectsAfter = !!next && isArabicLetter(next);

    const forms = FORMS[ch];
    let form: number;
    if (connectsBefore && connectsAfter) form = forms[2];      // وسطي
    else if (connectsBefore && !connectsAfter) form = forms[1]; // نهائي
    else if (!connectsBefore && connectsAfter) form = forms[3]; // ابتدائي
    else form = forms[0];                                       // منفصل
    result.push(form);
  }

  // عكس الحروف داخل الكلمة للعرض RTL
  return result.reverse().map((cp) => String.fromCodePoint(cp)).join("");
}

// يحاول تسجيل خط عربي مع jsPDF من public/fonts.
// يعيد اسم الخط إن نجح، أو null (فيبقى السلوك الحالي دون كسر).
export function registerArabicFont(doc: unknown): string | null {
  try {
    // ديناميكي كي لا يفشل البناء إن غاب الملف
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("path");
    const candidates = [
      "NotoSansArabic-Regular.ttf",
      "Amiri-Regular.ttf",
      "Tajawal-Regular.ttf",
      "Cairo-Regular.ttf",
    ];
    const dir = path.join(process.cwd(), "public", "fonts");
    for (const file of candidates) {
      const full = path.join(dir, file);
      if (fs.existsSync(full)) {
        const b64 = fs.readFileSync(full).toString("base64");
        const d = doc as {
          addFileToVFS: (n: string, d: string) => void;
          addFont: (n: string, f: string, s: string) => void;
        };
        d.addFileToVFS(file, b64);
        d.addFont(file, "Arabic", "normal");
        return "Arabic";
      }
    }
  } catch {
    /* الخط غير متاح — نتابع بالخط الافتراضي */
  }
  return null;
}
