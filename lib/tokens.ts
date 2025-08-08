import { createToken, getBeat } from '@/lib/db';

export async function issueDownloadLink(beatId: string, baseUrl: string) {
  const beat = await getBeat(beatId);
  if (!beat) throw new Error('Beat not found');
  const token = await createToken(beatId, 120); // 2 hours
  return `${baseUrl}/api/download?token=${token.token}`;
}