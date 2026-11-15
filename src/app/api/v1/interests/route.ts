import { NextRequest, NextResponse } from 'next/server';
import { InterestService } from '@/modules/social/services/interestService';
import { requireAuth, optionalAuth, AuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (query) {
      const results = await InterestService.searchInterests(query);
      return NextResponse.json({ success: true, data: results });
    }

    const taxonomy = await InterestService.listTaxonomy();
    return NextResponse.json({ success: true, data: taxonomy });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();

    if (!Array.isArray(body.interests)) {
      return NextResponse.json({ error: 'INTERESTS_ARRAY_REQUIRED' }, { status: 400 });
    }

    const updated = await InterestService.setUserInterests(user.id, body.interests);
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
