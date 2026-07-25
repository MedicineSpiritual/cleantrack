// API: /api/checkin
// Purpose: record a check-in event (start/end) from mobile app

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../modules/db';

type Data = { ok: boolean; message?: string; data?: any };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  const { tenantId, userId, entranceId, eventType, timestamp, gps } = req.body;
  if (!tenantId || !entranceId || !eventType) return res.status(400).json({ ok: false, message: 'Missing fields' });

  try {
    const db = getSupabaseClient();

    const payload: any = {
      tenant_id: tenantId,
      user_id: userId || null,
      entrance_id: entranceId,
      event_type: eventType,
      timestamp: timestamp || new Date().toISOString(),
      gps_lat: gps?.lat || null,
      gps_lng: gps?.lng || null,
      metadata: { source: 'mobile' }
    };

    const { data, error } = await db.from('check_in_events').insert(payload).select().single();
    if (error) {
      console.error('insert checkin error', error);
      return res.status(500).json({ ok: false, message: 'DB error' });
    }

    // audit trigger configured in DB will write audit_log via trigger
    return res.status(201).json({ ok: true, message: 'Check-in recorded', data });
  } catch (err) {
    console.error('checkin handler error', err);
    return res.status(500).json({ ok: false, message: 'Internal error' });
  }
}
