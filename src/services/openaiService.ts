import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export const generateDailyQuestion = async (): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content:
            "Generate a fun and engaging daily question for a chat conversation.",
        },
      ],
      max_tokens: 50,
    });
    return (
      response.choices[0]?.message?.content?.trim() ||
      "what's your favourite hobby?"
    );
  } catch (error) {
    console.error("Error generting daily question:", error);
    return "Here is a random question:what's your favourite book?";
  }
};
