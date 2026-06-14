import {
  Brain, FileCheck, BarChart3, AlertTriangle,
  Users, Download, Clock, Shield
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ذكاء اصطناعي متخصص بـ PMI",
    description: "مدرَّب حصراً على PMBOK Guide الإصدار السابع. يطبق معايير PMI الرسمية في كل مخرج.",
    color: "text-brand-blue bg-blue-50",
  },
  {
    icon: FileCheck,
    title: "25+ وثيقة جاهزة",
    description: "من ميثاق المشروع إلى تقرير الإغلاق — كل وثائق إدارة المشروع تُولَّد تلقائياً.",
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    icon: BarChart3,
    title: "Gantt Chart تفاعلي",
    description: "مخطط جانت احترافي مع تحليل المسار الحرج (CPM) وتواريخ التسليم.",
    color: "text-brand-light bg-sky-50",
  },
  {
    icon: AlertTriangle,
    title: "إدارة المخاطر الكاملة",
    description: "سجل مخاطر شامل مع خطة استجابة لكل خطر وفق PMBOK Risk Management.",
    color: "text-brand-cyan bg-brand-cyan/10",
  },
  {
    icon: Users,
    title: "إدارة أصحاب المصلحة",
    description: "تحليل Stakeholders، خطة تواصل، ومصفوفة تأثير وفق معايير PMI.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Download,
    title: "تصدير بكل الصيغ",
    description: "صدّر مشروعك كـ PDF، Word، Excel، أو PowerPoint — كلها جاهزة للتقديم.",
    color: "text-pink-600 bg-pink-50",
  },
  {
    icon: Clock,
    title: "5 دقائق من الصفر",
    description: "أدخل تفاصيل مشروعك، وضوح يبني الخطة الكاملة في أقل من 5 دقائق.",
    color: "text-brand-blue bg-blue-50",
  },
  {
    icon: Shield,
    title: "موثوق ومُتحقق",
    description: "كل مخرج يُتحقق منه تلقائياً مقابل قائمة مراجعة PMI قبل التسليم.",
    color: "text-emerald-500 bg-emerald-50",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-50 text-brand-blue text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full font-latin mb-4">
            Features
          </div>
          <h2 className="text-4xl font-black text-slate-900 font-arabic mb-4">
            كل ما يحتاجه مدير المشاريع
          </h2>
          <p className="text-lg text-slate-500 font-arabic max-w-2xl mx-auto">
            وضوح ليس مجرد قالب — هو مدير مشاريع افتراضي يعمل على مدار الساعة.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-slate-100 hover:border-brand-blue/30 hover:shadow-card transition-all duration-300"
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
  );
}
