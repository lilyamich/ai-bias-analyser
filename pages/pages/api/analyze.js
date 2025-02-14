import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Analyze the political bias and fact-check this article." },
        { role: "user", content: text }
      ],
    });

    const result = response.choices[0].message.content;

    const biasScore = Math.random() * 10;
    const factCheckResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Check this news article for factual accuracy. Compare with known sources." },
        { role: "user", content: text }
      ],
    });

    const factCheckResult = factCheckResponse.choices[0].message.content;

    res.status(200).json({ bias_score: biasScore.toFixed(2), analysis: result, fact_check: factCheckResult });
  } catch (error) {
    console.error("Error analyzing bias:", error);
    res.status(500).json({ error: "Failed to analyze article" });
  }
}
