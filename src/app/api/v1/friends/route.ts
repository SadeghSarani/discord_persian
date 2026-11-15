import { NextRequest, NextResponse } from 'next/server';
import { SocialGraphService } from '@/modules/social/services/socialGraphService';
import { requireAuth, AuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const friends = await SocialGraphService.listFriends(user.id);
    return NextResponse.json({ success: true, data: friends });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();

    if (body.action === 'send') {
      const res = await SocialGraphService.sendFriendRequest(user.id, body.targetUserId);
      return NextResponse.json({ success: true, data: res }, { status: 201 });
    }

    if (body.action === 'accept') {
      const res = await SocialGraphService.acceptFriendRequest(user.id, body.requesterId);
      return NextResponse.json({ success: true, data: res }, { status: 200 });
    }

    if (body.action === 'remove') {
      await SocialGraphService.removeFriendship(user.id, body.targetUserId);
      return NextResponse.json({ success: true, message: 'FRIENDSHIP_REMOVED' }, { status: 200 });
    }

    if (body.action === 'block') {
      const res = await SocialGraphService.blockUser(user.id, body.targetUserId);
      return NextResponse.json({ success: true, data: res }, { status: 200 });
    }

    if (body.action === 'unblock') {
      await SocialGraphService.unblockUser(user.id, body.targetUserId);
      return NextResponse.json({ success: true, message: 'USER_UNBLOCKED' }, { status: 200 });
    }

    return NextResponse.json({ error: 'INVALID_ACTION' }, { status: 400 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('BLOCKED') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
