-- ============================
-- وضوح | Wuduh — Migration: نظام المؤسسة v2
-- (أنواع الأعضاء منتِج/مشرف + دور مدير القسم + مشاركة المشاريع)
-- شغّل هذا في Supabase SQL Editor بعد migration_org.sql
-- ============================

-- 1) نوع العضو: منتِج (can_generate=true, مقعد مدفوع) أو مشرف (false, مجاني)
ALTER TABLE org_members ADD COLUMN IF NOT EXISTS can_generate BOOLEAN NOT NULL DEFAULT TRUE;

-- 2) توسيع الأدوار لتشمل مدير القسم
ALTER TABLE org_members DROP CONSTRAINT IF EXISTS org_members_role_check;
ALTER TABLE org_members ADD CONSTRAINT org_members_role_check
  CHECK (role IN ('owner','admin','dept_manager','member'));

-- 3) التأكد من أعمدة ربط المشاريع (موجودة من migration_org، للأمان)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id  UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS dept_id UUID REFERENCES org_departments(id) ON DELETE SET NULL;

-- 4) مشاركة المشاريع (مع عضو أو قسم)
CREATE TABLE IF NOT EXISTS project_shares (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  org_id         UUID REFERENCES organizations(id) ON DELETE CASCADE,
  target_user_id TEXT,                                   -- مشاركة مع عضو محدّد (Clerk ID)
  target_dept_id UUID REFERENCES org_departments(id) ON DELETE CASCADE, -- أو مع قسم كامل
  permission     TEXT NOT NULL DEFAULT 'read' CHECK (permission IN ('read','edit')),
  created_by     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  CHECK (target_user_id IS NOT NULL OR target_dept_id IS NOT NULL)
);

-- 5) فهارس
CREATE INDEX IF NOT EXISTS idx_project_shares_project ON project_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_project_shares_user    ON project_shares(target_user_id);
CREATE INDEX IF NOT EXISTS idx_project_shares_dept    ON project_shares(target_dept_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id       ON projects(user_id);

SELECT 'migration_org_v2 تم بنجاح ✅' AS status;
