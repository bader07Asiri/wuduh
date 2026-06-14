import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التسعير | وضوح Wuduh",
  description: "خطط اشتراك مرنة لأفراد وشركات وتقدير دقيق للتكاليف.",
};

const faq = [
  {
    q: "هل يمكنني إلغاء الاشتراك في أي وقت؟",
    a: "نعم، تستطيع إلغاء اشتراكك في أي وقت. ستحتفظ بإمكانية الوصول حتى نهاية فترة الفوترة الحالية.",
  },
  {
    q: "هل بياناتي آمنة؟",
    a: "نعم تماماً. بياناتك مشفّرة ومخزّنة في خوادم آمنة. لا نشارك بياناتك مع أي طرف ثالث.",
  },
  {
    q: "هل يدعم وضوح قطاعات غير البناء؟",
    a: "نعم! ندعم حالياً: البناء والإنشاءات، التقنية، الصحة، التصنيع، التعليم، التجزئة، والمالية.",
  },
  {
    q: "هل المخرجات متوافقة مع معايير PMI الرسمية؟",
    a: "نعم. كل مخرج مبني وفق PMBOK Guide الإصدار السابع ومراجع مقابل معايير PMI قبل التسليم.",
  },
  {
    q: "هل يمكنني الترقية أو التخفيض بين الخطط؟",
    a: "نعم، يمكنك تغيير خطتك في أي وقت. التغيير يُطبّق فوراً مع احتساب الفارق.",
  },
  {
    q: "ما طرق الدفع المقبولة؟",
    a: "نقبل جميع البطاقات الائتمانية، Apple Pay، وGoogle Pay عبر Stripe الآمن.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <div className="bg-brand-gradient py-20 text-center">
          <h1 className="text-5xl font-black text-white font-arabic mb-4">التسعير</h1>
          <p className="text-white/70 font-arabic text-lg max-w-xl mx-auto">
            ابدأ مجاناً — ادفع فقط عندما تحتاج أكثر
          </p>
        </div>

        <Pricing />

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black text-slate-900 font-arabic text-center mb-12">
              أسئلة شائعة
            </h2>
            <div className="space-y-4">
              {faq.map(({ q, a }) => (
                <div key={q} className="border border-slate-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 font-arabic mb-2">{q}</h3>
                  <p className="text-slate-500 font-arabic text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
