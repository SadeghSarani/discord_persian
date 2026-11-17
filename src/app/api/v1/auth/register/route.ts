import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/services/authService';
import { getSessionCookieOptions } from '@/modules/auth/utils/crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, name, password, avatarStyle } = body;

    if (!username || !email || !name || !password) {
      return NextResponse.json(
        { error: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || null;
    const userAgent = request.headers.get('user-agent') || null;

    const result = await AuthService.register(
      { username, email, name, password, avatarStyle },
      ipAddress,
      userAgent
    );

    const response = NextResponse.json(
      {
        user: result.user,
        message: 'REGISTRATION_SUCCESSFUL',
      },
      { status: 201 }
    );

    // Set secure HTTP-only session cookie
    const cookieOpts = getSessionCookieOptions(result.expiresAt);
    response.cookies.set(cookieOpts.name, result.sessionToken, cookieOpts);

    return response;
  } catch (error: any) {
    const message = error.message || 'REGISTRATION_FAILED';
    const status =
      message.includes('ALREADY_EXISTS') ? 409 :
      message.includes('INVALID') || message.includes('SHORT') || message.includes('RESERVED') ? 400 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
