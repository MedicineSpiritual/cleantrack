// API: /api/dashboard/last_checkins
// Returns last checkin per entrance for the current tenant (scaffold)

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../modules/db';

type Data = { ok: boolean; message?: string; data?: any };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const db = getSupabaseClient();
    // Example query: get latest check_in_events grouped by entrance
    const query = `SELECT DISTINCT ON (entrance_id) id, entrance_id, timestamp, user_id FROM check_in_events ORDER BY entrance_id, timestamp DESC LIMIT 500`;
    const { data, error } = await db.rpc('sql', { q: query } as any).catch(() => ({ data: null, error: 'raw sql not available' }));

    if (error) {
      // fallback: simple select top 20 recent
      const { data: fallback } = await db.from('check_in_events').select('id, entrance_id, timestamp, user_id').order('timestamp', { ascending: false }).limit(50);
      return res.status(200).json({ ok: true, data: fallback });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('dashboard query error', err);
    return res.status(500).json({ ok: false, message: 'Internal error' });
  }
}
