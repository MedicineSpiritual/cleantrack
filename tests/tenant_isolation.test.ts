// tenant_isolation.test.ts — scaffold
// NOTE: This test requires a test database with RLS policies enabled. It is a scaffold describing steps for automation.

describe('Tenant isolation', () => {
  test.skip('tenant A cannot read tenant B data (requires integration setup)', async () => {
    // Steps:
    // 1) Create tenants and users via service role
    // 2) Insert sample data under tenant A
    // 3) Create JWT for user in tenant B and attempt to read
    // 4) Assert no rows returned
    expect(true).toBe(true);
  });
});
