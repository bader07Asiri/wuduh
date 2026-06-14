const steps = [
  {
    number: "01",
    title: "أخبرنا عن نشاطك",
    description: "أسئلة بسيطة عن مجالك وحجم فريقك وتحدياتك المعتادة. يستغرق أقل من دقيقة.",
    icon: "🏗️",
    detail: "البناء، التقنية، الصحة، وأكثر من 8 قطاعات",
  },
  {
    number: "02",
    title: "أدخل تفاصيل مشروعك",
    description: "اسم المشروع، الأهداف، الميزانية، الفريق، والمدة. حقول واضحة ومنظمة.",
    icon: "📋",
    detail: "نموذج ذكي يقترح التفاصيل تلقائياً",
  },
  {
    number: "03",
    title: "وضوح يبني الأجندة",
    description: "الذكاء الاصطناعي يحلل معطياتك ويبني خطة مشروع كاملة وفق PMBOK في ثوانٍ.",
    icon: "🤖",
    detail: "مراحل، مهام، مخاطر، موارد، KPIs",
  },
  {
    number: "04",
    title: "راجع واعتمد",
    description: "اقرأ الأجندة، عدّل ما تريد، أضف ملاحظاتك. أنت المسؤول — وضوح يساعدك.",
    icon: "✅",
    detail: "تعديل كامل قبل توليد المخرجات",
  },
  {
    number: "05",
    title: "اختر مخرجاتك",
    description: "خطة المشروع، سجل المخاطر، Gantt Chart، عروض تقديمية — اختر ما تحتاج.",
    icon: "📦",
    detail: "25+ وثيقة متاحة",
  },
  {
    number: "06",
    title: "حمّل وشارك",
    description: "ملفاتك جاهزة كـ PDF، Word، Excel، PowerPoint — احترافية تامة جاهزة للتقديم.",
    icon: "🚀",
    detail: "4 صيغ مدعومة",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-brand-blue/10 text-brand-blue text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full font-latin mb-4">
            How It Works
          </div>
          <h2 className="text-4xl font-black text-slate-900 font-arabic mb-4">كيف يعمل وضوح؟</h2>
          <p className="text-lg text-slate-500 font-arabic max-w-xl mx-auto">
            ست خطوات بسيطة من فكرة المشروع إلى خطة احترافية كاملة
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(({ number, title, description, icon, detail }) => (
            <div
              key={number}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-brand-blue/20 hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">{icon}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold font-latin text-brand-blue/60 mb-1">{number}</div>
                  <h3 className="text-base font-bold text-slate-900 font-arabic">{title}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-arabic leading-relaxed mb-3">{description}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-arabic bg-emerald-50 rounded-lg px-3 py-1.5">
                <span>✓</span>
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
