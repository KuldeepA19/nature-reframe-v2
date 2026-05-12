'use client'; // This is critical!
import { useState } from 'react';

export default function SoulMood() {
  const [feeling, setFeeling] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReframing = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/relax', {
        method: 'POST',
        body: JSON.stringify({ feeling }),
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error("Error fetching mood");
    }
    setLoading(false);
  };

  return (
    <section className="my-10 p-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-emerald-900 mb-4">How is your soul?</h2>
      <textarea 
        className="w-full p-4 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition"
        placeholder="Tell the AI how you feel..."
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
      />
      <button 
        onClick={handleReframing}
        className="w-full mt-4 bg-emerald-700 text-white py-3 rounded-xl font-medium hover:bg-emerald-800 transition-all active:scale-95"
        disabled={loading}
      >
        {loading ? 'Reframing...' : 'Get AI Comfort'}
      </button>

      {data && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-emerald-800 italic border-l-4 border-emerald-500 pl-4">"{data.message}"</p>
          <div className="mt-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Soul Tracks</span>
            <ul className="mt-2 space-y-1">
              {data.songs.map((s, i) => (
                <li key={i} className="text-emerald-900 text-sm">✨ {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
