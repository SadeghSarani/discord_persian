import { NextRequest, NextResponse } from 'next/server';
import { MomentService } from '@/modules/moments/services/momentService';
import { requireAuth, optionalAuth, AuthError } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const auth = await optionalAuth(request);
    const moment = await MomentService.getMomentById(id, auth?.user?.id);

    if (!moment) {
      return NextResponse.json({ error: 'مامنت پیدا نشد یا دسترسی به آن محدود است' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: moment });
  } catch (error: any) {
    console.error('Error fetching moment by id:', error);
    return NextResponse.json({ error: 'خطا در دریافت مامنت' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;
    const body = await request.json();

    const updated = await MomentService.updateMoment(id, user.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('FORBIDDEN') ? 403 : error.message.includes('NOT_FOUND') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await context.params;

    const cancelled = await MomentService.cancelMoment(id, user.id);
    return NextResponse.json({ success: true, data: cancelled });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const status = error.message.includes('FORBIDDEN') ? 403 : error.message.includes('NOT_FOUND') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
