import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/modules/communities/services/communityService';
import { requireAuth, optionalAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const auth = await optionalAuth(request);
    const community = await CommunityService.getCommunityById(id, auth?.user?.id);

    if (!community) {
      return NextResponse.json({ error: 'COMMUNITY_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: community });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
