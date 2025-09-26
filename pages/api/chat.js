export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMsg = req.body.msg || "Hello";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // you can swap this model later
        messages: [{ role: "user", content: userMsg }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Bot is speechless 😅";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error talking to AI 🤖" });
  }
}
