// pages/api/mood.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { feeling } = req.body;

  const prompt = `The user is feeling: "${feeling}". 
  Provide a short, soulful, and empathetic AI response (max 2 sentences). 
  Then, suggest 3 soul-relaxing songs (Artist - Title) that match this mood. 
  Format as JSON: { "message": "...", "songs": ["...", "...", "..."] }`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mood data" });
  }
}
