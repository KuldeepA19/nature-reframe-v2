'use client';
import { useChat } from 'ai/react';
import { useState } from 'react';

export default function NatureReframe() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [audioUrl, setAudioUrl] = useState('');
  const [isMusicLoading, setIsMusicLoading] = useState(false);

  const generateMusic = async () => {
    setIsMusicLoading(true);
    const res = await fetch('/api/music', {
      method: 'POST',
      body: JSON.stringify({ prompt: "Calm, ambient nature sounds with birds and wind" }),
    });
    const data = await res.json();
    setAudioUrl(`data:audio/wav;base64,${data.audio}`);
    setIsMusicLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-10 font-sans">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Nature Reframe V2</h1>

      {/* Chat History Box */}
      <div className="w-full max-w-xl h-96 border-2 border-green-200 rounded-xl bg-white p-4 overflow-y-auto mb-4 shadow-inner">
        {messages.map(m => (
          <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-3 rounded-lg ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-2">
        <input 
          className="flex-1 border-2 border-green-300 p-3 rounded-lg focus:outline-none focus:border-green-600"
          value={input} 
          placeholder="Ask a nature question..." 
          onChange={handleInputChange} 
        />
        <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition">Send</button>
      </form>

      {/* Music Section */}
      <div className="mt-12 text-center">
        <button 
          onClick={generateMusic} 
          disabled={isMusicLoading}
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isMusicLoading ? "Generating Soundscape..." : "🎵 Generate Nature Music"}
        </button>
        {audioUrl && (
          <div className="mt-6 animate-fade-in">
            <audio controls src={audioUrl} className="mx-auto" />
            <p className="text-sm text-gray-500 mt-2">AI-Generated Nature Sounds</p>
          </div>
        )}
      </div>
    </div>
  );
}
