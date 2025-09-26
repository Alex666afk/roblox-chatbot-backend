export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // Send request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // you can swap to claude, mistral, etc
        messages: [
          {
            role: "system",
            content:
              "You are a Roblox coding assistant. " +
              "When user asks for scripts, ALWAYS wrap code inside ### blocks. " +
              "Example: ###lua\nprint('hi')\n###"
          },
          { role: "user", content: message }
        ],
      }),
    });

    // Parse reply from OpenRouter
    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: data.error?.message || "OpenRouter request failed",
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "🤖 No reply";

    // Send reply back to Roblox
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
\wrhg\iethj.iarthaet
