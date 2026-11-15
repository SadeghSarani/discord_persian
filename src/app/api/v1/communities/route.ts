import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/modules/communities/services/communityService';
import { requireAuth, optionalAuth, AuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await optionalAuth(request);
    const communities = await CommunityService.listCommunities(auth?.user?.id);
    return NextResponse.json({ success: true, data: communities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();

    const community = await CommunityService.createCommunity(user.id, body);
    return NextResponse.json({ success: true, data: community }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
