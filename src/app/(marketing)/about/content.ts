export const HTML = `
<style>
.page-hero{text-align:center;padding:80px 0 40px;position:relative;overflow:hidden}
.page-hero .rings{position:absolute;top:-120px;right:50%;transform:translateX(50%);width:520px;height:520px;z-index:-1;opacity:.6}
.page-hero h1{font-size:clamp(30px,5vw,50px);font-weight:900;margin:16px 0 14px}
.page-hero p{color:var(--slate);font-size:18px;max-width:560px;margin:0 auto}
.stats-band{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:40px 0}
.sb{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px;text-align:center;box-shadow:var(--shadow-sm)}
.sb .n{font-size:32px;font-weight:900;color:var(--royal)}.sb .l{color:var(--muted);font-size:14px;margin-top:4px}
.values{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
.val{background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px;box-shadow:var(--shadow-sm);transition:.3s}
.val:hover{transform:translateY(-5px);box-shadow:var(--shadow)}
.val .vi{width:52px;height:52px;border-radius:13px;background:#EDF2FB;display:grid;place-items:center;margin-bottom:16px}
.val .vi svg{width:26px;height:26px;color:var(--royal)}
.val h3{font-size:18px;font-weight:800;margin-bottom:8px}.val p{color:var(--slate);font-size:14.5px}
.story{background:linear-gradient(160deg,#17306A,#0E1B33);color:#fff;border-radius:22px;padding:52px 44px;position:relative;overflow:hidden;margin:60px 0}
.story .cr{position:absolute;left:-60px;bottom:-60px;opacity:.28;width:260px;height:260px}
.story h2{font-size:30px;font-weight:900;margin-bottom:16px;position:relative}
.story p{font-size:16.5px;opacity:.92;max-width:680px;line-height:1.9;position:relative;margin-bottom:14px}
@media(max-width:820px){.stats-band,.values{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.stats-band,.values{grid-template-columns:1fr}}
</style>
<nav class="mnav"><div class="wrap in">
  <a class="brand" href="/"><img class="blogo" src="/wuduh-assets/logo-full.png" alt="وضوح Wuduh"></a>
  <div class="mnav-links"><a href="/#features">الميزات</a><a href="/#how">كيف يعمل</a><a href="/pricing">التسعير</a><a href="/about" style="color:var(--blue)">من نحن</a><a href="/contact">تواصل</a></div>
  <div style="display:flex;gap:12px"><a class="btn btn-out btn-sm" href="/login">دخول</a><a class="btn btn-primary btn-sm" href="/signup">ابدأ مجاناً</a></div>
</div></nav>

<section class="page-hero">
  <svg class="rings" viewBox="0 0 520 520" fill="none"><circle cx="260" cy="260" r="80" stroke="#DBE6F5" stroke-width="1.4"/><circle cx="260" cy="260" r="140" stroke="#E2EBF7" stroke-width="1.2"/><circle cx="260" cy="260" r="200" stroke="#E9EFF9" stroke-width="1"/></svg>
  <div class="wrap"><span class="eyebrow">من نحن</span>
    <h1>لأن كل مشروع يستحق <span style="color:var(--blue)">خطة واضحة</span></h1>
    <p>قصتنا ورؤيتنا وسبب بناء وضوح — منصة إدارة المشاريع المبنية على معايير PMI.</p>
  </div>
</section>

<div class="wrap">
  <div class="stats-band reveal">
    <div class="sb"><div class="n">25+</div><div class="l">نوع مستند جاهز</div></div>
    <div class="sb"><div class="n">PMI</div><div class="l">معايير معتمدة دولياً</div></div>
    <div class="sb"><div class="n">7 و 8</div><div class="l">إصدارات PMBOK المدعومة</div></div>
    <div class="sb"><div class="n">4</div><div class="l">صيغ تصدير</div></div>
  </div>

  <div class="sec-head center reveal" style="margin:20px auto 30px"><span class="eyebrow">قيمنا</span><h2>ما الذي يوجّه كل قرار نتخذه</h2></div>
  <div class="values">
    <div class="val reveal"><div class="vi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/></svg></div><h3>الوضوح أولاً</h3><p>كل قرار يبدأ بسؤال: هل هذا يجعل إدارة المشاريع أوضح للمستخدم؟ لا تعقيد، لا ضجيج — خطة قابلة للتنفيذ.</p></div>
    <div class="val reveal"><div class="vi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg></div><h3>دقة المعايير الدولية</h3><p>نلتزم بـ PMBOK الإصدارين السابع والثامن. كل مخرَج يُراجَع مقابل قائمة معايير قبل أن يصل إليك.</p></div>
    <div class="val reveal"><div class="vi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg></div><h3>السرعة بلا تنازل</h3><p>خمس دقائق كافية لبناء خطة مشروع كاملة. نؤمن أن الإنجاز السريع والجودة العالية ليسا متناقضين.</p></div>
    <div class="val reveal"><div class="vi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div><h3>الثقة والأمان</h3><p>بياناتك ملكك. لا نشاركها ولا نستخدمها لتدريب النماذج. بنية آمنة بحكم تصميمها.</p></div>
    <div class="val reveal"><div class="vi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M2 12h20M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></div><h3>المنطقة العربية في القلب</h3><p>صمّمنا وضوح أولاً للمدير العربي: واجهة عربية كاملة، ودعم للريال، وفهم لبيئة الأعمال في السعودية والخليج.</p></div>
    <div class="val reveal"><div class="vi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/></svg></div><h3>التطوير المستمر</h3><p>نصغي لمستخدمينا ونطوّر المنصة باستمرار — كل تحديث يقرّبنا من إدارة مشاريع بلا احتكاك.</p></div>
  </div>

  <div class="story reveal">
    <svg class="cr" viewBox="0 0 260 260" fill="none"><circle cx="130" cy="130" r="60" stroke="#5C93F0" stroke-width="1.4"/><circle cx="130" cy="130" r="95" stroke="#3A63C0" stroke-width="1.2"/><circle cx="130" cy="130" r="28" stroke="#00B4D8" stroke-width="1.4"/></svg>
    <h2>قصة وضوح</h2>
    <p>وُلد وضوح من سؤال واحد: لماذا تظل إدارة المشاريع الاحترافية حكراً على من يملك شهادة PMP؟ في كل يوم تُبدأ مئات المشاريع في المنطقة بحماس كبير، لكن كثيراً منها يتعثّر لغياب تخطيط منهجي.</p>
    <p>الجواب كان بناء وضوح: مدير مشاريع افتراضي يضع خبرة PMI بين يدي كل رائد أعمال ومقاول ومدير، بالعربية وفي دقائق — لأن كل مشروع، مهما كان حجمه، يستحق خطة واضحة.</p>
  </div>
</div>

<div class="footer"><div class="wrap">
  <div class="foot">
    <div class="fabout"><a class="brand" href="/"><img class="blogo" src="/wuduh-assets/logo-full-light.png" alt="وضوح Wuduh"></a><p>إدارة مشاريعك باحترافية PMP — بدون مدير مشاريع، وفق معايير PMI العالمية.</p></div>
    <div class="fcol"><h5>المنتج</h5><a href="/#features">الميزات</a><a href="/#how">كيف يعمل</a><a href="/pricing">التسعير</a></div>
    <div class="fcol"><h5>الشركة</h5><a href="/about">من نحن</a><a href="/contact">تواصل معنا</a></div>
    <div class="fcol"><h5>قانوني</h5><a href="/privacy">سياسة الخصوصية</a><a href="/terms">شروط الاستخدام</a></div>
  </div>
  <div class="foot-b"><span>© 2026 وضوح | Wuduh — جميع الحقوق محفوظة</span><span class="en">PMI / PMBOK Guide 7th &amp; 8th Edition</span></div>
</div></div>

`;
