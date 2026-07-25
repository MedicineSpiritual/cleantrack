// DB client wrapper (Supabase) — modules/db/index.ts

// NOTE: Install @supabase/supabase-js in your web server to use this client.
// Server-side use SUPABASE_SERVICE_KEY; do NOT embed service key in client bundles.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY (or ANON) must be set');
  supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  return supabase;
}
