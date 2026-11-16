import { NextResponse } from 'next/server';
import { SignalService } from '@/modules/signals/services/signalService';
import { AuthService } from '@/modules/auth/services/authService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nexus_session=([^;]+)/);

    let userId: string;
    if (match) {
      const sessionResult = await AuthService.validateSession(match[1]);
      if (!sessionResult || !sessionResult.user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
      userId = sessionResult.user.id;
    } else {
      const body = await request.clone().json().catch(() => ({}));
      if (!body.userId) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
      }
      userId = body.userId;
    }

    const result = await SignalService.joinSignal(id, userId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 400 });
  }
}
