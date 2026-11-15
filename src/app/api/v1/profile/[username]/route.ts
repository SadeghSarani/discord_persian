import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/modules/social/services/profileService';
import { optionalAuth } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ username: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { username } = await context.params;
    const auth = await optionalAuth(request);

    const publicProfile = await ProfileService.getPublicProfile(username, auth?.user?.id);
    if (!publicProfile) {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: publicProfile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
