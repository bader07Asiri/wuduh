import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";

const stats = [
  { value: "PMI",    label: "معايير معتمدة" },
  { value: "25+",   label: "نوع مخرجات" },
  { value: "5 دقائق", label: "لبناء خطة كاملة" },
];

export function Hero() {
  return (
    <section className="relative bg-brand-gradient overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Zap size={14} className="text-brand-cyan" />
            <span className="text-white/90 text-sm font-medium font-arabic">
              مبني وفق معايير PMI / PMBOK Guide 7th Edition
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-arabic leading-tight mb-6">
            إدارة مشاريعك<br />
            <span className="text-gradient">باحترافية PMP</span>
            <br />بدون مدير مشاريع
          </h1>

          <p className="text-xl text-white/70 font-arabic max-w-2xl mx-auto mb-10 leading-relaxed">
            وضوح يحول تفاصيل مشروعك إلى خطة احترافية كاملة في دقائق. أجندة، مخاطر، جداول، عروض — كل شيء جاهز بضغطة.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button variant="gold" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                ابدأ مجاناً الآن
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
                شاهد كيف يعمل
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            {["بدون بطاقة ائتمان", "مجاني للمشروع الأول", "إلغاء في أي وقت"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-white/60 text-sm font-arabic">
                <CheckCircle2 size={14} className="text-brand-light" />
                {item}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white font-arabic mb-1">{value}</div>
                <div className="text-xs text-white/50 font-arabic">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock UI Preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1 shadow-modal">
            <div className="bg-navy-950/80 rounded-xl overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 bg-white/10 rounded-md px-3 py-1 text-xs text-white/40 font-latin text-center">
                  app.wuduh.sa
                </div>
              </div>
              {/* Fake content */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-3">
                  {["لوحة التحكم", "مشاريعي", "مشروع جديد", "الإعدادات"].map((item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-xs font-arabic ${i === 0 ? "bg-brand-blue text-white shadow-glow" : "text-white/40"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-white text-sm font-bold font-arabic mb-3">مشروع توسعة المبنى التجاري</div>
                    <div className="grid grid-cols-3 gap-2">
                      {["الأجندة ✓", "المخاطر ✓", "الجدول ✓"].map((item) => (
                        <div key={item} className="bg-brand-light/20 text-brand-light text-xs rounded-lg p-2 text-center font-arabic">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl p-3">
                    <div className="text-brand-cyan text-xs font-bold font-arabic mb-1">🤖 وضوح AI</div>
                    <div className="text-white/60 text-xs font-arabic">تم بناء خطة المشروع الكاملة بنجاح — 6 مراحل، 24 مهمة، 8 مخاطر، وإنشاء 15 وثيقة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
