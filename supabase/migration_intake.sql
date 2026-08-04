-- ============================================================
-- وضوح | Wuduh — Intake depth migration
-- Adds a single JSONB column to store the optional "depth" inputs
-- collected in the redesigned project intake form (stakeholders,
-- deliverables, out-of-scope, roles, milestones, cost lines,
-- known risks, quality standards, KPIs, methodology, ...).
-- Safe to run multiple times.
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS intake_details JSONB;

-- Defensive: ensure pmbok_edition exists (used by the intake form)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS pmbok_edition TEXT DEFAULT '7';

COMMENT ON COLUMN projects.intake_details IS
  'Optional depth inputs from the intake form (JSONB): deliverables, out_of_scope, acceptance_criteria, sponsor, stakeholders[], team_roles[], methodology, milestones[], budget_breakdown[], funding_source, known_risks[], quality_standards, kpis[].';
