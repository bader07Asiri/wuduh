-- ============================
-- Wuduh Admin Migrations
-- ============================

-- 1. Add pmbok_edition to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS pmbok_edition TEXT DEFAULT '7'
    CHECK (pmbok_edition IN ('7', '8'));

-- 2. Add is_admin flag to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 3. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Default brand settings
INSERT INTO site_settings (key, value) VALUES
  ('color_primary',   '#2563EB'),
  ('color_secondary', '#0F172A'),
  ('color_accent',    '#00D4FF'),
  ('color_bg',        '#F8FAFC'),
  ('font_arabic',     'Tajawal'),
  ('font_latin',      'Montserrat'),
  ('logo_url',        ''),
  ('site_name_ar',    'وضوح'),
  ('site_name_en',    'Wuduh')
ON CONFLICT (key) DO NOTHING;

-- RLS: only admins or service_role can read/write site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_site_settings" ON site_settings
  USING (true)
  WITH CHECK (true);
