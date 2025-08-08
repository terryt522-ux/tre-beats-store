import { Beat } from '@/types';
import BeatCard from '@/components/BeatCard';

async function fetchBeats(): Promise<Beat[]> {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const res = await fetch(base + '/api/beats', { cache: 'no-store' });
  return res.json();
}

export default async function StorePage() {
  const beats = await fetchBeats();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {beats.map(beat => <BeatCard key={beat.id} beat={beat} />)}
      {beats.length === 0 && <p>No beats yet. Check back soon!</p>}
    </div>
  );
}