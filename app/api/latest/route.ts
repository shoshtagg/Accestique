import { NextResponse } from 'next/server';
import { getLatestThreats, getCheatsheets } from '@/lib/actions';

export async function GET() {
  try {
    const [articles, cheatsheets] = await Promise.all([
      getLatestThreats(3, 0),
      getCheatsheets('Tout', 3, 0),
    ]);

    const latest = [
      ...(articles || []).map((a: any) => ({
        id: a.id,
        type: 'Article' as const,
        title: a.title ?? 'Article sans titre',
      })),
      ...(cheatsheets || []).map((c: any) => ({
        id: c.id,
        type: 'Cheatsheet' as const,
        title: (c.tool_name ?? 'Outil') + (c.category ? ` // ${c.category}` : ''),
      })),
    ].slice(0, 6);

    return NextResponse.json(latest, { status: 200 });
  } catch (error) {
    console.error('❌ /api/latest error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
