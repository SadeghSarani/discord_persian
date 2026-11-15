import { NextRequest } from 'next/server';
import { AuthService, SafeUser } from '@/modules/auth/services/authService';
import { SESSION_COOKIE_NAME } from '@/modules/auth/utils/crypto';
import type { Session } from '@prisma/client';

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Extract raw session token from request cookies or Authorization header
 */
export function extractSessionToken(request: NextRequest): string | null {
  // 1. Check cookies (supports both __Host-nexus_session and nexus_session)
  const cookieToken =
    request.cookies.get(SESSION_COOKIE_NAME)?.value ||
    request.cookies.get('__Host-nexus_session')?.value ||
    request.cookies.get('nexus_session')?.value;

  if (cookieToken) {
    return cookieToken;
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return null;
}

/**
 * Strict authentication guard for protected routes.
 * Throws AuthError (401) if invalid or unauthenticated.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: SafeUser; session: Session }> {
  const token = extractSessionToken(request);
  if (!token) {
    throw new AuthError('UNAUTHORIZED', 401);
  }

  const authData = await AuthService.validateSession(token);
  if (!authData) {
    throw new AuthError('SESSION_EXPIRED_OR_INVALID', 401);
  }

  return authData;
}

/**
 * Optional authentication guard.
 * Returns { user, session } if authenticated, or null if unauthenticated.
 */
export async function optionalAuth(
  request: NextRequest
): Promise<{ user: SafeUser; session: Session } | null> {
  const token = extractSessionToken(request);
  if (!token) {
    return null;
  }

  return await AuthService.validateSession(token);
}
