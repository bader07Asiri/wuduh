"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, Zap, CreditCard, User, Shield } from "lucide-react";
import { PLANS } from "@/types";
import { cn } from "@/lib/utils";

type PlanKey = keyof typeof PLANS;

export default function SettingsPage() {
  const { user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const currentPlan: string = "free"; // في الإنتاج: يُجلب من Supabase

  const handleUpgrade = async (plan: PlanKey) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 font-arabic">الإعدادات</h1>
        <p className="text-slate-400 font-arabic text-sm mt-1">إدارة حسابك واشتراكك</p>
      </div>

      {/* Profile */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User size={18} className="text-brand-blue" />
          <CardTitle>الملف الشخصي</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-xl font-black font-arabic">
            {user?.firstName?.[0] ?? "م"}
          </div>
          <div>
            <div className="font-bold text-slate-900 font-arabic text-lg">{user?.fullName}</div>
            <div className="text-slate-400 font-latin text-sm">{user?.emailAddresses?.[0]?.emailAddress}</div>
          </div>
          <Badge variant={currentPlan === "free" ? "default" : "gold"} className="mr-auto">
            {currentPlan === "free" ? "مجاني" : PLANS[currentPlan as PlanKey]?.name_ar}
          </Badge>
        </div>
      </Card>

      {/* Subscription Plans */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap size={18} className="text-brand-cyan" />
          <div>
            <CardTitle>خطة الاشتراك</CardTitle>
            <CardDescription>ترقية خطتك للحصول على مزايا أكثر</CardDescription>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
            const isCurrent = currentPlan === key;
            const isPopular = key === "professional";

            return (
              <div
                key={key}
                className={cn(
                  "rounded-2xl p-5 border-2 relative",
                  isCurrent ? "border-emerald-500 bg-emerald-50/50" :
                  isPopular ? "border-brand-blue bg-blue-50/50" :
                  "border-slate-100"
                )}
              >
                {isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-blue text-white text-[10px] font-black px-3 py-1 rounded-full font-arabic">
                      الأكثر شعبية
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full font-arabic">
                      خطتك الحالية
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-black text-slate-900 font-arabic text-lg">{plan.name_ar}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-latin text-slate-900">${plan.price_monthly}</span>
                    <span className="text-slate-400 text-xs font-arabic">/ شهر</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-arabic text-slate-600">
                      <Check size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="ghost" className="w-full" disabled>
                    خطتك الحالية ✓
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={isPopular ? "primary" : "outline"}
                    loading={loadingPlan === key}
                    onClick={() => handleUpgrade(key)}
                  >
                    ترقية إلى {plan.name_ar}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Billing */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={18} className="text-brand-blue" />
          <div>
            <CardTitle>الفوترة والدفع</CardTitle>
            <CardDescription>إدارة طرق الدفع والفواتير</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
          <Shield size={16} className="text-emerald-500" />
          <p className="text-sm font-arabic text-slate-600">
            جميع المدفوعات محمية بتشفير SSL عبر Stripe — أحد أكثر بوابات الدفع أماناً في العالم.
          </p>
        </div>
        {currentPlan !== "free" && (
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => toast.info("قريباً")}>
              إدارة طريقة الدفع
            </Button>
            <Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => toast.info("قريباً")}>
              إلغاء الاشتراك
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
