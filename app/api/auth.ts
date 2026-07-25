// API: /api/auth
// Purpose: server-side auth endpoints (login, 2FA placeholders)

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../modules/db';
import { signInWithEmail } from '../../modules/auth';

type Data = { ok: boolean; message?: string; data?: any };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  const { action } = req.body;
  const db = getSupabaseClient();

  try {
    if (action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing credentials' });

      const result = await signInWithEmail(email, password);
      if (result.error) return res.status(401).json({ ok: false, message: 'Invalid credentials', data: result.error });

      // In a full implementation, create a session cookie here for the web client.
      return res.status(200).json({ ok: true, message: 'Authenticated', data: result.data });
    }

    if (action === '2fa_generate') {
      const { userId } = req.body;
      // TODO: generate TOTP secret and return provisioning URI for authenticator apps
      return res.status(200).json({ ok: false, message: '2FA generation not implemented' });
    }

    if (action === '2fa_verify') {
      const { userId, token } = req.body;
      // TODO: verify TOTP token
      return res.status(200).json({ ok: false, message: '2FA verification not implemented' });
    }

    return res.status(400).json({ ok: false, message: 'Unknown action' });
  } catch (err) {
    console.error('auth handler error', err);
    return res.status(500).json({ ok: false, message: 'Internal error' });
  }
}
