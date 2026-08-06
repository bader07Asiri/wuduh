export const HTML = `
<style>
.page-hero{text-align:center;padding:74px 0 34px}
.page-hero h1{font-size:clamp(30px,5vw,46px);font-weight:900;margin:16px 0 12px}
.page-hero p{color:var(--slate);font-size:17px;max-width:520px;margin:0 auto}
.contact-grid{display:grid;grid-template-columns:340px 1fr;gap:24px;align-items:start;margin:20px 0 40px}
.info{display:flex;flex-direction:column;gap:14px}
.ic-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px;box-shadow:var(--shadow-sm);display:flex;gap:14px}
.ic-card .ci{width:46px;height:46px;border-radius:13px;background:#EDF2FB;color:var(--blue);display:grid;place-items:center;flex:none}
.ic-card .ci svg{width:22px;height:22px}
.ic-card b{font-weight:800;font-size:15px}.ic-card p{color:var(--slate);font-size:13.5px;margin-top:3px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:820px){.contact-grid{grid-template-columns:1fr}.row2{grid-template-columns:1fr}}
</style>
<nav class="mnav"><div class="wrap in">
  <a class="brand" href="/"><img class="blogo" src="/wuduh-assets/logo-full.png" alt="وضوح Wuduh"></a>
  <div class="mnav-links"><a href="/#features">الميزات</a><a href="/#how">كيف يعمل</a><a href="/pricing">التسعير</a><a href="/about">من نحن</a><a href="/contact" style="color:var(--blue)">تواصل</a></div>
  <div style="display:flex;gap:12px"><a class="btn btn-out btn-sm" href="/login">دخول</a><a class="btn btn-primary btn-sm" href="/signup">ابدأ مجاناً</a></div>
</div></nav>

<section class="page-hero"><div class="wrap"><span class="eyebrow">نرد على كل رسالة</span><h1>تواصل معنا</h1><p>فريقنا هنا للمساعدة — أرسل لنا رسالة وسنعود إليك خلال 24 ساعة عمل.</p></div></section>

<div class="wrap"><div class="contact-grid">
  <div class="info reveal">
    <div class="ic-card"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><div><b>البريد الإلكتروني</b><p>نتلقى استفساراتك عبر النموذج ونردّ على بريدك مباشرة.</p></div></div>
    <div class="ic-card"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><b>وقت الاستجابة</b><p>خلال 24 ساعة عمل — أحياناً أسرع.</p></div></div>
    <div class="ic-card"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V7l6-4 6 4v14"/><path d="M15 21V11l6 4v6"/></svg></span><div><b>للمؤسسات والجهات</b><p>تبحث عن حل مؤسسي؟ اذكر ذلك وسيتواصل معك مدير حساب متخصص.</p></div></div>
  </div>
  <div class="card reveal" style="padding:30px">
    <div class="mini-title" style="font-size:16px;margin-top:0"><svg style="width:18px;height:18px" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg> أرسل لنا رسالة</div>
    <div class="row2">
      <div class="field"><label class="label">الاسم الكامل <span style="color:var(--red)">*</span></label><input class="input" placeholder="مثال: بدر العسيري"></div>
      <div class="field"><label class="label">البريد الإلكتروني <span style="color:var(--red)">*</span></label><input class="input" type="email" placeholder="name@company.com"></div>
    </div>
    <div class="row2">
      <div class="field"><label class="label">اسم الشركة <span class="opt">(اختياري)</span></label><input class="input" placeholder="شركة النور للمقاولات"></div>
      <div class="field"><label class="label">موضوع الرسالة <span style="color:var(--red)">*</span></label><select class="select"><option>اختر الموضوع</option><option>استفسار عن الخطط والأسعار</option><option>مشكلة تقنية</option><option>طلب عرض تجريبي للمؤسسات</option><option>اقتراح أو ملاحظة</option><option>شراكة أو تكامل</option></select></div>
    </div>
    <div class="field"><label class="label">الرسالة <span style="color:var(--red)">*</span></label><textarea class="textarea" placeholder="اكتب رسالتك بتفصيل — كلما كانت المعلومات أوضح، كان ردنا أكثر فائدة." style="min-height:130px"></textarea><div style="text-align:left;font-size:12px;color:var(--muted);margin-top:5px">الحد الأدنى 20 حرفاً</div></div>
    <button class="btn btn-primary btn-lg">إرسال الرسالة <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg></button>
  </div>
</div></div>

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
