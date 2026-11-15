import { NextRequest, NextResponse } from 'next/server';
import { MomentService } from '@/modules/moments/services/momentService';
import { requireAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    const invite = await MomentService.createInvite(
      id,
      user.id,
      body.maxUses ? Number(body.maxUses) : 10,
      body.durationHours ? Number(body.durationHours) : 24
    );

    return NextResponse.json({ success: true, data: invite }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('FORBIDDEN') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
