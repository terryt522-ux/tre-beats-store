"use client";
import { useState } from 'react';

export default function UploadPage() {
  const [password, setPassword] = useState('');
  const [form, setForm] = useState({ title: '', price: 2999, bpm: '', key: '' });
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('password', password);
    fd.append('title', form.title);
    fd.append('price', String(form.price));
    if (form.bpm) fd.append('bpm', form.bpm);
    if (form.key) fd.append('key', form.key);
    if (audio) fd.append('audio', audio);
    if (cover) fd.append('cover', cover);

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setMsg('Uploaded!'); else setMsg(data.error || 'Upload failed');
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Upload Beat</h1>
      <form onSubmit={submit} className="space-y-4">
        <input type="password" placeholder="Admin Password" className="w-full border rounded-xl p-2" value={password} onChange={e => setPassword(e.target.value)} required />
        <input placeholder="Title" className="w-full border rounded-xl p-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="number" placeholder="Price (cents)" className="w-full border rounded-xl p-2" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="BPM" className="w-full border rounded-xl p-2" value={form.bpm} onChange={e => setForm({ ...form, bpm: e.target.value })} />
          <input placeholder="Key (e.g., Am)" className="w-full border rounded-xl p-2" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Audio (mp3/wav)</label>
          <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Cover (jpg/png)</label>
          <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] || null)} />
        </div>
        <button className="rounded-xl border px-4 py-2">Upload</button>
      </form>
      {msg && <p className="mt-4 text-sm">{msg}</p>}
    </div>
  );
}