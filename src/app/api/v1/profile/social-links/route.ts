import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/modules/social/services/profileService';
import { requireAuth, AuthError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();

    const link = await ProfileService.setSocialLink(user.id, body.platform, body.url);
    return NextResponse.json({ success: true, data: link }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    if (!platform) {
      return NextResponse.json({ error: 'PLATFORM_REQUIRED' }, { status: 400 });
    }

    await ProfileService.removeSocialLink(user.id, platform);
    return NextResponse.json({ success: true, message: 'LINK_REMOVED' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
