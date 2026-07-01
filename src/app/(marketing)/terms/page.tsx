import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام | وضوح Wuduh",
  description: "شروط وأحكام استخدام منصة وضوح — اقرأها قبل البدء.",
};

const lastUpdated = "١ يناير ٢٠٢٦";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Header */}
        <section className="bg-navy-950 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-black text-white font-arabic mb-3">شروط الاستخدام</h1>
            <p className="text-white/50 font-arabic text-sm">آخر تحديث: {lastUpdated}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-10 font-arabic text-slate-600 leading-relaxed">

              <div>
                <p className="text-lg text-slate-700">
                  مرحباً بك في <strong className="text-slate-900">وضوح (Wuduh)</strong>. باستخدامك للمنصة، فأنت توافق على الشروط والأحكام التالية. يُرجى قراءتها بعناية — فهي واضحة ومختصرة.
                </p>
              </div>

              <Section title="١. قبول الشروط">
                <p>
                  بتسجيلك في وضوح أو استخدامك لأي من خدماتها، فأنت تؤكد أنك قرأت هذه الشروط وفهمتها ووافقت على الالتزام بها. إذا كنت تستخدم وضوح باسم شركة أو مؤسسة، فأنت تُقرّ بأنك مفوَّض للموافقة عنها.
                </p>
              </Section>

              <Section title="٢. الخدمة المقدَّمة">
                <p>
                  وضوح منصة ذكاء اصطناعي متخصصة في توليد وثائق وخطط إدارة المشاريع وفق معايير PMI/PMBOK. نقدم ذلك عبر نماذج اشتراك شهرية وسنوية، مع مشروع مجاني أول لكل مستخدم.
                </p>
                <p className="mt-3">
                  نحتفظ بالحق في تعديل الخدمة أو تطويرها أو إيقاف أي ميزة في أي وقت، مع إشعار مسبق معقول للمشتركين المدفوعين.
                </p>
              </Section>

              <Section title="٣. حساب المستخدم">
                <p>أنت مسؤول عن:</p>
                <ul className="space-y-2 mt-3">
                  {[
                    "الحفاظ على سرية بيانات دخولك",
                    "جميع الأنشطة التي تتم عبر حسابك",
                    "إخطارنا فوراً عند الاشتباه بأي استخدام غير مصرح به",
                    "دقة المعلومات التي تُدخلها في المنصة",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-brand-blue mt-1 flex-shrink-0">◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="٤. الاشتراك والدفع">
                <SubSection title="الفاتورة والتجديد">
                  تُحصّل رسوم الاشتراك مقدماً. الاشتراكات الشهرية تتجدد تلقائياً كل 30 يوماً، والسنوية كل 12 شهراً، حتى يتم الإلغاء.
                </SubSection>
                <SubSection title="التجربة المجانية">
                  المشروع الأول مجاني تماماً دون الحاجة لبطاقة ائتمان. تنتهي التجربة المجانية بمجرد إكمال أول مشروع أو بعد 14 يوماً من التسجيل، أيهما أسبق.
                </SubSection>
                <SubSection title="سياسة الاسترداد">
                  يمكنك طلب استرداد كامل خلال 7 أيام من أول دفعة فعلية. بعد ذلك، لا يُسترد رسم الاشتراك الجاري. يُطبَّق هذا الشرط لكل دورة فوترة.
                </SubSection>
                <SubSection title="تغيير الأسعار">
                  نحتفظ بحق تعديل الأسعار مع إشعار مسبق لا يقل عن 30 يوماً. الاشتراكات القائمة تبقى بسعرها حتى انتهاء الدورة الحالية.
                </SubSection>
              </Section>

              <Section title="٥. الاستخدام المقبول">
                <p className="mb-3">يُسمح باستخدام وضوح للأغراض المشروعة وإدارة المشاريع الحقيقية. يُحظر تحديداً:</p>
                <ul className="space-y-2">
                  {[
                    "استخدام المنصة لأغراض غير قانونية أو مضرة",
                    "محاولة الوصول غير المصرح به لأنظمة وضوح أو بيانات مستخدمين آخرين",
                    "نشر محتوى مسيء أو مضلل عبر المنصة",
                    "إعادة بيع الخدمة أو توزيعها دون إذن كتابي مسبق",
                    "استخدام المنصة لتوليد محتوى يخالف الأنظمة السعودية أو الدولية",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-red-400 mt-1 flex-shrink-0">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="٦. الملكية الفكرية">
                <SubSection title="ملكية وضوح">
                  المنصة وتصميمها وكودها وعلامتها التجارية وكل محتواها ملكية حصرية لوضوح. لا يُمنحك أي حق في نسخ أو إعادة توزيع أو تحليل أي جزء منها.
                </SubSection>
                <SubSection title="ملكية محتواك">
                  كل البيانات التي تُدخلها والمخرجات التي تُولّدها لمشاريعك هي ملكيتك الكاملة. وضوح لا تدّعي أي ملكية على محتوى مشاريعك.
                </SubSection>
              </Section>

              <Section title="٧. حدود المسؤولية">
                <p>
                  وضوح أداة مساعدة لإدارة المشاريع، لا بديل عن الحكم المهني. المخرجات التي يولّدها الذكاء الاصطناعي اقتراحات احترافية مبنية على معايير PMI — المسؤولية النهائية عن القرارات تقع على المستخدم.
                </p>
                <p className="mt-3">
                  في أقصى حالات المسؤولية القانونية، لا تتجاوز مسؤوليتنا المبلغ المدفوع فعلياً خلال الأشهر الثلاثة السابقة للمطالبة.
                </p>
              </Section>

              <Section title="٨. إنهاء الخدمة">
                <p>
                  يمكنك إلغاء حسابك في أي وقت من إعدادات الحساب. نحتفظ بحق تعليق أو إنهاء حسابك عند انتهاك هذه الشروط، مع إشعار مسبق حين أمكن ذلك. عند الإنهاء، يمكنك تصدير بياناتك قبل الحذف النهائي.
                </p>
              </Section>

              <Section title="٩. القانون المطبق والنزاعات">
                <p>
                  تخضع هذه الشروط لأحكام نظام التجارة الإلكترونية السعودي وأنظمة الاتصالات وتقنية المعلومات في المملكة العربية السعودية. في حال أي نزاع، يُلجأ أولاً إلى الوساطة الودية، وعند تعذّرها تُحال القضايا إلى الجهات القضائية المختصة في المملكة.
                </p>
              </Section>

              <Section title="١٠. التعديلات على الشروط">
                <p>
                  قد نُعدّل هذه الشروط لتعكس تطورات الخدمة أو المتطلبات القانونية. سنُخطرك عبر البريد الإلكتروني قبل 14 يوماً من أي تعديل جوهري. استمرار الاستخدام بعد نفاذ التعديل يعني قبوله.
                </p>
              </Section>

              <div className="bg-navy-950 rounded-2xl p-6 text-white">
                <p className="font-semibold mb-2">هل تحتاج توضيحاً؟</p>
                <p className="text-white/60 text-sm">
                  إذا كان لديك أي سؤال حول هذه الشروط، تواصل معنا على{" "}
                  <a href="mailto:legal@wuduh.app" className="text-brand-cyan font-semibold">legal@wuduh.app</a>
                  {" "}— نرد خلال 48 ساعة عمل.
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
