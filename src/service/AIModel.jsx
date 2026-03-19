import axios from "axios";

const apiKey = import.meta.env.VITE_GROK_API_KEY;

if (!apiKey) {
  throw new Error("Missing VITE_GROK_API_KEY in .env.local");
}

const modelCandidates = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const generateWithModel = async (modelName, prompt) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const chatSession = {
  sendMessage: async (prompt) => {
    let lastError = null;

    for (let i = 0; i < modelCandidates.length; i++) {
      const modelName = modelCandidates[i];
      try {
        const result = await generateWithModel(modelName, prompt);
        return {
          response: {
            text: () => result.choices[0]?.message?.content || "",
          },
        };
      } catch (error) {
        lastError = error;
        console.warn(`[Groq] Failed model: ${modelName}`, error?.response?.data || error?.message);
      }
    }

    throw new Error(
      `All Groq models failed. Tried: ${modelCandidates.join(", ")}. Last error: ${lastError?.message}`
    );
  },
};
