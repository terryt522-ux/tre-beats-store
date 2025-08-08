"use client";
import { Beat } from '@/types';

export default function BeatCard({ beat }: { beat: Beat }) {
  const handleBuy = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beatId: beat.id })
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {beat.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={beat.coverUrl} alt={beat.title} className="h-40 w-full object-cover rounded-xl mb-3" />
      )}
      <h3 className="font-semibold text-lg">{beat.title}</h3>
      <p className="text-sm text-neutral-500">{beat.bpm ? beat.bpm + ' BPM · ' : ''}{beat.key ?? ''}</p>
      <audio controls className="w-full my-3">
        <source src={beat.audioUrl} />
      </audio>
      <div className="flex items-center justify-between">
        <span className="font-bold">${(beat.price / 100).toFixed(2)}</span>
        <button onClick={handleBuy} className="rounded-xl border px-4 py-2 hover:bg-neutral-50">Buy</button>
      </div>
    </div>
  );
}