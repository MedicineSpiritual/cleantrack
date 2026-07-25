// API: /api/qr-validate
// Purpose: Validate a scanned QR code and return entrance information
// Implementation: queries qrcodes table and returns entrance + tenant. Inserts an audit log entry.

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../modules/db';

type Data = {
  ok: boolean;
  message?: string;
  entranceId?: string;
  tenantId?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code) return res.status(400).json({ ok: false, message: 'Missing code' });

  try {
    const db = getSupabaseClient();

    const { data: qr, error: qrErr } = await db.from('qrcodes').select('id, entrance_id, tenant_id').eq('code', code).maybeSingle();
    if (qrErr) {
      console.error('qr lookup error', qrErr);
      return res.status(500).json({ ok: false, message: 'Database error' });
    }

    if (!qr) {
      return res.status(404).json({ ok: false, message: 'QR not found' });
    }

    // Insert audit log (server-side service key expected)
    try {
      await db.from('audit_logs').insert({
        tenant_id: qr.tenant_id,
        user_id: null,
        action: 'qrcode.validated',
        resource_type: 'qrcodes',
        resource_id: qr.id,
        payload: { code }
      });
    } catch (logErr) {
      // audit logging should not block the response
      console.warn('failed to write audit log', logErr);
    }

    return res.status(200).json({ ok: true, message: 'Validated', entranceId: qr.entrance_id, tenantId: qr.tenant_id });
  } catch (err) {
    console.error('qr-validate handler error', err);
    return res.status(500).json({ ok: false, message: 'Internal error' });
  }
}
