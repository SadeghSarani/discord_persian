import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/modules/communities/services/communityService';
import { requireAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;

    const member = await CommunityService.joinCommunity(id, user.id);
    return NextResponse.json({ success: true, data: member }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('BANNED') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;

    await CommunityService.leaveCommunity(id, user.id);
    return NextResponse.json({ success: true, message: 'LEFT_COMMUNITY' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
