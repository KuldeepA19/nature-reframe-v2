import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/lyria-3-pro-preview:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        responseFormat: { audio: { mimeType: "audio/wav" } }
      }
    })
  });

  const data = await response.json();
  // Returns base64 audio data
  return NextResponse.json({ audio: data.candidates[0].content.parts[0].inlineData.data });
}
