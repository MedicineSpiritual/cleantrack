import { getSupabaseClient } from '../db';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
  const k = process.env.TOTP_ENCRYPTION_KEY || process.env.SUPABASE_2FA_KEY || '';
  if (!k || k.length < 32) throw new Error('TOTP_ENCRYPTION_KEY (32+ chars) must be set for 2FA secret encryption');
  return Buffer.from(k).slice(0,32);
}

function encryptSecret(plain: string) {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decryptSecret(enc: string) {
  const data = Buffer.from(enc, 'base64');
  const iv = data.slice(0,12);
  const tag = data.slice(12,28);
  const encrypted = data.slice(28);
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

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

// 2FA (TOTP)
export async function generateTOTPSecretForUser(userId: string) {
  const secret = speakeasy.generateSecret({ length: 20, name: `CleanTrack:${userId}` });
  const encrypted = encryptSecret(secret.base32);

  const db = getSupabaseClient();
  const { data, error } = await db.from('users').update({ encrypted_totp_secret: encrypted }).eq('id', userId).select().single();
  if (error) throw error;

  const otpAuth = secret.otpauth_url || `otpauth://totp/CleanTrack:${userId}?secret=${secret.base32}&issuer=CleanTrack`;
  const qrDataUrl = await qrcode.toDataURL(otpAuth);
  return { secret: secret.base32, otpAuth, qrDataUrl };
}

export async function verifyTOTPForUser(userId: string, token: string) {
  const db = getSupabaseClient();
  const { data, error } = await db.from('users').select('encrypted_totp_secret').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!data || !data.encrypted_totp_secret) return { valid: false };
  const secret = decryptSecret(data.encrypted_totp_secret);
  const valid = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
  return { valid };
}
