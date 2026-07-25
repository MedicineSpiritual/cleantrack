import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

// Test-mode lightweight mock client to allow unit tests to run without a real Supabase instance.
function createTestClient() {
  return {
    from: (table: string) => {
      return {
        select: (_cols?: any) => ({
          eq: (_col: string, val: any) => ({
            maybeSingle: async () => {
              // Behavior controlled by environment variables for tests
              // e.g., TEST_QR=found will return a fake QR row
              if (process.env.TEST_QR === 'found' && table === 'qrcodes') {
                return { data: { id: 'test-qr-id', entrance_id: 'test-entrance-id', tenant_id: 'test-tenant-id' }, error: null };
              }
              if (process.env.TEST_CHECKINS === 'ok' && table === 'check_in_events') {
                return { data: [{ id: 'c1', entrance_id: 'e1', timestamp: new Date().toISOString(), user_id: 'u1' }], error: null };
              }
              return { data: null, error: null };
            }
          }),
          order: (_col: string, _opts?: any) => ({ limit: async (_n: number) => ({ data: [], error: null }) })
        })
      };
    },
    fromInsert: () => ({})
  } as any;
}

export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;
  if (process.env.NODE_ENV === 'test') {
    // return a lightweight mock client
    supabase = createTestClient() as unknown as SupabaseClient;
    return supabase;
  }

  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY (or ANON) must be set');
  supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  return supabase;
}
