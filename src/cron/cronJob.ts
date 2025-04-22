import { error } from "console";
import cron from "node-cron";
import pool from "../models/db";
import { generateDailyQuestion } from "../services/openaiService";

cron.schedule("0 9***", async () => {
  try {
    const conversations = await pool.query("SELECT id FROM conversations");
    for (const conversation of conversations.rows) {
      const question = await generateDailyQuestion();

      await pool.query(
        `
                INSERT INTO messages (conversation_id, sender_id, content)
                VALUES
                ($1, 'AI-BOT', $2)
                `,
        [conversation.id, question]
      );
      console.log(`Daily questions send for conversation ${conversation.id}`);
    }
  } catch (error) {
    console.log(`Error in daily question job:`, error);
  }
});
