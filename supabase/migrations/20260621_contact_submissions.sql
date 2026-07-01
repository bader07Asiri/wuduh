-- جدول رسائل التواصل من صفحة Contact Us
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text        NOT NULL,
  email       text        NOT NULL,
  company     text,
  subject     text        NOT NULL,
  message     text        NOT NULL,
  status      text        NOT NULL DEFAULT 'new',  -- new | read | replied
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- فهرس للبحث السريع بالإيميل
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

-- RLS: فقط service_role يقدر يقرأ ويكتب (لا يحتاج المستخدمون العاديون الوصول)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
