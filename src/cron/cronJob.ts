import cron from "node-cron";
import pool from "../models/db";
import { generateDailyQuestion } from "../services/openaiService";
import { AI_BOT_ID } from "../config";
import dayjs from "dayjs";

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Daily Question Cron Started");

    const today = dayjs().format("YYYY-MM-DD");

    // Check if today's question already exists
    const existing = await pool.query(
      "SELECT question FROM daily_questions WHERE date = $1",
      [today]
    );

    let question: string;

    if (existing && existing.rowCount! > 0) {
      question = existing.rows[0].question;
    } else {
      question = await generateDailyQuestion();
      await pool.query(
        `INSERT INTO daily_questions (date, question)
         VALUES ($1, $2)
         ON CONFLICT (date) DO UPDATE SET question = EXCLUDED.question`,
        [today, question]
      );
    }

    const conversations = await pool.query("SELECT id FROM conversations");

    for (const conversation of conversations.rows) {
      await pool.query(
        `
        INSERT INTO messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3)
        `,
        [conversation.id, AI_BOT_ID, question]
      );
      console.log(`Daily question sent to conversation ${conversation.id}`);
    }
  } catch (error) {
    console.error("Error in daily question cron job:", error);
  }
});
