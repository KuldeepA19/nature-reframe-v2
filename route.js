// app/api/relax/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { feeling } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a soul-soothing assistant. Provide a brief, empathetic response and 3 relaxing songs." },
          { role: "user", content: `I feel: ${feeling}. Return JSON: { "message": "...", "songs": ["Artist - Title"] }` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    return NextResponse.json({ error: "Resting..." }, { status: 500 });
  }
}
