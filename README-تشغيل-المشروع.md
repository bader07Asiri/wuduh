# وضوح | Wuduh — دليل التشغيل

## الخطوات للتشغيل

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد المتغيرات البيئية
```bash
cp .env.example .env.local
# افتح .env.local وأضف كل القيم
```

### 3. إعداد الخدمات الخارجية

#### Clerk (المصادقة)
- اذهب إلى https://clerk.com
- أنشئ تطبيقاً جديداً
- انسخ PUBLISHABLE_KEY و SECRET_KEY

#### Supabase (قاعدة البيانات)
- اذهب إلى https://supabase.com
- أنشئ مشروعاً جديداً
- اذهب إلى SQL Editor وشغّل ملف: `supabase/schema.sql`
- انسخ URL و ANON_KEY و SERVICE_ROLE_KEY

#### Anthropic (الذكاء الاصطناعي)
- اذهب إلى https://console.anthropic.com
- أنشئ API Key جديداً

#### Stripe (الدفع)
- اذهب إلى https://stripe.com
- أنشئ 3 أسعار (Starter $29، Professional $79، Enterprise $199)
- انسخ Price IDs

### 4. تشغيل المشروع
```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

---

## هيكل المشروع

```
src/
├── app/              # صفحات Next.js
│   ├── (marketing)/  # صفحة الهبوط والتسعير
│   ├── (auth)/       # تسجيل الدخول والتسجيل
│   ├── (dashboard)/  # التطبيق الرئيسي
│   └── api/          # API Routes
├── components/       # مكونات React
├── lib/              # مكتبات مساعدة
│   ├── ai/           # Claude AI prompts
│   ├── db/           # Supabase schema types
│   └── stripe.ts     # Stripe utilities
└── types/            # TypeScript types
```

---

## ملاحظات مهمة

- قاعدة البيانات: `supabase/schema.sql` — شغّلها في Supabase SQL Editor
- الـ AI: مبني على Claude API مع prompts متخصصة بـ PMBOK Guide 7th Edition
- الدفع: Stripe Webhooks يحتاج إعداد في Stripe Dashboard
- المصادقة: Clerk يتولى كل شيء تلقائياً

---

*وضوح | Wuduh — يونيو 2026*
