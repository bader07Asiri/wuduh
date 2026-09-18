// ============================
// وضوح | Wuduh — قراءة قالب بيانات المشروع (Excel) وتحويله لحقول النموذج
// يُقرأ على السيرفر عبر exceljs. يدعم القوائم المنسدلة والجداول متعددة الصفوف.
// ============================

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

function mapLevel(v: string): "high" | "medium" | "low" {
  const t = (v || "").trim();
  if (/عال|مرتفع|high/i.test(t)) return "high";
  if (/منخفض|قليل|low/i.test(t)) return "low";
  return "medium";
}
function mapMethodology(v: string): "predictive" | "agile" | "hybrid" | undefined {
  const t = (v || "").toLowerCase();
  if (t.includes("تنبؤ") || t.includes("waterfall") || t.includes("شلال")) return "predictive";
  if (t.includes("رشيق") || t.includes("agile")) return "agile";
  if (t.includes("هجين") || t.includes("hybrid")) return "hybrid";
  return undefined;
}
const splitLines = (v: string) => (v || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const num = (v: string) => {
  const n = Number((v || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "لم يُرفق ملف" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const wb = new ExcelJS.Workbook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await wb.xlsx.load(buf as any);
    const ws = wb.worksheets[0];
    if (!ws) return NextResponse.json({ error: "الملف فارغ أو غير صالح" }, { status: 400 });

    // شبكة كل الصفوف (4 أعمدة نصية)
    const grid: string[][] = [];
    ws.eachRow((row) => {
      grid.push([1, 2, 3, 4].map(n => String(row.getCell(n).text ?? "").trim()));
    });

    // بحث key/value: أول صف تسميته (العمود الأول) تحتوي أحد المفاتيح → القيمة (العمود الثاني)
    const find = (...keys: string[]): string => {
      const r = grid.find(row => keys.some(k => row[0].includes(k)));
      return r ? (r[1] || "") : "";
    };

    // قراءة جدول: نحدد صف الترويسة ثم نقرأ الصفوف التالية حتى صف فارغ
    const readTable = (isHeader: (row: string[]) => boolean): string[][] => {
      const hi = grid.findIndex(isHeader);
      if (hi < 0) return [];
      const out: string[][] = [];
      for (let i = hi + 1; i < grid.length; i++) {
        const row = grid[i];
        if (!row[0]) break;                    // صف فارغ = نهاية الجدول
        if (/^[٠-٩0-9]+\s*\)/.test(row[0])) break; // عنوان قسم جديد
        out.push(row);
      }
      return out;
    };

    const intake: Record<string, unknown> = {};
    const put = (k: string, v: unknown) => {
      if (v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0)) intake[k] = v;
    };

    // قوائم ونصوص
    put("deliverables", splitLines(find("المخرجات الرئيسية")));
    put("out_of_scope", splitLines(find("خارج النطاق")));
    put("known_risks", splitLines(find("المخاطر المعروفة")));
    put("kpis", splitLines(find("مؤشرات النجاح", "KPI")));
    put("acceptance_criteria", find("معايير القبول"));
    put("quality_standards", find("معايير الجودة", "الامتثال"));
    put("sponsor", find("راعي المشروع"));
    put("funding_source", find("مصدر التمويل"));
    const meth = mapMethodology(find("المنهجية"));
    if (meth) intake.methodology = meth;

    // جداول
    const stakeholders = readTable(r => r[2].includes("التأثير"))
      .map(r => ({ name: r[0], role: r[1], influence: mapLevel(r[2]), interest: mapLevel(r[3]) }))
      .filter(s => s.name || s.role);
    put("stakeholders", stakeholders);

    const teamRoles = readTable(r => r[0].includes("الدور") && r[1].includes("العدد"))
      .map(r => ({ role: r[0], count: num(r[1]) ?? 1 }))
      .filter(r => r.role);
    put("team_roles", teamRoles);

    const milestones = readTable(r => r[0].includes("اسم المعلم"))
      .map(r => ({ name: r[0], date: r[1] }))
      .filter(m => m.name);
    put("milestones", milestones);

    const budget = readTable(r => r[0].includes("البند") && r[1].includes("المبلغ"))
      .map(r => ({ category: r[0], amount: num(r[1]) }))
      .filter(b => b.category);
    put("budget_breakdown", budget);

    const edition = find("إصدار PMBOK", "PMBOK").includes("8") ? "8" : "7";

    const form = {
      name: find("اسم المشروع"),
      description: find("وصف المشروع"),
      client_name: find("العميل", "الجهة المستفيدة"),
      start_date: find("تاريخ البداية"),
      end_date: find("تاريخ النهاية"),
      budget: num(find("الميزانية التقديرية")),
      currency: (find("العملة").toUpperCase().match(/SAR|USD|EUR/)?.[0]) || "SAR",
      team_size: num(find("عدد أعضاء الفريق")) ?? 1,
      objectives: splitLines(find("الأهداف")),
      constraints: find("القيود"),
      assumptions: find("الافتراضات"),
      pmbok_edition: edition,
      intake,
    };

    return NextResponse.json({ form });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ";
    return NextResponse.json({ error: `تعذّر قراءة الملف: ${msg}` }, { status: 500 });
  }
}
