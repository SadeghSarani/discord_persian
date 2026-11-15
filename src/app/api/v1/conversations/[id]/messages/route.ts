import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/modules/messaging/services/messagingService';
import { requireAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id: conversationId } = await context.params;

    const messages = await MessagingService.getDirectMessages(conversationId, user.id);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('FORBIDDEN') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id: conversationId } = await context.params;
    const body = await request.json();

    const message = await MessagingService.sendDirectMessage(conversationId, user.id, body.content);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('BLOCKED') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
