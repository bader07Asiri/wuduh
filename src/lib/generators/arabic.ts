// ============================
// وضوح | Wuduh — Arabic shaping + bidi for jsPDF
// jsPDF لا يشكّل العربية ولا يعالج الاتجاه؛ هذا الملف يقوم بذلك.
// الخوارزمية: تشكيل بأشكال العرض في الترتيب المنطقي، ثم عكس السطر،
// ثم إعادة ترتيب مقاطع اللاتيني/الأرقام لتظهر صحيحة (bidi مبسّط).
// ============================

const FORMS: Record<string, [number, number, number, number]> = {
  "ء": [0xfe80, 0xfe80, 0xfe80, 0xfe80],
  "آ": [0xfe81, 0xfe82, 0xfe82, 0xfe81],
  "أ": [0xfe83, 0xfe84, 0xfe84, 0xfe83],
  "ؤ": [0xfe85, 0xfe86, 0xfe86, 0xfe85],
  "إ": [0xfe87, 0xfe88, 0xfe88, 0xfe87],
  "ئ": [0xfe89, 0xfe8a, 0xfe8c, 0xfe8b],
  "ا": [0xfe8d, 0xfe8e, 0xfe8e, 0xfe8d],
  "ب": [0xfe8f, 0xfe90, 0xfe92, 0xfe91],
  "ة": [0xfe93, 0xfe94, 0xfe94, 0xfe93],
  "ت": [0xfe95, 0xfe96, 0xfe98, 0xfe97],
  "ث": [0xfe99, 0xfe9a, 0xfe9c, 0xfe9b],
  "ج": [0xfe9d, 0xfe9e, 0xfea0, 0xfe9f],
  "ح": [0xfea1, 0xfea2, 0xfea4, 0xfea3],
  "خ": [0xfea5, 0xfea6, 0xfea8, 0xfea7],
  "د": [0xfea9, 0xfeaa, 0xfeaa, 0xfea9],
  "ذ": [0xfeab, 0xfeac, 0xfeac, 0xfeab],
  "ر": [0xfead, 0xfeae, 0xfeae, 0xfead],
  "ز": [0xfeaf, 0xfeb0, 0xfeb0, 0xfeaf],
  "س": [0xfeb1, 0xfeb2, 0xfeb4, 0xfeb3],
  "ش": [0xfeb5, 0xfeb6, 0xfeb8, 0xfeb7],
  "ص": [0xfeb9, 0xfeba, 0xfebc, 0xfebb],
  "ض": [0xfebd, 0xfebe, 0xfec0, 0xfebf],
  "ط": [0xfec1, 0xfec2, 0xfec4, 0xfec3],
  "ظ": [0xfec5, 0xfec6, 0xfec8, 0xfec7],
  "ع": [0xfec9, 0xfeca, 0xfecc, 0xfecb],
  "غ": [0xfecd, 0xfece, 0xfed0, 0xfecf],
  "ف": [0xfed1, 0xfed2, 0xfed4, 0xfed3],
  "ق": [0xfed5, 0xfed6, 0xfed8, 0xfed7],
  "ك": [0xfed9, 0xfeda, 0xfedc, 0xfedb],
  "ل": [0xfedd, 0xfede, 0xfee0, 0xfedf],
  "م": [0xfee1, 0xfee2, 0xfee4, 0xfee3],
  "ن": [0xfee5, 0xfee6, 0xfee8, 0xfee7],
  "ه": [0xfee9, 0xfeea, 0xfeec, 0xfeeb],
  "و": [0xfeed, 0xfeee, 0xfeee, 0xfeed],
  "ى": [0xfeef, 0xfef0, 0xfef0, 0xfeef],
  "ي": [0xfef1, 0xfef2, 0xfef4, 0xfef3],
  "ـ": [0x0640, 0x0640, 0x0640, 0x0640],
};

// حروف تتصل من اليمين فقط (لا تصل بما بعدها)
const RIGHT_ONLY = new Set(["آ", "أ", "ؤ", "إ", "ا", "ة", "د", "ذ", "ر", "ز", "و", "ى"]);

const LAM = "ل";
const LAM_ALEF: Record<string, [number, number]> = {
  "آ": [0xfef5, 0xfef6],
  "أ": [0xfef7, 0xfef8],
  "إ": [0xfef9, 0xfefa],
  "ا": [0xfefb, 0xfefc],
};

const TASHKEEL = /[ً-ٰٟ]/; // حركات

function isArabicLetter(ch: string): boolean {
  return ch in FORMS;
}

export function containsArabic(text: string): boolean {
  return /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(text);
}

// حرف لاتيني/رقم/رمز يُكتب من اليسار لليمين
function isLtr(ch: string): boolean {
  return /[A-Za-z0-9À-ɏ@#%&+=/\\()[\]{}<>.:;,!?"'`~$^*_|\-–—]/.test(ch);
}

// تشكيل النص في الترتيب المنطقي (بدون عكس)
function shapeLogical(text: string): string {
  const chars = Array.from(text).filter((c) => !TASHKEEL.test(c));
  const res: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    // لام-ألف
    if (ch === LAM && i + 1 < chars.length && chars[i + 1] in LAM_ALEF) {
      const prev = chars[i - 1];
      const connectsBefore = !!prev && isArabicLetter(prev) && !RIGHT_ONLY.has(prev);
      const pair = LAM_ALEF[chars[i + 1]];
      res.push(String.fromCodePoint(connectsBefore ? pair[1] : pair[0]));
      i++;
      continue;
    }
    if (!isArabicLetter(ch)) {
      res.push(ch);
      continue;
    }
    const prev = chars[i - 1];
    const next = chars[i + 1];
    const cb = !!prev && isArabicLetter(prev) && !RIGHT_ONLY.has(prev);
    const ca = !!next && isArabicLetter(next);
    const f = FORMS[ch];
    let form: number;
    if (cb && ca) form = f[2];
    else if (cb && !ca) form = f[1];
    else if (!cb && ca) form = f[3];
    else form = f[0];
    res.push(String.fromCodePoint(form));
  }
  return res.join("");
}

// يشكّل ويعالج الاتجاه لسطر واحد ليُرسم صحيحاً في jsPDF (LTR)
export function shapeArabic(input: string): string {
  if (!input || !containsArabic(input)) return input;
  const shaped = Array.from(shapeLogical(input));
  shaped.reverse();
  // إعادة ترتيب مقاطع اللاتيني/الأرقام (بما فيها المسافات الداخلية)
  const arr = shaped;
  let i = 0;
  while (i < arr.length) {
    if (isLtr(arr[i])) {
      let j = i + 1;
      while (j < arr.length && (isLtr(arr[j]) || (arr[j] === " " && j + 1 < arr.length && isLtr(arr[j + 1])))) j++;
      const sub = arr.slice(i, j).reverse();
      for (let k = 0; k < sub.length; k++) arr[i + k] = sub[k];
      i = j;
    } else {
      i++;
    }
  }
  return arr.join("");
}

// تسجيل خط عربي مع jsPDF من public/fonts (يعيد اسم الخط أو null)
export function registerArabicFont(doc: unknown): string | null {
  try {
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
