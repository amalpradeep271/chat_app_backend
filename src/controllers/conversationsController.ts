import pool from "../models/db";
import { Request, Response } from "express";

export const fetchAllConversationsByUserId = async (
  req: Request,
  res: Response
) => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }
  try {
    const result = await pool.query(
      `
        SELECT
            c.id AS conversation_id,
            CASE 
                WHEN u1.id = $1 THEN u2.username
                ELSE u1.username
            END AS participant_name,
            m.content AS last_message, 
            m.created_at AS last_message_time 
        FROM conversations c
        JOIN users u1 ON u1.id = c.participant_one
        JOIN users u2 ON u2.id = c.participant_two
        LEFT JOIN LATERAL (
            SELECT content, created_at
            From messages
            Where conversation_id = c.id
            Order by created_at desc
            Limit 1
        ) m ON true
        Where c.participant_one = $1 or c.participant_two = $1
        Order by m.created_at DESC;  
        `,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
