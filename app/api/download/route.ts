import { NextResponse } from 'next/server';
import { consumeToken, getBeat } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  const t = await consumeToken(token);
  if (!t) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  const beat = await getBeat(t.beatId);
  if (!beat) return NextResponse.json({ error: 'Beat not found' }, { status: 404 });

  return NextResponse.redirect(new URL(beat.audioUrl, process.env.BASE_URL || 'http://localhost:3000'));
}