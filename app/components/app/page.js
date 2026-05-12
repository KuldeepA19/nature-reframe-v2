'use client'; // This tells Next.js this is an interactive component

import { useState } from 'react';

export default function Home() {
  const [feeling, setFeeling] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReframing = async () => {
    if (!feeling) return;
    setLoading(true);
    try {
      const res = await fetch('/api/relax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling }),
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error("AI failed to respond");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-stone-50 p-8 font-sans">
      {/* YOUR EXISTING NATURE CONTENT STARTS HERE */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">Nature Reframe</h1>
        <p className="text-emerald-700">Find peace through nature and AI soul-soothing melodies.</p>
      </div>

      {/* AI MOOD SECTION */}
      <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl border border-emerald-50">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">How are you feeling right now?</h2>
        <textarea 
          className="w-full p-4 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none h-32 text-gray-700"
          placeholder="Share your thoughts... e.g., 'I feel tired but peaceful'"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />
        <button 
          onClick={handleReframing}
          className="w-full mt-4 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Reframing your mood...' : 'Get Soulful Response'}
        </button>

        {data && (
          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border-l-4 border-emerald-500">
            <p className="text-emerald-900 italic mb-4 leading-relaxed">"{data.message}"</p>
            <div>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Recommended for you</p>
              <ul className="space-y-2">
                {data.songs?.map((song, i) => (
                  <li key={i} className="flex items-center text-emerald-800">
                    <span className="mr-2">🎵</span> {song}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
