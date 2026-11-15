import crypto from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';

/**
 * Hash password with Argon2id using safe default parameters
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

/**
 * Verify plaintext password against stored Argon2id hash
 */
export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  try {
    return await verify(hashStr, password);
  } catch {
    return false;
  }
}

/**
 * Generate cryptographically secure random token (32 bytes hex = 64 characters)
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Deterministically hash token with SHA-256 for secure database storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Cookie configuration helper
 * In production HTTPS environments, uses standard __Host- prefix.
 * In development / HTTP, uses nexus_session to allow cookie setting over localhost.
 */
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === 'production' ? '__Host-nexus_session' : 'nexus_session';

export function getSessionCookieOptions(expiresAt: Date) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    expires: expiresAt,
  };
}
