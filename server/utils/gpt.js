import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callGPT(messages, useVision = false) {
  const res = await openai.responses.create({
    model: useVision ? "gpt-4.1-mini" : "gpt-4.1-mini",
    input: messages.map(m => m.content).join("\n\n"),
  });

  return res.output_text;
}
