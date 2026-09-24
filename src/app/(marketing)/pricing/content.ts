export const HTML = `
<style>
.page-hero{text-align:center;padding:70px 0 24px}
.page-hero h1{font-size:clamp(30px,5vw,46px);font-weight:900;margin:16px 0 12px}
.page-hero p{color:var(--slate);font-size:17px}
.toggle{display:flex;align-items:center;justify-content:center;gap:14px;margin:24px auto 40px;color:var(--muted);font-weight:700}
.toggle .on{color:var(--ink)}
.sw{width:56px;height:31px;border-radius:99px;background:var(--blue);position:relative;cursor:pointer;border:none}
.sw i{position:absolute;top:4px;right:4px;width:23px;height:23px;border-radius:50%;background:#fff;transition:.28s}
.sw.annual i{right:29px}
.save{font-size:12px;font-weight:800;color:var(--green);background:var(--green-bg);padding:4px 10px;border-radius:8px}
.plans{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:stretch}
.plan{background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px 22px;display:flex;flex-direction:column;box-shadow:var(--shadow-sm);position:relative;transition:.3s}
.plan:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
.plan.pop{border:2px solid var(--blue);box-shadow:0 30px 60px -30px rgba(37,99,235,.45)}
.plan .pt{position:absolute;top:-13px;right:50%;transform:translateX(50%);background:var(--blue);color:#fff;font-size:11.5px;font-weight:800;padding:4px 14px;border-radius:999px;white-space:nowrap}
.plan h3{font-size:18px;font-weight:800}.plan .price{font-size:34px;font-weight:900;margin:8px 0 2px}
.plan .price small{font-size:13px;color:var(--muted);font-weight:600}
.plan .per{color:var(--muted);font-size:12.5px;margin-bottom:18px;min-height:16px}
.plan ul{list-style:none;flex:1;margin-bottom:18px}
.plan li{display:flex;gap:8px;font-size:14px;color:var(--slate);margin-bottom:10px;font-weight:500}
.plan li svg{width:17px;height:17px;color:var(--blue);flex:none;margin-top:3px}
.faq{max-width:760px;margin:66px auto 0}
.faq h2{text-align:center;font-size:30px;font-weight:900;margin-bottom:26px}
.qa{background:#fff;border:1px solid var(--line);border-radius:14px;margin-bottom:12px;overflow:hidden}
.qa .q{padding:18px 20px;font-weight:700;font-size:15.5px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px}
.qa .q svg{width:20px;height:20px;color:var(--blue);transition:.2s;flex:none}
.qa.open .q svg{transform:rotate(45deg)}
.qa .a{padding:0 20px;max-height:0;overflow:hidden;color:var(--slate);font-size:14.5px;transition:.3s}
.qa.open .a{padding:0 20px 18px;max-height:220px}
@media(max-width:960px){.plans{grid-template-columns:1fr 1fr}.plan.pop{transform:none}}
@media(max-width:560px){.plans{grid-template-columns:1fr}}
</style>
<nav class="mnav"><div class="wrap in">
  <a class="brand" href="/"><img class="blogo" src="/wuduh-assets/logo-full.png" alt="وضوح Wuduh"></a>
  <div class="mnav-links"><a href="/#features">الميزات</a><a href="/#how">كيف يعمل</a><a href="/pricing" style="color:var(--blue)">التسعير</a><a href="/about">من نحن</a><a href="/contact">تواصل</a></div>
  <div style="display:flex;gap:12px"><a class="btn btn-out btn-sm" href="/login">دخول</a><a class="btn btn-primary btn-sm" href="/signup">ابدأ مجاناً</a></div>
</div></nav>

<section class="page-hero"><div class="wrap"><span class="eyebrow">الأسعار</span><h1>أسعار شفّافة وبسيطة</h1><p>ابدأ مجاناً — وادفع فقط عندما تحتاج أكثر.</p>
  <div class="toggle"><span class="on" id="lblM">شهري</span><button class="sw" id="sw"><i></i></button><span id="lblY">سنوي</span><span class="save">وفّر 17%</span></div>
</div></section>

<div class="wrap">
  <div class="plans">
    <div class="plan reveal"><h3>المجانية</h3><div class="price">مجاناً</div><div class="per">للأبد</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 5 مخرجات شهرياً</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> كل صيغ التصدير</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 125+ ثيم · PMBOK 7 و 8</li></ul>
      <a class="btn btn-out" href="/signup">ابدأ مجاناً</a></div>
    <div class="plan reveal"><h3>المبتدئ</h3><div class="price"><span data-m="109" data-y="90">109</span> <small>ر.س/شهر</small></div><div class="per per-note">للأفراد والمستقلّين</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 30 مخرجة شهرياً</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> بدون علامة مائية</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> دعم بالبريد</li></ul>
      <a class="btn btn-out" href="/signup">اشترك الآن</a></div>
    <div class="plan pop reveal"><span class="pt">الأكثر شعبية</span><h3>الاحترافي</h3><div class="price"><span data-m="299" data-y="248">299</span> <small>ر.س/شهر</small></div><div class="per per-note">للشركات والفرق</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 150 مخرجة شهرياً</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> هوية مؤسستك على المستندات</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> إدارة الفريق والأقسام</li></ul>
      <a class="btn btn-primary" href="/signup">اشترك الآن</a></div>
    <div class="plan reveal"><h3>المؤسسي</h3><div class="price"><span data-m="749" data-y="622">749</span> <small>ر.س/شهر</small></div><div class="per per-note">طبقة الإدارة + 299 ر.س لكل مقعد منتِج · المشرفون مجاناً</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> لوحة إدارة المؤسسة: رؤية كل الأعمال والأقسام</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> كل عضو منتِج = مقعد احترافي (150 مخرجة/شهر)</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> إشراف بلا تكلفة + مشاركة ملفات بين الأقسام</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> تقارير المحفظة + API + مدير حساب + SLA</li></ul>
      <a class="btn btn-out" href="/contact">تواصل معنا</a></div>
  </div>
  <p class="center" style="color:var(--muted);margin-top:24px;font-weight:600">جميع الخطط تشمل تجربة مجانية 14 يوماً — بدون بطاقة ائتمان.</p>

  <div class="faq">
    <h2>أسئلة شائعة</h2>
    <div class="qa open"><div class="q">هل يمكنني إلغاء الاشتراك في أي وقت؟ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></div><div class="a">نعم، تستطيع إلغاء اشتراكك في أي وقت وستحتفظ بإمكانية الوصول حتى نهاية فترة الفوترة الحالية.</div></div>
    <div class="qa"><div class="q">هل بياناتي آمنة؟ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></div><div class="a">نعم تماماً. بياناتك مشفّرة ومخزّنة في خوادم آمنة، ولا نشاركها مع أي طرف ثالث ولا نستخدمها لتدريب النماذج.</div></div>
    <div class="qa"><div class="q">هل يدعم وضوح قطاعات غير البناء؟ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></div><div class="a">نعم. ندعم حالياً: البناء والإنشاءات، التقنية، الصحة، التصنيع، التعليم، التجزئة، والمالية.</div></div>
    <div class="qa"><div class="q">هل المخرجات متوافقة مع معايير PMI الرسمية؟ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></div><div class="a">تختار الإصدار السابع أو الثامن من PMBOK عند إنشاء المشروع، وكل مخرَج مبني وفق المعيار ومراجَع قبل التسليم.</div></div>
    <div class="qa"><div class="q">ما طرق الدفع المقبولة؟ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></div><div class="a">نقبل جميع البطاقات الائتمانية، مدى، وApple Pay عبر بوابة دفع آمنة.</div></div>
  </div>
</div>

<div class="footer"><div class="wrap">
  <div class="foot">
    <div class="fabout"><a class="brand" href="/"><img class="blogo" src="/wuduh-assets/logo-full-light.png" alt="وضوح Wuduh"></a><p>إدارة مشاريعك باحترافية PMP — بدون مدير مشاريع.</p></div>
    <div class="fcol"><h5>المنتج</h5><a href="/#features">الميزات</a><a href="/pricing">التسعير</a></div>
    <div class="fcol"><h5>الشركة</h5><a href="/about">من نحن</a><a href="/contact">تواصل معنا</a></div>
    <div class="fcol"><h5>قانوني</h5><a href="/privacy">الخصوصية</a><a href="/terms">الشروط</a></div>
  </div>
  <div class="foot-b"><span>© 2026 وضوح | Wuduh — جميع الحقوق محفوظة</span><span class="en">PMI / PMBOK Guide 7th &amp; 8th Edition</span></div>
</div></div>

`;
