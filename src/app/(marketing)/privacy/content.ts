export const HTML = `
<style>
.legal-hero{background:var(--paper2);border-bottom:1px solid var(--line);padding:44px 0}
.legal-hero h1{font-size:34px;font-weight:900}.legal-hero p{color:var(--slate);margin-top:8px}
.legal-grid{display:grid;grid-template-columns:240px 1fr;gap:40px;padding:40px 0}
.toc{position:sticky;top:90px;align-self:start;display:flex;flex-direction:column;gap:4px}
.toc a{padding:9px 14px;border-radius:10px;color:var(--slate);font-weight:600;font-size:14px}
.toc a:hover,.toc a.active{background:#EEF3FB;color:var(--blue)}
.legal-body h2{font-size:20px;font-weight:800;margin:28px 0 12px}.legal-body h2:first-child{margin-top:0}
.legal-body p{color:var(--slate);font-size:15px;margin-bottom:12px;line-height:1.9}
.legal-body ul{margin:0 20px 14px;color:var(--slate);font-size:15px;line-height:1.9}
@media(max-width:820px){.legal-grid{grid-template-columns:1fr}.toc{position:static;flex-direction:row;overflow-x:auto}}
</style>
<nav class="mnav"><div class="wrap in">
  <a class="brand" href="/"><img class="blogo" src="/wuduh-assets/logo-full.png" alt="وضوح Wuduh"></a>
  <div class="mnav-links"><a href="/#features">الميزات</a><a href="/pricing">التسعير</a><a href="/about">من نحن</a><a href="/contact">تواصل</a></div>
  <a class="btn btn-primary btn-sm" href="/signup">ابدأ مجاناً</a>
</div></nav>

<section class="legal-hero"><div class="wrap"><span class="eyebrow">قانوني</span><h1 style="margin-top:12px">سياسة الخصوصية</h1><p>آخر تحديث: ٥ أغسطس ٢٠٢٦ · خصوصيتك أولوية عندنا</p></div></section>

<div class="wrap"><div class="legal-grid">
  <nav class="toc"><a class="active" href="#a">مقدمة</a><a href="#b">البيانات التي نجمعها</a><a href="#c">كيف نستخدمها</a><a href="#d">مشاركة البيانات</a><a href="#e">الأمان</a><a href="#f">حقوقك</a><a href="#g">التواصل</a></nav>
  <div class="legal-body">
    <h2 id="a">١. مقدمة</h2><p>في وضوح نلتزم بحماية خصوصيتك. توضّح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها عند استخدامك لمنصتنا لإدارة المشاريع وفق معايير PMI/PMBOK.</p>
    <h2 id="b">٢. البيانات التي نجمعها</h2><p>نجمع الحد الأدنى اللازم لتقديم الخدمة:</p><ul><li>بيانات الحساب: الاسم والبريد الإلكتروني.</li><li>بيانات المشاريع: التفاصيل التي تدخلها لبناء الخطط والمخرجات.</li><li>بيانات استخدام تقنية لتحسين أداء المنصة.</li></ul>
    <h2 id="c">٣. كيف نستخدم بياناتك</h2><p>نستخدم بياناتك حصراً لتشغيل المنصة وتوليد مخرجات مشاريعك وتحسين تجربتك. <b>لا نستخدم بيانات مشاريعك لتدريب نماذج الذكاء الاصطناعي.</b></p>
    <h2 id="d">٤. مشاركة البيانات</h2><p>لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث لأغراض تسويقية. نستعين فقط بمزوّدي بنية تحتية موثوقين ضمن اتفاقيات صارمة لحماية البيانات.</p>
    <h2 id="e">٥. الأمان والحماية</h2><p>بياناتك مشفّرة أثناء النقل والتخزين، ومخزّنة في خوادم آمنة. بنيْنا البنية التحتية لتكون آمنة بحكم تصميمها.</p>
    <h2 id="f">٦. حقوقك</h2><p>لك الحق في الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت، وتصدير بيانات مشاريعك، أو إغلاق حسابك متى شئت.</p>
    {P}<h2>الأساس النظامي للمعالجة</h2><p>نعالج بياناتك وفق نظام حماية البيانات الشخصية استناداً إلى: تنفيذ العقد لتشغيل حسابك، وموافقتك الصريحة عند التسجيل (ولك سحبها)، والمصلحة المشروعة لتأمين المنصة، والالتزام النظامي.</p><h2>نقل البيانات خارج المملكة</h2><p>قد يعالج بعض مزوّدي الخدمة (المصادقة، الاستضافة، الدفع، والذكاء الاصطناعي) البيانات خارج المملكة حالياً. نلتزم بضوابط النقل النظامية، ونعمل ضمن خطة معلنة على توطين البيانات داخل المملكة عبر الانتقال إلى استضافة في منطقة سعودية.</p><h2>الجهة المنظِّمة وحق التظلّم</h2><p>الجهة المنظِّمة هي الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA) عبر مكتب إدارة البيانات الوطنية (NDMO). إذا رأيت مخالفة، لك التواصل معنا أولاً ثم تقديم شكوى للجهة المنظِّمة.</p><h2 id="g">٧. التواصل معنا</h2><p>لأي استفسار حول خصوصيتك، تواصل معنا عبر <a href="/contact" style="color:var(--blue);font-weight:700">صفحة التواصل</a> وسنرد خلال 24 ساعة عمل.</p>
  </div>
</div></div>

<div class="footer" style="margin-top:20px"><div class="wrap"><div class="foot-b" style="border:none;padding-top:0"><span>© 2026 وضوح | Wuduh — جميع الحقوق محفوظة</span><a href="/terms" style="color:var(--blue);font-weight:700">شروط الاستخدام ←</a></div></div></div>
`;
