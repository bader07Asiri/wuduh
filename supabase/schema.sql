-- ============================
-- وضوح | Wuduh — Supabase Schema
-- ============================
-- تشغيل هذا الملف في Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- 1. user_profiles
-- ============================
CREATE TABLE IF NOT EXISTS user_profiles (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id              TEXT UNIQUE NOT NULL,
  email                 TEXT,
  full_name             TEXT,
  user_type             TEXT DEFAULT 'individual' CHECK (user_type IN ('individual','small_company','enterprise')),
  industry              TEXT DEFAULT 'construction' CHECK (industry IN ('construction','technology','healthcare','manufacturing','education','retail','finance','government','energy','oil_gas','transportation','logistics','hospitality','tourism','real_estate','telecom','media','agriculture','defense','legal','consulting','nonprofit','other')),
  company_name          TEXT,
  team_size             INTEGER,
  subscription_plan     TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free','starter','professional','enterprise')),
  subscription_status   TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('active','cancelled','past_due','trialing')),
  stripe_customer_id    TEXT UNIQUE,
  onboarding_completed  BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 2. projects
-- ============================
CREATE TABLE IF NOT EXISTS projects (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES user_profiles(clerk_id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  industry        TEXT,
  client_name     TEXT,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  budget          DECIMAL(15,2),
  currency        TEXT DEFAULT 'SAR' CHECK (currency IN ('SAR','USD','EUR')),
  team_size       INTEGER DEFAULT 1,
  objectives      TEXT[] DEFAULT '{}',
  constraints     TEXT,
  assumptions     TEXT,
  status          TEXT DEFAULT 'planning' CHECK (status IN ('draft','planning','active','on_hold','completed','cancelled')),
  ai_agenda       JSONB,
  user_notes      TEXT,
  agenda_approved BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================
-- 3. deliverables
-- ============================
CREATE TABLE IF NOT EXISTS deliverables (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL,           -- Clerk user ID for fast RLS
  type          TEXT NOT NULL,
  title         TEXT,                    -- Human-readable title
  format        TEXT NOT NULL CHECK (format IN ('pdf','docx','xlsx','pptx')),
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','generating','ready','error')),
  file_url      TEXT,                    -- Public or signed Supabase Storage URL
  storage_path  TEXT,                    -- Internal Storage path for signed URL generation
  file_size     INTEGER,                 -- Bytes
  generated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deliverables_project_id ON deliverables(project_id);

-- ============================
-- 4. subscriptions
-- ============================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id                 TEXT NOT NULL REFERENCES user_profiles(clerk_id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT UNIQUE,
  stripe_customer_id      TEXT,
  plan                    TEXT DEFAULT 'free',
  status                  TEXT DEFAULT 'trialing',
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 5. ai_logs (لمراقبة الاستهلاك)
-- ============================
CREATE TABLE IF NOT EXISTS ai_logs (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          TEXT NOT NULL,
  project_id       UUID REFERENCES projects(id),
  prompt_type      TEXT,                  -- e.g. 'project_charter', 'risk_register', 'download_wbs'
  generation_type  TEXT,                  -- alias kept for backwards compatibility
  tokens_used      INTEGER DEFAULT 0,
  response_quality TEXT DEFAULT 'good',   -- 'good' | 'partial' | 'failed'
  model            TEXT DEFAULT 'claude-sonnet-4-6',
  success          BOOLEAN DEFAULT TRUE,
  error_message    TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_user_id ON ai_logs(user_id);
CREATE INDEX idx_ai_logs_created_at ON ai_logs(created_at);

-- ============================
-- Row Level Security (RLS)
-- ============================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions  ENABLE ROW LEVEL SECURITY;

-- user_profiles: المستخدم يرى ويعدل بياناته فقط
CREATE POLICY "users_own_profile" ON user_profiles
  FOR ALL USING (clerk_id = current_setting('app.user_id', true));

-- projects: المستخدم يرى مشاريعه فقط
CREATE POLICY "users_own_projects" ON projects
  FOR ALL USING (user_id = current_setting('app.user_id', true));

-- deliverables: المستخدم يرى مخرجاته مباشرة (user_id column) أسرع من JOIN
CREATE POLICY "users_own_deliverables" ON deliverables
  FOR ALL USING (user_id = current_setting('app.user_id', true));

-- subscriptions: المستخدم يرى اشتراكه فقط
CREATE POLICY "users_own_subscriptions" ON subscriptions
  FOR ALL USING (user_id = current_setting('app.user_id', true));

-- ============================
-- Updated_at Trigger
-- ============================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================
-- Storage Buckets
-- ============================
-- أنشئ هذا في Supabase Dashboard > Storage:
-- Bucket name: "deliverables"
-- Public: false (نستخدم Signed URLs)
-- Allowed MIME types: application/pdf, application/vnd.openxmlformats-officedocument.*
-- File size limit: 50 MB

-- Storage RLS Policies (تُضاف في Dashboard > Storage > Policies):
-- INSERT: (auth.uid()::text = (storage.foldername(name))[1])
-- SELECT: (auth.uid()::text = (storage.foldername(name))[1])
-- DELETE: (auth.uid()::text = (storage.foldername(name))[1])

-- ============================
-- Migration: إضافة الأعمدة الجديدة (لقواعد بيانات موجودة)
-- ============================
-- ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';
-- ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS title TEXT;
-- ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- ============================
-- تم — قاعدة البيانات جاهزة ✅
-- ============================
