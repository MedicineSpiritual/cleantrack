-- 002_2fa_consents.sql — Add TOTP secret storage and consents table

-- Add encrypted_totp_secret column to users
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS encrypted_totp_secret text;

-- Consent table to record user consents (e.g., GPS)
CREATE TABLE IF NOT EXISTS consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  consent_version text,
  granted boolean NOT NULL DEFAULT true,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index for consents
CREATE INDEX IF NOT EXISTS idx_consents_user ON consents(user_id);

-- End of migration
