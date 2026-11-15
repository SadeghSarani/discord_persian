import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/modules/social/services/profileService';
import { requireAuth, AuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const profile = await ProfileService.getMyProfile(user.id);
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();

    const updated = await ProfileService.updateProfile(user.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('TAKEN') || error.message.includes('RESERVED') ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
