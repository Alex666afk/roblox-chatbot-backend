export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { msg } = req.body;

    if (!msg || msg.trim() === "") {
      return res.status(400).json({ reply: "Please send a message." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/auto", // lets OpenRouter pick a valid free model
        messages: [{ role: "user", content: msg }],
      }),
    });

    const data = await response.json();

    // Log raw response to Vercel logs for debugging
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(400).json({ reply: `Error: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || "Bot is speechless 😅";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ reply: "Server error 😢" });
  }
}
