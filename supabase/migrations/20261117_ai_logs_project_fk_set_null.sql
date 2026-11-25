-- ============================================================
-- وضوح | Wuduh — T-020: إصلاح حذف الحساب
-- ai_logs.project_id كان REFERENCES projects(id) بدون ON DELETE (= NO ACTION)،
-- فأي سجل استخدام مرتبط بمشروع يمنع حذف المشروع ثم يمنع حذف user_profiles.
--
-- الحل: ON DELETE SET NULL (وليس CASCADE) — نحتفظ بسجلات الاستخدام والتكلفة
-- (cost_usd / tokens) للمحاسبة والتقارير المالية، ونفك ربطها بالمشروع المحذوف فقط.
-- التجهيل (user_id) يتم في مسار /api/me/delete.
--
-- آمن للتشغيل أكثر من مرة. شغّله في Supabase SQL Editor.
-- ============================================================

BEGIN;

-- 1) الاسم الافتراضي الذي يولّده Postgres للقيد المعرّف في schema.sql
ALTER TABLE ai_logs DROP CONSTRAINT IF EXISTS ai_logs_project_id_fkey;

-- 2) احتياط: أي قيد FK آخر على ai_logs.project_id باسم مختلف (لو أُنشئ يدويًا)
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_attribute att
      ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
    WHERE con.conrelid = 'public.ai_logs'::regclass
      AND con.contype = 'f'
      AND att.attname = 'project_id'
  LOOP
    EXECUTE format('ALTER TABLE public.ai_logs DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- 3) سجلات يتيمة (مشروعها محذوف) تمنع إضافة القيد — نفك ربطها
UPDATE ai_logs
SET project_id = NULL
WHERE project_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM projects p WHERE p.id = ai_logs.project_id);

-- 4) القيد الجديد
ALTER TABLE ai_logs
  ADD CONSTRAINT ai_logs_project_id_fkey
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

COMMIT;

-- تحقق: يجب أن يظهر confdeltype = 'n' (SET NULL)
SELECT conname, confdeltype
FROM pg_constraint
WHERE conrelid = 'public.ai_logs'::regclass AND contype = 'f';
