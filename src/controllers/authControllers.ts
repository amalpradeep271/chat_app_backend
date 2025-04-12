import { Request, Response } from "express";
import pool from "../models/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1, $2 ,$3) RETURNING *",
      [username, email, hashedPassword]
    );
    const user = result.rows[0];
    res.status(201).json({ message: "User created Successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response) => {};
