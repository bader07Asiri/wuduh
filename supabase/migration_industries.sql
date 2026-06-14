-- ============================
-- وضوح | Wuduh — Migration: إضافة القطاعات الجديدة
-- شغّل هذا في Supabase SQL Editor
-- ============================

-- إزالة القيد القديم وإضافة الجديد بالقطاعات الكاملة
ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_industry_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_industry_check
  CHECK (industry IN (
    'construction','technology','healthcare','manufacturing',
    'education','retail','finance','government',
    'energy','oil_gas','transportation','logistics',
    'hospitality','tourism','real_estate','telecom',
    'media','agriculture','defense','legal',
    'consulting','nonprofit','other'
  ));

-- نفس الشيء لجدول projects إذا كان فيه عمود industry
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_industry_check;

-- تأكيد
SELECT 'تم تحديث قيود القطاعات بنجاح ✅' AS status;
