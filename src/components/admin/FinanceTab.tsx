"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { TrendingUp, TrendingDown, Coins, Wallet, PiggyBank, Shield, Zap } from "lucide-react";

interface Finance {
  currency: string;
  revenueMonthly: number;
  tokenCostMonthly: number;
  tokenCostTotal: number;
  tokensTotal: number;
  netMonthly: number;
  allocation: { tokenBudget: number; emergency: number; reserve: number; profit: number };
  perUser: { email: string | null; name: string | null; plan: string; revenue: number; cost: number; net: number }[];
}

const PLAN_LABELS: Record<string, string> = { free: "مجاني", starter: "مبتدئ", professional: "احترافي", enterprise: "مؤسسي" };
const sar = (n: number) => `${n.toLocaleString("ar")} ر.س`;

export function FinanceTab() {
  const [d, setD] = useState<Finance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/finance").then((r) => r.json()).then(setD).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (!d) return <p className="text-slate-400 font-arabic text-center py-8">تعذّر تحميل البيانات المالية</p>;

  const kpis = [
    { label: "الإيراد الشهري", value: sar(d.revenueMonthly), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "تكلفة التوكن (شهري)", value: sar(d.tokenCostMonthly), icon: Coins, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "الصافي الشهري", value: sar(d.netMonthly), icon: d.netMonthly >= 0 ? TrendingUp : TrendingDown, color: d.netMonthly >= 0 ? "text-emerald-600" : "text-red-600", bg: d.netMonthly >= 0 ? "bg-emerald-50" : "bg-red-50" },
    { label: "إجمالي التوكن المستهلك", value: d.tokensTotal.toLocaleString("ar"), icon: Zap, color: "text-brand-blue", bg: "bg-blue-50" },
  ];

  const buckets = [
    { label: "ميزانية شحن التوكن", value: d.allocation.tokenBudget, icon: Coins, note: "تغطية التكلفة الفعلية + هامش احتياط" },
    { label: "ادخار طوارئ (20%)", value: d.allocation.emergency, icon: Shield, note: "من الصافي بعد التوكن" },
    { label: "احتياطي تشغيلي (15%)", value: d.allocation.reserve, icon: PiggyBank, note: "مصاريف تشغيل متوقعة" },
    { label: "ربح / سحب", value: d.allocation.profit, icon: Wallet, note: "المتبقّي للأرباح" },
  ];

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{value}</div>
              <div className="text-xs text-slate-400 font-arabic">{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Income allocation */}
      <div>
        <h3 className="font-bold text-slate-900 font-arabic mb-1 flex items-center gap-2">
          <Wallet size={16} className="text-brand-blue" /> تقسيم الدخل الشهري
        </h3>
        <p className="text-xs text-slate-400 font-arabic mb-4">يُقسّم إيرادك تلقائياً على صناديق واضحة (نِسب افتراضية قابلة للتعديل لاحقاً)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {buckets.map(({ label, value, icon: Icon, note }) => (
            <Card key={label}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-brand-blue" />
                <span className="text-sm font-arabic font-bold text-slate-700">{label}</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">{sar(value)}</div>
              <div className="text-[11px] text-slate-400 font-arabic">{note}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Per-user profitability */}
      <div>
        <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
          <Coins size={16} className="text-brand-blue" /> الربح والتكلفة لكل حساب
        </h3>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-arabic">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="text-right p-3 font-semibold">المستخدم</th>
                  <th className="text-right p-3 font-semibold">الباقة</th>
                  <th className="text-right p-3 font-semibold">أخذنا منه</th>
                  <th className="text-right p-3 font-semibold">استهلك (توكن)</th>
                  <th className="text-right p-3 font-semibold">الصافي</th>
                </tr>
              </thead>
              <tbody>
                {d.perUser.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">لا توجد بيانات بعد — تظهر مع أول اشتراك أو توليد</td></tr>
                ) : d.perUser.map((u, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{u.name || "—"}</div>
                      <div className="text-xs text-slate-400 font-latin">{u.email}</div>
                    </td>
                    <td className="p-3 text-slate-600">{PLAN_LABELS[u.plan] ?? u.plan}</td>
                    <td className="p-3 text-emerald-600 font-bold">{sar(u.revenue)}</td>
                    <td className="p-3 text-amber-600">{sar(u.cost)}</td>
                    <td className={`p-3 font-black ${u.net >= 0 ? "text-emerald-600" : "text-red-600"}`}>{sar(u.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
