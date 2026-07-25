Tests — instructions and skeleton

This folder contains guidance for writing integration and E2E tests for CleanTrack.

Recommended tools:
- Node.js (16+)
- Jest for unit/integration tests
- Supertest for API endpoint testing

Suggested tests to implement:
- tenant_isolation.test.ts: create two tenants, insert sample data under tenant A and assert tenant B cannot read it (requires RLS test accounts or server-side setups)
- qr_lookup.test.ts: test /api/qr-validate endpoint with a mocked Supabase client
- e2e/scan_to_dashboard.test.ts: simulate a mobile scan and assert dashboard shows the check-in

Running tests (after installing deps):
- npm install --save-dev jest @types/jest ts-jest supertest
- Add jest config if needed
- npm test

