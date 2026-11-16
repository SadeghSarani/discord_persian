import { NextResponse } from 'next/server';
import { SignalService } from '@/modules/signals/services/signalService';
import { AuthService } from '@/modules/auth/services/authService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const interest = searchParams.get('interest') || undefined;

    // Optional authentication to filter blocked users
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nexus_session=([^;]+)/);
    let viewerId: string | undefined;

    if (match) {
      const sessionResult = await AuthService.validateSession(match[1]);
      if (sessionResult && sessionResult.user) viewerId = sessionResult.user.id;
    }

    const signals = await SignalService.discoverSignals({
      viewerId,
      category,
      interest,
    });

    return NextResponse.json({ signals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nexus_session=([^;]+)/);

    let creatorId: string;
    if (match) {
      const sessionResult = await AuthService.validateSession(match[1]);
      if (!sessionResult || !sessionResult.user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
      creatorId = sessionResult.user.id;
    } else {
      // Allow passing creatorId in body for dev or mock testing
      const body = await request.clone().json();
      if (!body.creatorId) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
      }
      creatorId = body.creatorId;
    }

    const body = await request.json();
    const signal = await SignalService.createSignal({
      creatorId,
      activityCategory: body.activityCategory || 'gaming',
      targetInterest: body.targetInterest,
      description: body.description,
      targetCount: body.targetCount,
      minCount: body.minCount,
      maxCapacity: body.maxCapacity,
      estimatedDuration: body.estimatedDuration,
      visibility: body.visibility,
    });

    return NextResponse.json({ signal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 400 });
  }
}
