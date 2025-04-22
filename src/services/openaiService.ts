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
          content:
            "Generate a fun and engaging daily question for a chat conversation.",
        },
      ],
      max_tokens: 50,
    });
    console.log("generateQuestion - openAi called :");
    console.log(response);
    console.log(response.choices[0]?.message?.content);
    return (
      response.choices[0]?.message?.content?.trim() ||
      "what's your favourite hobby?"
    );
  } catch (error) {
    console.error("Error generting daily question:", error);
    return "Here is a random question: what's your favourite book?";
  }
};
