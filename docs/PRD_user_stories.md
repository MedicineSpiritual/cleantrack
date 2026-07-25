PRD — User Stories (Sprint1 scope)

1. Super Admin: Create Company
- As Super Admin I can create a new Company (tenant) with name, contact email, data residency preference so the company can onboard.
- Acceptance: POST /api/companies creates tenant row and returns id.

2. Company Admin: Manage Buildings and Entrances
- As Company Admin I can create Buildings and Entrances and generate QR codes for entrances.
- Acceptance: CRUD endpoints for buildings/entrances; generate QR code returns code and printable link.

3. Worker: Scan QR to Start/End Shift
- As a Worker I can scan a QR to record start and end events. If offline, the event is saved locally and synced automatically.
- Acceptance: Mobile app records check_in_event with event_type start/end, timestamp, optional GPS.

4. Manager: View Dashboard
- As a Manager I can view last check-ins per entrance and see missing check-ins for scheduled windows.
- Acceptance: Dashboard displays latest check_in_events and highlights entrances without recent checks.

5. Security: Tenant Isolation
- As platform owner I ensure tenant A cannot see tenant B data. RLS policies and integration tests must prove isolation.
- Acceptance: Integration test that fails if data is visible across tenants.

6. Audit: Immutable Logs
- Every critical action (creating tenant, generating QR, check-in) writes an audit_logs entry with payload and timestamp.
- Acceptance: Audit table contains JSON payload for each action.

Notes:
- Break each story into tasks in the backlog and estimate for sprint planning.
