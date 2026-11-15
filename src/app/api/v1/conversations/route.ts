import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/modules/messaging/services/messagingService';
import { requireAuth, AuthError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();

    if (!body.recipientId) {
      return NextResponse.json({ error: 'RECIPIENT_REQUIRED' }, { status: 400 });
    }

    const conversation = await MessagingService.getOrCreateDirectConversation(user.id, body.recipientId);
    return NextResponse.json({ success: true, data: conversation }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('BLOCKED') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
