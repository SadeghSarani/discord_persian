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

    if (!body.reason) {
      return NextResponse.json({ error: 'REASON_REQUIRED' }, { status: 400 });
    }

    const report = await MomentService.reportMoment(id, user.id, body.reason);
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('ALREADY') ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
