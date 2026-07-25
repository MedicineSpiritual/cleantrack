-- 001_init.sql — Initial schema for CleanTrack (Sprint1)
-- Note: adjust JWT claim access according to your Supabase / Auth configuration.
-- Example RLS uses current_setting('jwt.claims.tenant_id', true) which must be set by your JWT middleware.

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users (application users, linked to auth provider id)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id text UNIQUE, -- optional: the provider/auth id (e.g., supabase auth uid)
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'worker', -- enum: super_admin, company_admin, manager, supervisor, worker, resident, inspector, client
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Buildings
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Entrances (floors/entrances inside a building)
CREATE TABLE IF NOT EXISTS entrances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  name text NOT NULL,
  floor text,
  qr_code_id uuid UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- QR Codes
CREATE TABLE IF NOT EXISTS qrcodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entrance_id uuid UNIQUE REFERENCES entrances(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE, -- e.g. a short token or URL
  created_at timestamptz DEFAULT now()
);

-- CheckIn Events
CREATE TABLE IF NOT EXISTS check_in_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  entrance_id uuid REFERENCES entrances(id) ON DELETE SET NULL,
  event_type text NOT NULL, -- 'start' | 'end'
  timestamp timestamptz NOT NULL DEFAULT now(),
  gps_lat double precision,
  gps_lng double precision,
  metadata jsonb
);

-- Audit Log (append-only)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_check_in_entrance_ts ON check_in_events(entrance_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- Enable Row Level Security (RLS) on tenant-scoped tables
ALTER TABLE IF EXISTS buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS qrcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS check_in_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (replace the tenant-claim access with your JWT claim reading method)
-- Supabase commonly exposes JWT claims via current_setting('jwt.claims.<name>', true)

-- Note: replace current_setting('jwt.claims.tenant_id', true)::uuid with the correct expression based on your setup.

-- Allow SELECT for users of same tenant
CREATE POLICY tenant_select ON buildings
  FOR SELECT
  USING (tenant_id = (current_setting('jwt.claims.tenant_id', true))::uuid);

CREATE POLICY tenant_select_on_entrances ON entrances
  FOR SELECT
  USING (tenant_id = (current_setting('jwt.claims.tenant_id', true))::uuid);

CREATE POLICY tenant_select_checkins ON check_in_events
  FOR SELECT
  USING (tenant_id = (current_setting('jwt.claims.tenant_id', true))::uuid);

-- Allow INSERT only if tenant matches JWT
CREATE POLICY tenant_insert_checkins ON check_in_events
  FOR INSERT
  WITH CHECK (tenant_id = (current_setting('jwt.claims.tenant_id', true))::uuid);

-- Allow users to read their own user row or tenant admins
CREATE POLICY users_select ON users
  FOR SELECT
  USING (
    tenant_id = (current_setting('jwt.claims.tenant_id', true))::uuid
  );

-- IMPORTANT: After creating policies, create explicit policies for public roles and service roles as needed.

-- Sample trigger to populate audit_logs on check_in_events insert
CREATE OR REPLACE FUNCTION public.log_checkin_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO audit_logs(tenant_id, user_id, action, resource_type, resource_id, payload)
  VALUES (NEW.tenant_id, NEW.user_id, 'checkin.created', 'check_in_events', NEW.id, row_to_json(NEW));
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_log_checkin_insert ON check_in_events;
CREATE TRIGGER trg_log_checkin_insert
  AFTER INSERT ON check_in_events
  FOR EACH ROW EXECUTE FUNCTION public.log_checkin_insert();

-- End of migration
