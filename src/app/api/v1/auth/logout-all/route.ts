import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth';
import { AuthService } from '@/modules/auth/services/authService';
import { SESSION_COOKIE_NAME } from '@/modules/auth/utils/crypto';

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const revokedCount = await AuthService.logoutAll(user.id);

    const response = NextResponse.json({
      success: true,
      message: 'LOGGED_OUT_ALL_SESSIONS',
      revokedCount,
    });

    response.cookies.delete(SESSION_COOKIE_NAME);
    response.cookies.delete('__Host-nexus_session');
    response.cookies.delete('nexus_session');

    return response;
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
