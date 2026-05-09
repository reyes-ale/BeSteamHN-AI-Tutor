const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

function respond(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405);
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return respond({ error: "AI not configured" }, 500);
    }

    const { messages, locale } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return respond({ error: "messages array is required" }, 400);
    }

    const systemPrompt =
      locale === "es"
        ? `Eres un tutor de IA educativo para BESTEAMHN, una plataforma de aprendizaje STEM para jóvenes en Honduras.
Ayudas a estudiantes a aprender programación, robótica, diseño digital y habilidades blandas.
Responde siempre en español de manera amigable, clara y alentadora.
Usa ejemplos prácticos y del contexto hondureño cuando sea apropiado.
Mantén las respuestas concisas (máximo 3-4 párrafos).
Cuando expliques código, usa bloques de código con el lenguaje correcto.`
        : `You are an educational AI tutor for BESTEAMHN, a STEM learning platform for youth in Honduras.
You help students learn programming, robotics, digital design, and soft skills.
Always respond in English in a friendly, clear, and encouraging way.
Use practical examples and relate to the Honduran context when appropriate.
Keep responses concise (maximum 3-4 paragraphs).
When explaining code, use code blocks with the correct language.`;

    // Gemini uses "user" and "model" roles and requires strict alternation starting with "user"
    const geminiContents: { role: string; parts: { text: string }[] }[] = [];
    for (const m of messages) {
      if (m.role !== "user" && m.role !== "assistant") continue;
      const role = m.role === "assistant" ? "model" : "user";
      // Drop consecutive same-role messages
      if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === role) continue;
      geminiContents.push({ role, parts: [{ text: m.content }] });
    }

    // Must start with a user message
    while (geminiContents.length > 0 && geminiContents[0].role !== "user") {
      geminiContents.shift();
    }

    if (geminiContents.length === 0) {
      return respond({ error: "No valid user messages" }, 400);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return respond({ error: "AI service error" }, 502);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return respond({ content });
  } catch (err) {
    console.error("AI tutor error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
