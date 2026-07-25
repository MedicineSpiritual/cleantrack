// QR Engine service (scaffold)
// Responsibilities:
// - generate new QR token/code for an entrance
// - create printable link or PDF (left as TODO)

import crypto from 'crypto';
import { getSupabaseClient } from '../db';

export async function generateQRCodeForEntrance(tenantId: string, entranceId: string) {
  // Generate a short random token
  const token = crypto.randomBytes(8).toString('hex');
  const code = `ct:${token}`; // prefix to avoid collisions with other systems

  // TODO: persist into qrcodes table via Supabase
  // const db = getSupabaseClient();
  // const { data, error } = await db.from('qrcodes').insert({ tenant_id: tenantId, entrance_id: entranceId, code }).select().single();

  return { code, url: `https://your.app/scan/${code}` };
}
