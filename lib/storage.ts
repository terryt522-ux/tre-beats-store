import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const BEATS_DIR = path.join(process.cwd(), 'public', 'beats');

export async function ensureDirs() {
  await fs.mkdir(BEATS_DIR, { recursive: true });
}

export async function saveFile(file: File, subdir: 'audio' | 'covers') {
  await ensureDirs();
  const ext = path.extname(file.name) || (subdir === 'audio' ? '.mp3' : '.jpg');
  const name = `${subdir}-${nanoid()}${ext}`;
  const targetDir = path.join(BEATS_DIR, subdir);
  await fs.mkdir(targetDir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(targetDir, name), buf);
  return `/beats/${subdir}/${name}`;
}