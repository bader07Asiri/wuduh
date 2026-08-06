-- ============================================================
-- وضوح | Wuduh — Finance / token accounting migration
-- Adds accurate token + cost tracking to ai_logs.
-- Safe to run multiple times.
-- ============================================================

ALTER TABLE ai_logs ADD COLUMN IF NOT EXISTS input_tokens  INTEGER DEFAULT 0;
ALTER TABLE ai_logs ADD COLUMN IF NOT EXISTS output_tokens INTEGER DEFAULT 0;
ALTER TABLE ai_logs ADD COLUMN IF NOT EXISTS cost_usd      NUMERIC(12,6) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON ai_logs (user_id);
