import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | وضوح Wuduh",
  description: "سياسة خصوصية منصة وضوح — كيف نجمع بياناتك، نحميها، ونحترم خصوصيتك.",
};

const lastUpdated = "٦ أغسطس ٢٠٢٦";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Header */}
        <section className="bg-navy-950 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-black text-white font-arabic mb-3">سياسة الخصوصية</h1>
            <p className="text-white/50 font-arabic text-sm">آخر تحديث: {lastUpdated}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-10 font-arabic text-slate-600 leading-relaxed">

              <div>
                <p className="text-lg text-slate-700">
                  نحن في <strong className="text-slate-900">وضوح (Wuduh)</strong> نُقدّر خصوصيتك تقديراً حقيقياً. هذه السياسة تشرح بدقة وشفافية ما نجمعه من بيانات، وكيف نستخدمها، وما حقوقك كمستخدم.
                </p>
              </div>

              <Section title="١. ما البيانات التي نجمعها؟">
                <SubSection title="بيانات الحساب">
                  عند التسجيل نجمع: الاسم الكامل، عنوان البريد الإلكتروني، اسم الشركة (اختياري)، وبيانات الاشتراك. يُدار تسجيل الدخول عبر منصة <strong>Clerk</strong> الآمنة — نحن لا نخزن كلمات المرور أبداً.
                </SubSection>
                <SubSection title="بيانات المشاريع">
                  كل ما تُدخله عن مشاريعك — الأسماء، الأهداف، الميزانيات، الجداول الزمنية — يُخزّن في قاعدة بياناتنا الآمنة ويُستخدم فقط لتوليد مخرجاتك وتحسين تجربتك.
                </SubSection>
                <SubSection title="بيانات الاستخدام">
                  نجمع معلومات تقنية أساسية مثل نوع المتصفح وعنوان IP والصفحات التي تزورها، بهدف تشخيص المشاكل وتحسين الأداء — لا لغرض آخر.
                </SubSection>
                <SubSection title="بيانات الدفع">
                  تتم معالجة المدفوعات عبر <strong>Stripe</strong> المعتمدة عالمياً. وضوح لا يرى ولا يخزّن أي بيانات بطاقة ائتمان.
                </SubSection>
              </Section>

              <Section title="٢. كيف نستخدم بياناتك؟">
                <ul className="space-y-2 list-none">
                  {[
                    "تشغيل خدمة وضوح وتوليد مخرجات المشاريع",
                    "إرسال تحديثات ضرورية تتعلق بحسابك أو اشتراكك",
                    "تشخيص المشاكل التقنية وتحسين أداء المنصة",
                    "الرد على طلبات الدعم والتواصل",
                    "الامتثال للالتزامات القانونية",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-1 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-slate-700 font-semibold">
                  نحن لا نبيع بياناتك، ولا نشاركها مع أطراف ثالثة لأغراض تسويقية، ولا نستخدمها لتدريب نماذج الذكاء الاصطناعي.
                </p>
              </Section>

              <Section title="٣. الجهات الخارجية المشاركة في الخدمة">
                <p className="mb-4">نستخدم خدمات موثوقة لتشغيل المنصة، وكل منها يلتزم بأعلى معايير حماية البيانات:</p>
                <div className="space-y-3">
                  {[
                    { name: "Clerk", role: "إدارة تسجيل الدخول والمصادقة" },
                    { name: "Supabase", role: "قاعدة البيانات والتخزين الآمن" },
                    { name: "Stripe", role: "معالجة المدفوعات والاشتراكات" },
                    { name: "Anthropic (Claude AI)", role: "توليد مخرجات المشاريع بالذكاء الاصطناعي" },
                    { name: "الاستضافة السحابية", role: "تشغيل المنصة وتخزين الملفات (يجري الانتقال إلى منطقة سعودية)" },
                  ].map(({ name, role }) => (
                    <div key={name} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 min-w-[140px]">{name}</strong>
                      <span className="text-slate-500">{role}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="٤. أمان البيانات">
                <p>
                  نحمي بياناتك بتشفير TLS أثناء النقل وتشفير AES-256 في التخزين. صلاحيات الوصول مقيّدة بمبدأ الحد الأدنى — لا يصل إلى بياناتك إلا من يحتاج إليها فعلاً لتشغيل الخدمة.
                </p>
                <p className="mt-3">
                  في حال حدوث أي اختراق أمني يؤثر على بياناتك، سنُخطرك خلال 72 ساعة وفق المتطلبات القانونية المعمول بها.
                </p>
              </Section>

              <Section title="٥. مدة الاحتفاظ بالبيانات">
                <p>
                  نحتفظ ببيانات حسابك ومشاريعك طالما حسابك نشطاً. عند حذف حسابك، نحذف بياناتك الشخصية خلال 30 يوماً، مع الاحتفاظ ببعض البيانات المحايدة لأغراض قانونية أو محاسبية لمدة لا تتجاوز 5 سنوات وفق الأنظمة السعودية.
                </p>
              </Section>

              <Section title="٦. ملفات تعريف الارتباط (Cookies)">
                <p>
                  نستخدم ملفات تعريف ارتباط ضرورية للغاية (Essential Cookies) فقط، تشمل: بيانات جلسة تسجيل الدخول وتفضيلات اللغة. لا نستخدم ملفات تعريف ارتباط تتبعية أو إعلانية.
                </p>
              </Section>

              <Section title="٧. حقوقك كمستخدم">
                <p className="mb-3">لديك الحق في:</p>
                <ul className="space-y-2">
                  {[
                    "الاطلاع على جميع البيانات التي نحتفظ بها عنك",
                    "تصحيح أي بيانات غير دقيقة",
                    "طلب تصدير بياناتك (Data Portability)",
                    "حذف حسابك وبياناتك بشكل كامل",
                    "الاعتراض على أي معالجة لبياناتك",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-brand-blue mt-1 flex-shrink-0">◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  لممارسة أي من هذه الحقوق، تواصل معنا عبر{" "}
                  <a href="/contact" className="text-brand-blue underline">صفحة التواصل</a>{" "}
                  وسنستجيب خلال 30 يوماً وفق نظام حماية البيانات الشخصية. ولك الحق أيضاً في سحب موافقتك في أي وقت.
                </p>
              </Section>

              <Section title="٨. خصوصية الأطفال">
                <p>
                  وضوح موجّه للمهنيين والشركات. لا نجمع بيانات الأشخاص دون 18 عاماً عمداً. إذا علمنا بذلك، سنحذف البيانات فوراً.
                </p>
              </Section>

              <Section title="٩. تغييرات على هذه السياسة">
                <p>
                  قد نحدّث هذه السياسة من وقت لآخر. في حال أي تغيير جوهري، سنُخطرك عبر البريد الإلكتروني وسنُبرز التغييرات بوضوح. الاستمرار في استخدام وضوح بعد الإشعار يعني موافقتك على السياسة المحدّثة.
                </p>
              </Section>

              <Section title="١٠. الأساس النظامي للمعالجة">
                <p className="mb-3">نعالج بياناتك الشخصية استناداً إلى أساس نظامي واضح وفق نظام حماية البيانات الشخصية:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5"><span className="text-brand-blue mt-1 flex-shrink-0">◆</span><span><strong>تنفيذ العقد:</strong> لتشغيل حسابك وتقديم خدمة توليد المستندات.</span></li>
                  <li className="flex items-start gap-2.5"><span className="text-brand-blue mt-1 flex-shrink-0">◆</span><span><strong>الموافقة:</strong> عند تسجيلك ومنحك موافقتك الصريحة على هذه السياسة، ولك سحبها في أي وقت.</span></li>
                  <li className="flex items-start gap-2.5"><span className="text-brand-blue mt-1 flex-shrink-0">◆</span><span><strong>المصلحة المشروعة:</strong> لتأمين المنصة وتحسين الأداء، دون المساس بحقوقك.</span></li>
                  <li className="flex items-start gap-2.5"><span className="text-brand-blue mt-1 flex-shrink-0">◆</span><span><strong>الالتزام النظامي:</strong> للامتثال للأنظمة السعودية المعمول بها.</span></li>
                </ul>
              </Section>

              <Section title="١١. نقل البيانات خارج المملكة">
                <p>
                  بعض مزوّدي الخدمة الذين نعتمد عليهم (المصادقة، الاستضافة، معالجة الدفع، والذكاء الاصطناعي) قد يخزّنون أو يعالجون البيانات خارج المملكة العربية السعودية حالياً. نلتزم بضوابط النقل وفق نظام حماية البيانات الشخصية، ونعمل ضمن خطة معلنة على <strong>توطين البيانات داخل المملكة</strong> عبر الانتقال إلى استضافة سحابية في منطقة سعودية. ستُحدَّث هذه السياسة عند اكتمال التوطين.
                </p>
              </Section>

              <Section title="١٢. الجهة المنظِّمة وحق التظلّم">
                <p>
                  الجهة المنظِّمة لحماية البيانات في المملكة هي <strong>الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)</strong> عبر مكتب إدارة البيانات الوطنية (NDMO). إذا رأيت أن معالجتنا لبياناتك تخالف النظام، لك الحق في التواصل معنا أولاً لمعالجة الأمر، ثم تقديم شكوى للجهة المنظِّمة.
                </p>
              </Section>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-slate-700 font-semibold mb-2">هل عندك سؤال عن خصوصيتك؟</p>
                <p className="text-slate-500 text-sm">
                  تواصل معنا عبر{" "}
                  <a href="/contact" className="text-brand-blue font-semibold">صفحة التواصل</a>
                  {" "}— نرد خلال 48 ساعة عمل. (جهة اتصال الخصوصية المخصّصة تُعلَن عند استكمال التسجيل النظامي.)
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 font-arabic mb-4 pb-2 border-b border-slate-100">
        {title}
      </h2>
      <div className="space-y-3 text-slate-600">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p>{children}</p>
    </div>
  );
}
