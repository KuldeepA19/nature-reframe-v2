import { useState } from 'react';

export default function MoodRecommender() {
  const [feeling, setFeeling] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMoodHelp = async () => {
    setLoading(true);
    const res = await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeling }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-green-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-serif mb-4 text-green-800">Nature Reframe: Soul Moods</h2>
      <textarea 
        className="w-full p-3 border rounded-lg"
        placeholder="How are you feeling right now?"
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
      />
      <button 
        onClick={getMoodHelp}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? 'Finding peace...' : 'Get Relaxing Vibes'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-green-500 animate-fade-in">
          <p className="italic text-gray-700">"{result.message}"</p>
          <div className="mt-4">
            <p className="font-bold text-sm uppercase text-gray-500">Suggested for your soul:</p>
            <ul className="list-disc ml-5 mt-2">
              {result.songs.map((song, i) => (
                <li key={i} className="text-green-900">{song}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
