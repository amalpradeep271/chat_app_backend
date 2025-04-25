import OpenAI from "openai";
import { openaiKey } from "../config";

const openai = new OpenAI({
  apiKey: openaiKey,
});

export const generateDailyQuestion = async (): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Generate a fun and engaging daily question for a chat conversation.",
        },
      ],
      max_tokens: 50,
    });

    const content = response.choices[0]?.message?.content?.trim();
    console.log("Generated question:", content);
    return content || "What's your favorite hobby?";
  } catch (error) {
    console.error("Error generating daily question from OpenAI:", error);
    // fallback
    const fallback = [
      "What's one thing you wish you learned earlier?",
      "What would your perfect day look like?",
      "If you could master any skill instantly, what would it be?",
    ];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
};
