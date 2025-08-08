import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import type { Beat, DownloadToken } from '@/types';

const adapter = new JSONFile<{ beats: Beat[]; tokens: DownloadToken[] }>('db.json');
const defaultData = { beats: [], tokens: [] };
export const db = new Low(adapter, defaultData);

export async function initDB() {
  await db.read();
  db.data ||= { beats: [], tokens: [] };
  await db.write();
}

export async function addBeat(partial: Omit<Beat, 'id' | 'createdAt'>) {
  await initDB();
  const beat: Beat = { id: nanoid(), createdAt: new Date().toISOString(), ...partial } as Beat;
  db.data!.beats.push(beat);
  await db.write();
  return beat;
}

export async function listBeats() {
  await initDB();
  return db.data!.beats.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getBeat(id: string) {
  await initDB();
  return db.data!.beats.find(b => b.id === id) ?? null;
}

export async function createToken(beatId: string, ttlMinutes = 60) {
  await initDB();
  const token: DownloadToken = {
    token: nanoid(32),
    beatId,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  };
  db.data!.tokens.push(token);
  await db.write();
  return token;
}

export async function consumeToken(tokenStr: string) {
  await initDB();
  const idx = db.data!.tokens.findIndex(t => t.token === tokenStr);
  if (idx === -1) return null;
  const token = db.data!.tokens[idx];
  if (Date.now() > token.expiresAt) {
    db.data!.tokens.splice(idx, 1);
    await db.write();
    return null;
  }
  // one-time use
  db.data!.tokens.splice(idx, 1);
  await db.write();
  return token;
}