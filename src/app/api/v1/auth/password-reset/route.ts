import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/services/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'request') {
      const { email } = body;
      if (!email) {
        return NextResponse.json({ error: 'EMAIL_REQUIRED' }, { status: 400 });
      }

      const result = await AuthService.requestPasswordReset(email);
      // In development or test, we return the resetToken in the response body so it can be verified.
      // In production, this would dispatch an email.
      return NextResponse.json({
        success: true,
        message: 'RESET_TOKEN_GENERATED_IF_EMAIL_EXISTS',
        ...(process.env.NODE_ENV !== 'production' && result ? { resetToken: result.resetToken } : {}),
      });
    }

    if (action === 'reset') {
      const { token, newPassword } = body;
      if (!token || !newPassword) {
        return NextResponse.json({ error: 'TOKEN_AND_NEW_PASSWORD_REQUIRED' }, { status: 400 });
      }

      await AuthService.resetPassword(token, newPassword);
      return NextResponse.json({
        success: true,
        message: 'PASSWORD_RESET_SUCCESSFUL',
      });
    }

    return NextResponse.json({ error: 'INVALID_ACTION' }, { status: 400 });
  } catch (error: any) {
    const message = error.message || 'PASSWORD_RESET_FAILED';
    const status = message.includes('INVALID') || message.includes('EXPIRED') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
