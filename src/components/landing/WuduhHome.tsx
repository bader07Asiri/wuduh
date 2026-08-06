"use client";
import { useEffect } from "react";
import "./wuduh-home.css";

const HTML = `
<div class="intro" id="intro">
  <div class="i-ring"></div>
  <div class="i-scene">
    <div class="i-word blur"><img src="/wuduh-assets/logo-word.png" alt=""></div>
    <div class="i-word sharp"><img src="/wuduh-assets/logo-word.png" alt="WUDUH — Clarity in every project"></div>
    <div class="i-beam"></div>
    <div class="i-lens"><img src="/wuduh-assets/logo-lens.png" alt=""></div>
  </div>
</div>


<!-- NAV -->
<nav class="nav" id="nav"><div class="in">
  <a href="#top" class="brand"><img class="blogo" src="/wuduh-assets/logo-full.png" alt="وضوح Wuduh"></a>
  <div class="nav-links"><a href="#features">الميزات</a><a href="#how">كيف يعمل</a><a href="#outputs">المخرجات</a><a href="#pricing">التسعير</a></div>
  <div class="nav-r"><a class="lgn" href="/login">تسجيل الدخول</a><a class="btn btn-primary btn-sm" href="/signup">ابدأ مجاناً</a>
    <button class="burger" aria-label="القائمة"><span></span><span></span><span></span></button></div>
</div></nav>

<!-- HERO -->
<header class="hero" id="top"><div class="wrap in">
  <div class="hero-l">
    <div class="eyebrow hl-fade d1">منصة إدارة المشاريع</div>
    <h1 class="hl-fade d2">خطّط مشاريعك <span class="u">بوضوح</span>،<br>ونفّذها باحترافية <span class="en" style="font-weight:900">PMP</span></h1>
    <p class="lead hl-fade d3">وضوح يحوّل فكرة مشروعك — من الغموض إلى خطة واضحة — إلى حزمة مستندات احترافية كاملة وفق معايير PMI، بالعربية، خلال دقائق.</p>
    <div class="hero-cta hl-fade d4">
      <a class="btn btn-primary" href="/signup">ابدأ مجاناً<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></a>
      <a class="btn btn-out" href="#outputs">شاهد نموذج المخرجات</a>
    </div>
    <div class="hero-micro hl-fade d5">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> بدون بطاقة ائتمان</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> أول مشروع مجاني</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> عربي بالكامل</span>
    </div>
  </div>

  <div class="stage" id="stage">
    <svg class="rings" viewBox="0 0 520 520" fill="none"><g class="pulse"><circle cx="260" cy="260" r="74" stroke="#CBDAF0" stroke-width="1.5"/><circle cx="260" cy="260" r="126" stroke="#D3E0F2" stroke-width="1.4"/><circle cx="260" cy="260" r="180" stroke="#DBE6F5" stroke-width="1.2"/><circle cx="260" cy="260" r="232" stroke="#E4EDF8" stroke-width="1"/></g></svg>
    <div class="ghostcard g1"><div class="l" style="width:60%"></div><div class="l" style="width:100%"></div><div class="l" style="width:90%"></div><div class="l" style="width:75%"></div><div class="l" style="width:95%"></div></div>
    <div class="ghostcard g2"><div class="l" style="width:50%"></div><div class="l" style="width:85%"></div><div class="l" style="width:70%"></div><div class="l" style="width:92%"></div></div>

    <div class="doc-focus">
      <div class="concept-hold"><span class="concept"><span class="g"><i></i><i></i><i></i></span> من الغموض إلى الوضوح</span></div>
      <div class="docwrap">
        <span class="fb a"></span><span class="fb b"></span><span class="fb c"></span><span class="fb d"></span>
        <div class="doc focus-el">
          <div class="doc-h"><span class="di"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span><b>ميثاق المشروع</b><span class="lt en">CHARTER</span><span class="chip-ok">معتمد</span></div>
          <div class="doc-b">
            <div class="meta">
              <div class="m"><span>المشروع:</span> <b>توسعة المبنى التجاري</b></div>
              <div class="m"><span>العميل:</span> <b>مجموعة الفهد العقارية</b></div>
              <div class="m"><span>الراعي:</span> <b>م. سلطان الفهد</b></div>
              <div class="m"><span>المنهجية:</span> <b>تنبؤية (Predictive)</b></div>
              <div class="m"><span>المدة:</span> <b>٩٠ يوماً</b></div>
              <div class="m"><span>الميزانية:</span> <b>٢٫٤ مليون ر.س</b></div>
            </div>
            <div class="mini-title">أهداف المشروع</div>
            <div class="oline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> تسليم مبنى تجاري من ٤ طوابق ضمن ميزانية ٢٫٤ مليون ر.س.</div>
            <div class="oline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> الالتزام بكود البناء السعودي ومعايير السلامة.</div>
            <div class="oline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> الحصول على شهادة الإشغال قبل ٣٠ نوفمبر ٢٠٢٦.</div>
            <div class="mini-title">نطاق العمل</div>
            <div class="tag2">الحفر والأساسات · الهيكل الإنشائي · التشطيبات · الأنظمة الكهروميكانيكية.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div></header>

<!-- TRUST BAND -->
<div class="band"><div class="wrap">
  <div class="band-top">
    <div class="band-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/></svg> مبنيّ على معايير PMI / PMBOK — الإصداران 7 و 8</div>
    <span class="band-sep"></span>
    <div class="band-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg> بياناتك مشفّرة</div>
    <span class="band-sep"></span>
    <div class="band-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg> لا تُستخدم بياناتك للتدريب</div>
    <span class="band-sep"></span>
    <div class="band-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M8 11l4 4 4-4M4 21h16"/></svg> 4 صيغ تصدير</div>
  </div>
  <div class="clients-lbl">موثوق من فرق المشاريع والجهات — (شعارات عملائنا تُضاف قريباً)</div>
  <div class="clients"><span class="client-slot">شعار عميل</span><span class="client-slot">شعار عميل</span><span class="client-slot">شعار عميل</span><span class="client-slot">شعار عميل</span><span class="client-slot">شعار عميل</span></div>
</div></div>

<!-- FEATURES -->
<div class="sec" id="features"><div class="wrap">
  <div class="sec-head reveal">
    <div class="eyebrow">الإمكانات</div>
    <h2>كل ما يحتاجه مدير المشاريع، في مكان واحد</h2>
    <p>أدوات مبنيّة على منهجية PMI — من التخطيط حتى الإغلاق، بلا تعقيد.</p>
  </div>
  <div class="feat-grid">
    <div class="fcard reveal"><div class="fi"><svg viewBox="0 0 32 32" fill="none"><rect x="7" y="4" width="18" height="24" rx="3" stroke="#17306A" stroke-width="1.8"/><path d="M11 11h10M11 15h10M11 19h6" stroke="#17306A" stroke-width="1.8" stroke-linecap="round"/><circle cx="22" cy="21" r="4.5" fill="#EDF2FB" stroke="#2563EB" stroke-width="1.8"/><circle cx="22" cy="21" r="1.4" fill="#00B4D8"/></svg></div><h3>تخطيط ذكي وفق PMBOK</h3><p>خطة مشروع كاملة — أهداف، نطاق، مراحل، وموارد — وفق الإصدارين السابع والثامن، مراجَعة مقابل قائمة معايير.</p></div>
    <div class="fcard reveal"><div class="fi"><svg viewBox="0 0 32 32" fill="none"><rect x="9" y="7" width="15" height="19" rx="2.5" stroke="#17306A" stroke-width="1.8"/><path d="M7 10v15a2 2 0 0 0 2 2h11" stroke="#B9C6DD" stroke-width="1.8" stroke-linecap="round"/><path d="M13 13h7M13 17h7" stroke="#17306A" stroke-width="1.8" stroke-linecap="round"/><circle cx="16.5" cy="21" r="1.6" fill="#00B4D8"/></svg></div><h3>25+ نوع مستند</h3><p>من ميثاق المشروع إلى تقرير الإغلاق — مستندات جاهزة للاعتماد ومصدَّرة بأربع صيغ احترافية.</p></div>
    <div class="fcard reveal"><div class="fi"><svg viewBox="0 0 32 32" fill="none"><path d="M6 6v20h20" stroke="#17306A" stroke-width="1.8" stroke-linecap="round"/><rect x="11" y="10" width="12" height="3.4" rx="1.7" fill="#2563EB"/><rect x="13" y="16" width="9" height="3.4" rx="1.7" fill="#93B4F7"/><rect x="15" y="22" width="7" height="3.4" rx="1.7" fill="#17306A"/><circle cx="26" cy="23.7" r="1.6" fill="#00B4D8"/></svg></div><h3>جداول زمنية ومسار حرج</h3><p>مخطط جانت احترافي مع تحليل المسار الحرج (CPM) وربط التبعيات بين المهام.</p></div>
    <div class="fcard reveal"><div class="fi"><svg viewBox="0 0 32 32" fill="none"><path d="M16 4l10 4v6c0 7-4.3 11.4-10 14-5.7-2.6-10-7-10-14V8z" stroke="#17306A" stroke-width="1.8" stroke-linejoin="round"/><circle cx="16" cy="15" r="4.5" stroke="#2563EB" stroke-width="1.8"/><circle cx="16" cy="15" r="1.5" fill="#00B4D8"/></svg></div><h3>إدارة المخاطر الكاملة</h3><p>سجل مخاطر شامل مع تقييم الاحتمالية والأثر وخطة استجابة لكل خطر وفق منهجية PMBOK.</p></div>
    <div class="fcard reveal"><div class="fi"><svg viewBox="0 0 32 32" fill="none"><circle cx="12" cy="13" r="4.5" stroke="#17306A" stroke-width="1.8"/><circle cx="22" cy="15" r="3.4" stroke="#2563EB" stroke-width="1.8"/><path d="M5 26a7 7 0 0 1 14 0M20 26a6 6 0 0 1 7-5.6" stroke="#17306A" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="13" r="1.4" fill="#00B4D8"/></svg></div><h3>فرق وأقسام وصلاحيات</h3><p>حوّل حسابك إلى مؤسسة: أعضاء، أدوار، أقسام، ومشاريع مشتركة تحت مظلة واحدة.</p></div>
    <div class="fcard reveal"><div class="fi"><svg viewBox="0 0 32 32" fill="none"><rect x="7" y="5" width="18" height="22" rx="3" stroke="#17306A" stroke-width="1.8"/><circle cx="16" cy="13" r="4.5" stroke="#2563EB" stroke-width="1.8"/><circle cx="16" cy="13" r="1.5" fill="#00B4D8"/><path d="M11 22h10" stroke="#17306A" stroke-width="1.8" stroke-linecap="round"/></svg></div><h3>هويتك على المستندات</h3><p>شعار وترويسة وتوقيع مؤسستك على كل مخرَج، مع أكثر من 125 ثيماً جاهزاً للمستندات.</p></div>
  </div>
</div></div>

<div class="ring-div reveal"><span class="ln"></span><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="12" stroke="#D7E0EE" stroke-width="1.4"/><circle cx="17" cy="17" r="6" stroke="#C3D2EA" stroke-width="1.4"/><circle cx="17" cy="17" r="2" fill="#00B4D8"/></svg><span class="ln r"></span></div>

<!-- HOW IT WORKS -->
<div class="sec" id="how" style="padding-top:40px;background:var(--paper2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)"><div class="wrap">
  <div class="sec-head center reveal">
    <div class="eyebrow">كيف يعمل</div>
    <h2>من فكرة إلى خطة معتمدة — بست خطوات</h2>
    <p>أقل من خمس دقائق من البداية حتى تسليم المستندات.</p>
  </div>
  <div class="steps" id="steps">
    <div class="spine"></div>
    <div class="step reveal"><div class="node"><span class="rn">١</span></div><div class="sbox"><div class="num">الخطوة ٠١</div><h3>أخبرنا عن نشاطك</h3><p>أسئلة بسيطة عن مجالك وحجم فريقك — البناء، التقنية، الصحة، وأكثر من ٨ قطاعات.</p></div></div>
    <div class="step reveal"><div class="node"><span class="rn">٢</span></div><div class="sbox"><div class="num">الخطوة ٠٢</div><h3>أدخل تفاصيل مشروعك</h3><p>الاسم، الأهداف، الميزانية، الفريق، والمدة — عبر نموذج ذكي يقترح التفاصيل تلقائياً.</p></div></div>
    <div class="step reveal"><div class="node"><span class="rn">٣</span></div><div class="sbox"><div class="num">الخطوة ٠٣</div><h3>وضوح يبني الأجندة</h3><p>تُبنى خطة كاملة وفق PMBOK — مراحل، مهام، مخاطر، موارد، ومؤشرات أداء — في ثوانٍ.</p></div></div>
    <div class="step reveal"><div class="node"><span class="rn">٤</span></div><div class="sbox"><div class="num">الخطوة ٠٤</div><h3>راجع واعتمد</h3><p>اقرأ الأجندة، عدّل ما تريد، وأضف ملاحظاتك قبل الاعتماد — القرار النهائي لك.</p></div></div>
    <div class="step reveal"><div class="node"><span class="rn">٥</span></div><div class="sbox"><div class="num">الخطوة ٠٥</div><h3>اختر مخرجاتك</h3><p>خطة المشروع، سجل المخاطر، عروض تقديمية، أو مخطط جانت — من 25+ مستنداً.</p></div></div>
    <div class="step reveal"><div class="node"><span class="rn">٦</span></div><div class="sbox"><div class="num">الخطوة ٠٦</div><h3>حمّل وشارك</h3><p>ملفاتك جاهزة كـ PDF و Word و Excel و PowerPoint — بهوية مؤسستك وجاهزة للتقديم.</p></div></div>
  </div>
</div></div>

<!-- SHOWCASE (blur->focus on scroll) -->
<div class="sec" id="outputs"><div class="wrap">
  <div class="sec-head center reveal">
    <div class="eyebrow">المخرجات</div>
    <h2>مستندات حقيقية، جاهزة للاعتماد</h2>
    <p>هذه هي قيمة وضوح الحقيقية — مخرجات مهنية بالعربية، لا رسوم توضيحية فارغة.</p>
  </div>
  <div class="show-grid" id="showcase">
    <div class="doc focus-scroll">
      <div class="doc-h"><span class="di"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span><b>ميثاق المشروع</b><span class="lt en">CHARTER</span><span class="chip-ok">معتمد</span></div>
      <div class="doc-b">
        <div class="meta"><div class="m"><span>الراعي:</span> <b>م. سلطان الفهد</b></div><div class="m"><span>المدة:</span> <b>٩٠ يوماً</b></div></div>
        <div class="mini-title">الأهداف الرئيسية</div>
        <div class="oline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> التسليم ضمن ميزانية ٢٫٤ مليون ر.س.</div>
        <div class="oline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> الالتزام بكود البناء السعودي.</div>
        <div class="oline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> شهادة الإشغال قبل ٣٠ نوفمبر.</div>
        <div class="mini-title">أصحاب المصلحة</div>
        <div class="tag2">الراعي · البلدية · المقاول الرئيسي · الاستشاري الإنشائي.</div>
        <div class="mini-title">معايير القبول</div>
        <div class="tag2">اجتياز الفحص الإنشائي النهائي ومطابقة المخططات المعتمدة.</div>
      </div>
    </div>
    <div class="doc focus-scroll">
      <div class="doc-h"><span class="di"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 8h9M7 13h6M7 17h11"/></svg></span><b>مخطط جانت والمسار الحرج</b><span class="lt en">GANTT</span></div>
      <div class="doc-b" style="padding-top:18px">
        <div class="gantt-head"><span>سبتمبر</span><span>أكتوبر</span><span>نوفمبر</span></div>
        <div class="gantt-row"><span class="gl">التخطيط</span><span class="gantt-track"><span class="gantt-bar" style="right:2%;width:22%"></span></span></div>
        <div class="gantt-row"><span class="gl">التصاميم</span><span class="gantt-track"><span class="gantt-bar" style="right:18%;width:28%"></span></span></div>
        <div class="gantt-row"><span class="gl">الأساسات</span><span class="gantt-track"><span class="gantt-bar" style="right:40%;width:24%"></span></span></div>
        <div class="gantt-row"><span class="gl">الهيكل</span><span class="gantt-track"><span class="gantt-bar" style="right:58%;width:26%"></span></span></div>
        <div class="gantt-row"><span class="gl">التشطيبات</span><span class="gantt-track"><span class="gantt-bar" style="right:78%;width:16%"></span></span></div>
        <div class="gantt-row"><span class="gl">التسليم</span><span class="gantt-track"><span class="gantt-bar" style="right:90%;width:8%;background:#137A55"></span></span></div>
        <div style="font-size:10.5px;color:var(--muted);margin-top:8px;font-weight:600;display:flex;align-items:center;gap:6px"><span style="width:9px;height:9px;background:#137A55;border-radius:3px;display:inline-block"></span> المسار الحرج مميّز تلقائياً</div>
      </div>
    </div>
    <div class="doc focus-scroll">
      <div class="doc-h"><span class="di"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z"/><path d="M12 9v4M12 16h.01"/></svg></span><b>سجل المخاطر</b><span class="lt en">RISKS</span></div>
      <div class="doc-b" style="padding:0">
        <table class="rtbl">
          <thead><tr><th>الخطر</th><th>الاحتمال</th><th>الأثر</th><th>الاستجابة</th></tr></thead>
          <tbody>
            <tr><td>تأخر الموافقات البلدية</td><td><span class="sev h">عالية</span></td><td><span class="sev h">عالٍ</span></td><td>بدء مبكر للتراخيص</td></tr>
            <tr><td>تقلب أسعار المواد</td><td><span class="sev m">متوسطة</span></td><td><span class="sev h">عالٍ</span></td><td>عقود توريد ثابتة</td></tr>
            <tr><td>نقص العمالة الماهرة</td><td><span class="sev m">متوسطة</span></td><td><span class="sev m">متوسط</span></td><td>مقاول باطن معتمد</td></tr>
            <tr><td>ظروف جوية</td><td><span class="sev l">منخفضة</span></td><td><span class="sev m">متوسط</span></td><td>جدولة خارج الأمطار</td></tr>
          </tbody>
        </table>
        <div style="padding:11px 16px;font-size:11px;color:var(--slate);font-weight:600;border-top:1px solid var(--line)">لكل خطر خطة استجابة مقترحة وفق PMBOK.</div>
      </div>
    </div>
  </div>
</div></div>

<!-- PRICING -->
<div class="sec" id="pricing" style="background:var(--paper2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)"><div class="wrap">
  <div class="sec-head center reveal">
    <div class="eyebrow">الأسعار</div>
    <h2>أسعار شفّافة وبسيطة</h2>
    <p>ابدأ مجاناً — وادفع فقط عندما تحتاج أكثر.</p>
  </div>
  <div class="plans">
    <div class="plan reveal"><h3>المجانية</h3><div class="price">مجاناً</div><div class="per">للأبد</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 5 مخرجات شهرياً</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> كل صيغ التصدير</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> PMBOK 7 و 8</li></ul>
      <a class="btn btn-out btn-sm" style="justify-content:center" href="/signup">ابدأ مجاناً</a></div>
    <div class="plan reveal"><h3>المبتدئ</h3><div class="price">109 <small>ر.س/شهر</small></div><div class="per">للأفراد والمستقلّين</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 30 مخرجة شهرياً</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> بدون علامة مائية</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 125+ ثيم</li></ul>
      <a class="btn btn-out btn-sm" style="justify-content:center" href="/signup">اشترك الآن</a></div>
    <div class="plan pop reveal"><span class="pt">الأكثر شعبية</span><h3>الاحترافي</h3><div class="price">299 <small>ر.س/شهر</small></div><div class="per">للشركات والفرق</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> 150 مخرجة شهرياً</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> هوية مؤسستك على المستندات</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> إدارة الفريق والأقسام</li></ul>
      <a class="btn btn-primary btn-sm" style="justify-content:center" href="/signup">اشترك الآن</a></div>
    <div class="plan reveal"><h3>المؤسسي</h3><div class="price">749 <small>ر.س/شهر</small></div><div class="per">للمؤسسات والجهات</div>
      <ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> مخرجات غير محدودة</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> تقارير المحفظة + API</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg> مدير حساب + SLA</li></ul>
      <a class="btn btn-out btn-sm" style="justify-content:center" href="/contact">تواصل معنا</a></div>
  </div>
  <p style="text-align:center;color:var(--muted);margin-top:22px;font-size:14px;font-weight:600">جميع الخطط تشمل تجربة مجانية 14 يوماً — بدون بطاقة ائتمان.</p>
</div></div>

<!-- QUOTE + COMPLIANCE -->
<div class="sec"><div class="wrap">
  <div class="quote-wrap reveal">
    <div class="quote">
      <div class="qm">”</div>
      <p>مكان مخصّص لشهادة عميل حقيقية — تُضاف بعد إطلاق النسخة التجريبية مع الجهات والشركات.</p>
      <div class="qslot"><span class="qav"></span><div><div style="font-weight:800;font-size:14px;color:var(--ink)">اسم العميل ومنصبه</div><div style="font-size:12.5px;color:var(--muted);font-weight:600">الجهة / الشركة</div></div></div>
    </div>
    <div class="compliance">
      <svg style="position:absolute;left:-30px;bottom:-30px;opacity:.25" width="160" height="160" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="40" stroke="#7FB4FF" stroke-width="1.5"/><circle cx="80" cy="80" r="62" stroke="#5C93F0" stroke-width="1.2"/><circle cx="80" cy="80" r="20" stroke="#00B4D8" stroke-width="1.5"/></svg>
      <h4>ثقة وأمان مؤسسي</h4>
      <div class="crow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg> متوافق مع معايير PMI / PMBOK 7 و 8</div>
      <div class="crow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg> تشفير للبيانات أثناء النقل والتخزين</div>
      <div class="crow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg> بياناتك لا تُستخدم لتدريب النماذج</div>
      <div class="crow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V7l6-4 6 4v14"/><path d="M15 21V11l6 4v6"/></svg> جاهز لمتطلبات الجهات والمؤسسات</div>
    </div>
  </div>
</div></div>

<!-- CTA -->
<div class="wrap" style="margin-top:10px"><div class="cta reveal">
  <svg class="cr" viewBox="0 0 320 320" fill="none"><g class="pulse"><circle cx="160" cy="160" r="60" stroke="#3A63C0" stroke-width="1.5"/><circle cx="160" cy="160" r="96" stroke="#2C4EA0" stroke-width="1.2"/><circle cx="160" cy="160" r="30" stroke="#00B4D8" stroke-width="1.5"/></g></svg>
  <h2>جاهز لتخطيط مشروعك القادم؟</h2>
  <p>ابدأ أول مشروع مجاناً — بلا بطاقة ائتمان، وبمخرجات جاهزة للاعتماد.</p>
  <div class="btns"><a class="btn btn-primary" href="/signup">ابدأ مجاناً<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></a><a class="btn btn-ghost" href="/contact">تواصل مع المبيعات</a></div>
</div></div>

<!-- FOOTER -->
<div class="footer"><div class="wrap">
  <div class="foot">
    <div class="fabout"><a class="brand" href="#top"><img class="blogo" src="/wuduh-assets/logo-full-light.png" alt="وضوح Wuduh"></a><p>إدارة مشاريعك باحترافية PMP — بدون مدير مشاريع، وفق معايير PMI العالمية.</p></div>
    <div class="fcol"><h5>المنتج</h5><a href="#features">الميزات</a><a href="#how">كيف يعمل</a><a href="#outputs">المخرجات</a><a href="#pricing">التسعير</a></div>
    <div class="fcol"><h5>الشركة</h5><a href="/about">من نحن</a><a href="/contact">تواصل معنا</a></div>
    <div class="fcol"><h5>قانوني</h5><a href="/privacy">سياسة الخصوصية</a><a href="/terms">شروط الاستخدام</a></div>
  </div>
  <div class="foot-b"><span>© 2026 وضوح | Wuduh — جميع الحقوق محفوظة</span><span class="en">PMI / PMBOK Guide 7th &amp; 8th Edition</span></div>
</div></div>
`;

export function WuduhHome() {
  useEffect(() => {
    const w = window;
    const nav = document.getElementById("nav");
    const onScroll = () => nav && nav.classList.toggle("scrolled", w.scrollY > 16);
    w.addEventListener("scroll", onScroll, { passive: true });

    const reduce = w.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = document.getElementById("stage");
    const playFocus = () => stage && stage.classList.add("focusing");
    const intro = document.getElementById("intro");
    let t1 = 0, t2 = 0;
    if (reduce) { if (intro) intro.remove(); playFocus(); }
    else {
      document.documentElement.style.overflow = "hidden";
      t1 = w.setTimeout(() => { if (intro) intro.classList.add("hide"); document.documentElement.style.overflow = ""; playFocus(); }, 3200);
      t2 = w.setTimeout(() => { if (intro) intro.remove(); }, 4000);
    }

    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.16 });
    document.querySelectorAll(".reveal, #steps, #showcase .doc").forEach((el) => io.observe(el));

    const scNodes = Array.from(document.querySelectorAll<HTMLElement>(".focus-scroll"));
    const scio = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        if (!reduce) {
          (e.target as HTMLElement).animate(
            [{ filter: "blur(12px)", opacity: 0, transform: "translateY(22px) scale(.98)" }, { filter: "blur(0)", opacity: 1, transform: "none" }],
            { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards", delay: 120 * scNodes.indexOf(e.target as HTMLElement) }
          );
        }
        scio.unobserve(e.target);
      }
    }), { threshold: 0.2 });
    scNodes.forEach((el) => { el.style.opacity = reduce ? "1" : "0"; scio.observe(el); });

    const heroIo = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !reduce && stage) { stage.classList.remove("focusing"); void stage.offsetWidth; stage.classList.add("focusing"); }
    }), { threshold: 0.5 });
    if (stage) heroIo.observe(stage);

    const burger = document.querySelector(".burger");
    const onBurger = () => {
      const links = document.querySelector(".nav-links") as HTMLElement | null;
      if (!links) return;
      const open = links.style.display === "flex";
      links.style.cssText = open ? "" : "display:flex;position:absolute;top:74px;right:0;left:0;flex-direction:column;background:#12244C;padding:16px 22px;gap:14px;border-bottom:1px solid rgba(255,255,255,.09)";
    };
    if (burger) burger.addEventListener("click", onBurger);

    return () => {
      w.removeEventListener("scroll", onScroll);
      io.disconnect(); scio.disconnect(); heroIo.disconnect();
      if (burger) burger.removeEventListener("click", onBurger);
      clearTimeout(t1); clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return <div className="wuduh-home" dangerouslySetInnerHTML={{ __html: HTML }} />;
}
