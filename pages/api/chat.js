export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // you can swap to another model if you like
        messages: [
          {
            role: "system",
            content:
              "You are a Roblox coding assistant. " +
              "When the user asks for scripts or code, ALWAYS put them inside ### blocks. " +
              "Example: ###lua\nprint('Hello')\n###. " +
              "Do not use ``` or other markers."
          },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();

    // Grab the reply text safely
    const reply = data?.choices?.[0]?.message?.content || "🤖 No response";

    // Send reply back to Roblox
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
