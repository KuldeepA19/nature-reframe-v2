// pages/api/relax.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Post only' });

  const { feeling } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Add your key to Vercel
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        messages: [
          {
            role: "system",
            content: "You are a soul-soothing assistant. Provide a brief, empathetic response to the user's mood and suggest 3 relaxing, soulful songs."
          },
          {
            role: "user",
            content: `I am feeling: ${feeling}. Give me a short comfort message and 3 song recommendations in JSON format: { "message": "...", "songs": ["Artist - Title", "..."] }`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: "The soul is resting. Try again later." });
  }
}
