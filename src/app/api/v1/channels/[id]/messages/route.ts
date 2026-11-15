import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/modules/messaging/services/messagingService';
import { requireAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id: channelId } = await context.params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const result = await MessagingService.getChannelMessages(channelId, user.id, cursor, limit);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('NOT_COMMUNITY_MEMBER') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id: channelId } = await context.params;
    const body = await request.json();

    const message = await MessagingService.sendMessage(channelId, user.id, body);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('NOT_COMMUNITY_MEMBER') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
