"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/types";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-cyan/10 text-brand-cyan text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full font-latin mb-4">
            Pricing
          </div>
          <h2 className="text-4xl font-black text-slate-900 font-arabic mb-4">أسعار شفافة وبسيطة</h2>
          <p className="text-lg text-slate-500 font-arabic mb-8">
            ابدأ مجاناً — ادفع فقط عندما تحتاج أكثر
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold font-arabic transition-all",
                !annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              شهري
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold font-arabic transition-all flex items-center gap-2",
                annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              سنوي
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">وفّر 17%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([key, plan], i) => {
            const isPopular = key === "professional";
            const price = annual ? plan.price_yearly / 12 : plan.price_monthly;

            return (
              <div
                key={key}
                className={cn(
                  "rounded-2xl p-6 border-2 relative",
                  isPopular
                    ? "border-brand-blue bg-navy-950 text-white scale-105 shadow-modal"
                    : "border-slate-100 bg-white"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 bg-brand-cyan text-slate-900 text-xs font-black px-4 py-1 rounded-full font-arabic">
                      <Zap size={12} />
                      الأكثر شعبية
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={cn("text-xl font-black font-arabic mb-1", isPopular ? "text-white" : "text-slate-900")}>
                    {plan.name_ar}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={cn("text-4xl font-black font-latin", isPopular ? "text-white" : "text-slate-900")}>
                      {price === 0 ? "مجاناً" : `${Math.round(price)} ر.س`}
                    </span>
                    {price !== 0 && (
                      <span className={cn("text-sm font-arabic", isPopular ? "text-white/60" : "text-slate-400")}>
                        / شهر
                      </span>
                    )}
                  </div>
                  {annual && price !== 0 && (
                    <div className={cn("text-xs font-arabic", isPopular ? "text-white/60" : "text-slate-400")}>
                      يُفوتر سنوياً — {plan.price_yearly} ر.س
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={16} className={cn("mt-0.5 flex-shrink-0", isPopular ? "text-brand-cyan" : "text-emerald-500")} />
                      <span className={cn("text-sm font-arabic", isPopular ? "text-white/80" : "text-slate-600")}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button
                    variant={isPopular ? "gold" : "outline"}
                    className={cn("w-full", !isPopular && "border-slate-300 text-slate-700 hover:bg-slate-50")}
                  >
                    {i === 0 ? "ابدأ مجاناً" : "اشترك الآن"}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-400 font-arabic mt-8">
          جميع الخطط تشمل تجربة مجانية 14 يوم — بدون بطاقة ائتمان
        </p>
      </div>
    </section>
  );
}
