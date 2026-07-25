PRD — Sprint 1 (Auth + Multi-tenant Core + QR Engine)

Goal
Deliver the minimal working flow to support the MVP: user authentication (with 2FA for admin/manager), multi-tenant database core with Row-Level Security, QR generation and mobile scan-to-register flow (CheckInEvent) and a simple manager dashboard that shows last check-ins.

Scope
- Authentication: Supabase Auth (email/password), 2FA for Company Admin & Manager.
- Multi-tenant core: tenants table, users table, roles, tenant_id on key entities, RLS policies for isolation.
- QR Engine: create QR for each Entrance, printable PDF export (simple link), validation endpoint.
- Mobile: Flutter screen to scan QR (start/stop), store CheckInEvent locally if offline and sync when online.
- Dashboard: list of buildings/entrances and last CheckInEvent per entrance.

User stories
- As a Super Admin I can create Companies so they can onboard.
- As a Company Admin I can create Buildings and Entrances and generate QR codes.
- As a Worker I can scan a QR and record start/end check-in events tied to my account.
- As a Manager I can view latest check-ins and see which entrances are missing a check-in for the scheduled time window.

Acceptance Criteria
- CheckInEvent created contains: id, tenant_id, user_id, entrance_id, type (start/end), timestamp, optional gps_lat, gps_lng.
- Tenant isolation verified by automated tests: user of tenant A cannot read tenant B data.
- AuditLog entry for every CheckInEvent creation.
- Mobile app persists events locally when offline and syncs successfully when online.

Non-functional
- Dashboard should load under 2s for 500 active entrances in staging.
- All personal data stored in EU region if client requires data residency.

Deliverables
- DB schema SQL or migration files for tenants, users, buildings, entrances, qrcodes, check_in_events, audit_logs.
- RLS policy definitions and tests.
- Minimal Next.js admin UI for Companies/Buildings/Entrances and Dashboard.
- Flutter minimal app with QR scanning + local persistence.
- CI pipeline skeleton (tests run on PRs).
