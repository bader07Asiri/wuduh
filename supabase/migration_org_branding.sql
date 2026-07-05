-- وضوح | Wuduh — حقول الهوية البصرية للمؤسسة
-- شغّل هذا في Supabase SQL Editor مرة واحدة
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS primary_color    TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS letterhead_text  TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS signatory_name   TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS signatory_title  TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS department       TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS website          TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone            TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS email            TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address          TEXT;
