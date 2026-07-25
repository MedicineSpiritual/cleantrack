RLS and Tenant Isolation — Notes for CleanTrack

This file describes how to wire Row-Level Security (RLS) for tenant isolation in Supabase/Postgres.

1) JWT claim approach
- Issue JWTs that include tenant_id as a custom claim (e.g., "tenant_id").
- In Postgres policies use current_setting('jwt.claims.tenant_id', true)::uuid to read the claim.
- Example: USING (tenant_id = (current_setting('jwt.claims.tenant_id', true))::uuid)

2) Service role considerations
- Service role (server-side) bypasses RLS. Use a separate service key for server tasks; avoid embedding it in client apps.
- Use policies that allow actions only when auth.role = 'authenticated' (depends on your auth provider).

3) Testing
- Add integration tests that create two tenants and assert that user A cannot read tenant B data.
- Add CI step that runs these tests on migrations.

4) Caveats
- The exact method to access JWT claims depends on your auth provider and how Supabase is configured. Replace examples accordingly.

5) Helpful commands
- To enable pgcrypto extension for gen_random_uuid():
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

- To set a test setting for jwt claim in SQL session (for local testing):
  SELECT set_config('jwt.claims.tenant_id', '00000000-0000-0000-0000-000000000000', true);

