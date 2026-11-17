import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/services/authService';
import { getSessionCookieOptions } from '@/modules/auth/utils/crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = body.identifier?.trim();
    const password = body.password?.trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'MISSING_CREDENTIALS' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || null;
    const userAgent = request.headers.get('user-agent') || null;

    const result = await AuthService.login({
      identifier,
      password,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(
      {
        user: result.user,
        message: 'LOGIN_SUCCESSFUL',
      },
      { status: 200 }
    );

    // Set secure HTTP-only session cookie
    const cookieOpts = getSessionCookieOptions(result.expiresAt);
    response.cookies.set(cookieOpts.name, result.sessionToken, cookieOpts);

    return response;
  } catch (error: any) {
    const message = error.message || 'LOGIN_FAILED';
    const status =
      message === 'INVALID_CREDENTIALS' ? 401 :
      message === 'USER_BANNED' ? 403 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
