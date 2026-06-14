-- ============================
-- وضوح | Wuduh — Migration: نظام المؤسسات والأقسام
-- شغّل هذا في Supabase SQL Editor
-- ============================

-- 1. المؤسسات
CREATE TABLE IF NOT EXISTS organizations (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id     TEXT NOT NULL REFERENCES user_profiles(clerk_id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  name_en      TEXT,
  logo_url     TEXT,
  industry     TEXT,
  cr_number    TEXT,              -- رقم السجل التجاري
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. الأقسام داخل المؤسسة
CREATE TABLE IF NOT EXISTS org_departments (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  color        TEXT DEFAULT '#1B4FD8',   -- لون القسم في الواجهة
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. أعضاء المؤسسة
CREATE TABLE IF NOT EXISTS org_members (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  dept_id       UUID REFERENCES org_departments(id) ON DELETE SET NULL,
  user_id       TEXT NOT NULL,            -- Clerk user ID
  email         TEXT NOT NULL,
  full_name     TEXT,
  role          TEXT DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','invited','suspended')),
  invited_at    TIMESTAMPTZ DEFAULT NOW(),
  joined_at     TIMESTAMPTZ,
  UNIQUE (org_id, user_id)
);

-- 4. ربط المشاريع بالأقسام (اختياري — يُضاف عمود للجدول الموجود)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id   UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS dept_id  UUID REFERENCES org_departments(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id  ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_depts_org_id    ON org_departments(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_org_id     ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_dept_id    ON projects(dept_id);

-- RLS
ALTER TABLE organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_departments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members      ENABLE ROW LEVEL SECURITY;

-- المالك يرى مؤسسته
CREATE POLICY "org_owner_access" ON organizations
  FOR ALL USING (owner_id = current_setting('app.user_id', true));

-- الأعضاء يرون مؤسستهم
CREATE POLICY "org_member_read" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM org_members
      WHERE user_id = current_setting('app.user_id', true)
    )
  );

-- الأقسام: أعضاء المؤسسة يرونها
CREATE POLICY "dept_member_access" ON org_departments
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = current_setting('app.user_id', true)
    )
  );

-- الأعضاء: المدير والمالك يديرون
CREATE POLICY "members_admin_access" ON org_members
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = current_setting('app.user_id', true)
        AND role IN ('owner','admin')
    )
  );

CREATE POLICY "members_self_read" ON org_members
  FOR SELECT USING (user_id = current_setting('app.user_id', true));

-- Updated_at trigger للمؤسسات
CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

SELECT 'تم إنشاء جداول المؤسسات والأقسام بنجاح ✅' AS status;
