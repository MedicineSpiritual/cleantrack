// modules/auth/index.ts
// Auth helper wrappers for Supabase interactions (server-side)

import { getSupabaseClient } from '../db';

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  // NOTE: This uses the client auth method. On server use a service role when performing admin actions.
  const res = await supabase.auth.signInWithPassword({ email, password });
  return res;
}

export async function signOut(accessToken?: string) {
  const supabase = getSupabaseClient();
  // server-side sign out (if session present)
  try {
    await supabase.auth.signOut();
  } catch (err) {
    // noop
  }
}

// 2FA (TOTP) flow placeholders
// Decisions required: use TOTP (e.g., Google Authenticator) or SMS OTP via provider (Twilio/MessageBird).
// Implementations must store per-user 2FA secret (encrypted) or use a third-party service.

export async function generateTOTPSecretForUser(userId: string) {
  // TODO: generate TOTP secret, persist encrypted secret for user, return QR provisioning URI
  throw new Error('Not implemented: generateTOTPSecretForUser');
}

export async function verifyTOTPForUser(userId: string, token: string) {
  // TODO: verify token against stored secret
  throw new Error('Not implemented: verifyTOTPForUser');
}
