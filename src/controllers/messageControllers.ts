import { Request, Response } from "express";
import pool from "../models/db";

export const fetchAllMessagesByConversationId = async (
  req: Request,
  res: Response
) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.id, m.content ,m.sender_id, m.conversation_id, m.created_at
        FROM messages m
        Where m.conversation_id = $1
        Order by m.created_at ASC;
        `,
      [conversationId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const saveMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  try {
    const result = await pool.query(
      `
          INSERT INTO messages (conversation_id, sender_id, content)
          Values ($1,$2,$3)
          Returning *;
          `,
      [conversationId, senderId, content]
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error:" + error);
    throw new Error("Failed to save message");
  }
};
