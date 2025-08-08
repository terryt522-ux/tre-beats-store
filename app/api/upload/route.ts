import { NextResponse } from 'next/server';
import { addBeat } from '@/lib/db';
import { saveFile } from '@/lib/storage';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get('password') || '');
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const title = String(form.get('title') || 'Untitled');
  const price = Number(form.get('price') || '0');
  const bpm = form.get('bpm') ? String(form.get('bpm')) : undefined;
  const key = form.get('key') ? String(form.get('key')) : undefined;
  const audio = form.get('audio') as unknown as File | null;
  const cover = form.get('cover') as unknown as File | null;

  if (!audio) return NextResponse.json({ error: 'Audio file required' }, { status: 400 });

  const audioUrl = await saveFile(audio, 'audio');
  const coverUrl = cover ? await saveFile(cover, 'covers') : undefined;

  const beat = await addBeat({ title, price, bpm, key, audioUrl, coverUrl });
  return NextResponse.json({ ok: true, beat });
}