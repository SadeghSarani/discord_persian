import { NextRequest, NextResponse } from 'next/server';
import { MomentService } from '@/modules/moments/services/momentService';
import { requireAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result = await MomentService.joinMoment(id, user.id, body.inviteToken);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error joining moment:', error);
    const status =
      error.message.includes('FULL') ? 409 :
      error.message.includes('BLOCKED') || error.message.includes('REQUIRED') || error.message.includes('FRIENDS') ? 403 :
      error.message.includes('NOT_FOUND') ? 404 : 400;
    return NextResponse.json({ error: error.message || 'خطا در عضویت در مامنت' }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;

    await MomentService.leaveMoment(id, user.id);
    return NextResponse.json({ success: true, message: 'LEFT_MOMENT' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error leaving moment:', error);
    return NextResponse.json({ error: error.message || 'خطا در خروج از مامنت' }, { status: 400 });
  }
}
