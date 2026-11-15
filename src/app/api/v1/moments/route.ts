import { NextRequest, NextResponse } from 'next/server';
import { MomentService } from '@/modules/moments/services/momentService';
import { requireAuth, optionalAuth, AuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const sort = (searchParams.get('sort') as any) || 'recommended';

    const auth = await optionalAuth(request);
    const result = await MomentService.discoverMoments({
      viewerId: auth?.user?.id,
      category,
      search,
      cursor,
      limit,
      sort,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error fetching discovery moments:', error);
    return NextResponse.json(
      { success: false, error: 'FAILED_TO_FETCH_MOMENTS' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Identity strictly derived from authenticated session cookie
    const { user } = await requireAuth(request);

    const body = await request.json();
    const { title, description, category, tags, capacity, durationHours, visibility } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const moment = await MomentService.createMoment({
      creatorId: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: Array.isArray(tags) ? tags : [],
      capacity: Number(capacity) || 8,
      durationHours: Number(durationHours) || 4,
      visibility: visibility || undefined,
    });

    return NextResponse.json({ success: true, data: moment }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    console.error('Error creating moment:', error);
    return NextResponse.json(
      { success: false, error: 'FAILED_TO_CREATE_MOMENT', details: error.message },
      { status: 500 }
    );
  }
}
