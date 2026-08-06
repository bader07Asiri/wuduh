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

<section class="legal-hero"><div class="wrap"><span class="eyebrow">قانوني</span><h1 style="margin-top:12px">شروط الاستخدام</h1><p>آخر تحديث: ٥ أغسطس ٢٠٢٦ · يُرجى قراءتها بعناية</p></div></section>

<div class="wrap"><div class="legal-grid">
  <nav class="toc"><a class="active" href="#a">قبول الشروط</a><a href="#b">الحساب والاشتراك</a><a href="#c">الاستخدام المقبول</a><a href="#d">المخرجات والمسؤولية</a><a href="#e">الملكية الفكرية</a><a href="#f">إنهاء الخدمة</a><a href="#g">تعديل الشروط</a></nav>
  <div class="legal-body">
    <h2 id="a">١. قبول الشروط</h2><p>باستخدامك منصة وضوح، فإنك توافق على الالتزام بهذه الشروط. إذا لم توافق على أي جزء منها، يُرجى عدم استخدام المنصة.</p>
    <h2 id="b">٢. الحساب والاشتراك</h2><p>أنت مسؤول عن سرية بيانات حسابك وعن جميع الأنشطة التي تتم من خلاله. تختلف حدود الاستخدام حسب خطة الاشتراك، ويمكنك الترقية أو الإلغاء في أي وقت.</p>
    <h2 id="c">٣. الاستخدام المقبول</h2><p>تلتزم باستخدام المنصة للأغراض المشروعة فقط، وتمتنع عن:</p><ul><li>إساءة استخدام الخدمة أو محاولة اختراقها.</li><li>استخدام المخرجات في أنشطة غير قانونية.</li><li>إعادة بيع الخدمة دون إذن كتابي.</li></ul>
    <h2 id="d">٤. المخرجات والمسؤولية</h2><p>المخرجات مولّدة بالذكاء الاصطناعي وفق معايير PMI/PMBOK كأداة مساعدة. <b>يجب مراجعتها من متخصص قبل الاعتماد الرسمي</b> — ولا يتحمل وضوح مسؤولية القرارات المبنية عليها دون مراجعة بشرية.</p>
    <div class="notice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><div>وضوح أداة مساعدة لإدارة المشاريع ولا تُغني عن الحكم المهني للمختصين.</div></div>
    <h2 id="e">٥. الملكية الفكرية</h2><p>تحتفظ بملكية بيانات مشاريعك والمخرجات التي تولّدها. تبقى ملكية المنصة وتصميمها وعلامتها التجارية «وضوح» حقاً حصرياً لنا.</p>
    <h2 id="f">٦. إنهاء الخدمة</h2><p>يحق لنا تعليق أو إنهاء الحسابات المخالفة لهذه الشروط. يمكنك إغلاق حسابك في أي وقت مع الاحتفاظ بحق تصدير بياناتك.</p>
    <h2 id="g">٧. تعديل الشروط</h2><p>قد نحدّث هذه الشروط من وقت لآخر، وسنخطرك بالتغييرات الجوهرية. استمرارك في الاستخدام بعد التحديث يعني موافقتك على الشروط المعدّلة.</p>
  </div>
</div></div>

<div class="footer" style="margin-top:20px"><div class="wrap"><div class="foot-b" style="border:none;padding-top:0"><span>© 2026 وضوح | Wuduh — جميع الحقوق محفوظة</span><a href="/privacy" style="color:var(--blue);font-weight:700">→ سياسة الخصوصية</a></div></div></div>
`;
