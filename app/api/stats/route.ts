import { NextResponse } from 'next/server';
import { getStats } from '@/lib/actions';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('❌ /api/stats error:', error);
    return NextResponse.json(
      { articles: 0, cheatsheets: 0, tutorials: 0, categories: 0 },
      { status: 500 }
    );
  }
}
