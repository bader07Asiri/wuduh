import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Target, Eye, Zap, Shield, Users, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | وضوح Wuduh",
  description: "وضوح — منصة إدارة المشاريع المبنية على معايير PMI/PMBOK. قصتنا، رؤيتنا، وسبب بناء وضوح.",
};

const values = [
  {
    icon: Eye,
    title: "الوضوح أولاً",
    description:
      "كل قرار نبنيه يبدأ بسؤال واحد: هل هذا يجعل إدارة المشاريع أوضح للمستخدم؟ لا تعقيد، لا ضجيج — فقط خطة واضحة قابلة للتنفيذ.",
    color: "bg-blue-50 text-brand-blue",
  },
  {
    icon: Target,
    title: "دقة المعايير الدولية",
    description:
      "نلتزم بـ PMBOK Guide الإصدار السابع وكل معايير PMI الرسمية. كل مخرج يولّده وضوح يُتحقق منه مقابل قائمة مراجعة PMI قبل أن يصل إليك.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Zap,
    title: "السرعة بلا تنازل",
    description:
      "خمس دقائق كافية لبناء خطة مشروع كاملة. نؤمن أن الإنجاز السريع والجودة العالية ليسا متناقضين — هذه الفكرة هي جوهر وضوح.",
    color: "bg-sky-50 text-brand-light",
  },
  {
    icon: Shield,
    title: "الثقة والأمان",
    description:
      "بياناتك ملكك. نحن لا نشاركها، لا نبيعها، ولا نستخدمها لتدريب نماذج الذكاء الاصطناعي. بنينا البنية التحتية لتكون آمنة بحكم تصميمها.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Users,
    title: "المنطقة العربية في القلب",
    description:
      "صمّمنا وضوح أولاً للمدير العربي. واجهة عربية كاملة، دعم للريال والدولار، وفهم عميق لبيئة الأعمال في السعودية والخليج.",
    color: "bg-amber-50 text-amber-600",
  },
];

const stats = [
  { value: "25+", label: "نوع وثيقة جاهزة" },
  { value: "PMI", label: "معايير معتمدة دولياً" },
  { value: "7 و 8", label: "إصدارات PMBOK المدعومة" },
  { value: "4", label: "صيغ تصدير مدعومة" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative bg-brand-gradient overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-brand-light/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <Zap size={14} className="text-brand-cyan" />
              <span className="text-white/90 text-sm font-medium font-arabic">قصة وضوح</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white font-arabic leading-tight mb-6">
              لأن كل مشروع يستحق<br />
              <span className="text-gradient">خطة احترافية</span>
            </h1>
            <p className="text-xl text-white/70 font-arabic max-w-2xl mx-auto leading-relaxed">
              وضوح وُلد من سؤال واحد: لماذا تظل إدارة المشاريع الاحترافية حكراً على من يملك شهادة PMP؟
              الجواب كان بناء وضوح.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose-arabic space-y-6 text-slate-600 text-lg leading-relaxed font-arabic">
              <p>
                في كل يوم، تُبدأ مئات المشاريع في المنطقة العربية بحماس كبير — وتنتهي بخيبة أمل
                بسبب غياب التخطيط. ليس لأن أصحابها عديمو الكفاءة، بل لأن إدارة المشاريع
                الاحترافية تتطلب خبرة وأدوات ووقتاً لا يملكها الجميع.
              </p>
              <p>
                <span className="text-slate-900 font-bold">وضوح</span> جاء ليغير هذه المعادلة.
                منصة ذكاء اصطناعي تحوّل تفاصيل مشروعك — مهما كان حجمه أو قطاعه —
                إلى خطة إدارة مشروع كاملة وفق معايير PMI الدولية، في أقل من خمس دقائق.
              </p>
              <p>
                لسنا مجرد أداة لتوليد وثائق. نحن نؤمن أن كل مدير مشروع، سواء كان يبني برجاً
                أو يطلق تطبيقاً أو يدير حملة تسويقية، يستحق أن يبدأ مشروعه بوضوح كامل:
                أهداف محددة، مخاطر محسوبة، جدول زمني واقعي، وفريق يعرف دوره.
              </p>
              <p className="text-slate-900 font-bold text-xl">
                هذا ما نبنيه. هذا هو وضوح.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-slate-50 border-y border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-4xl font-black text-brand-blue font-latin mb-1">{value}</div>
                  <div className="text-sm text-slate-500 font-arabic">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-navy-950 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
                    <Eye size={20} className="text-brand-cyan" />
                  </div>
                  <h3 className="text-xl font-black font-arabic">رؤيتنا</h3>
                </div>
                <p className="text-white/70 font-arabic leading-relaxed">
                  عالم تُدار فيه كل مشاريع المنطقة العربية بمستوى احترافية PMP — بصرف النظر عن
                  حجم المنظمة أو خبرة الفريق. نؤمن أن الوضوح في التخطيط حق، لا امتياز.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                    <Target size={20} className="text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-arabic">مهمتنا</h3>
                </div>
                <p className="text-slate-600 font-arabic leading-relaxed">
                  تحويل معايير PMI الدولية من دليل نظري يقرأه المتخصصون إلى أداة عملية
                  يستخدمها كل مدير مشروع — من أول يوم، بدون تدريب مطوّل، وبأقل وقت ممكن.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black text-slate-900 font-arabic mb-3">قيمنا</h2>
              <p className="text-slate-500 font-arabic">المبادئ التي نبني عليها كل قرار</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-card transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-arabic mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 font-arabic leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-gradient relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-cyan/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-light/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-white font-arabic mb-4">
              هل أنت مستعد لتجربة الوضوح؟
            </h2>
            <p className="text-white/70 font-arabic mb-8 leading-relaxed">
              أول مشروع مجاني تماماً. لا تحتاج بطاقة ائتمان.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="gold" size="lg" className="w-full sm:w-auto px-8">
                  ابدأ مجاناً الآن
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 border-white/30 text-white hover:bg-white/10">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
