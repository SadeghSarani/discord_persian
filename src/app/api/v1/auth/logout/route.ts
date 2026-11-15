import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/services/authService';
import { extractSessionToken } from '@/lib/auth';
import { SESSION_COOKIE_NAME } from '@/modules/auth/utils/crypto';

export async function POST(request: NextRequest) {
  try {
    const token = extractSessionToken(request);
    if (token) {
      await AuthService.logout(token);
    }

    const response = NextResponse.json({ success: true, message: 'LOGGED_OUT' });

    // Clear session cookies for both possible cookie names
    response.cookies.delete(SESSION_COOKIE_NAME);
    response.cookies.delete('__Host-nexus_session');
    response.cookies.delete('nexus_session');

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'LOGOUT_FAILED' },
      { status: 500 }
    );
  }
}
