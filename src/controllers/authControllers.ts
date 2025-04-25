import { Request, Response } from "express";
import pool from "../models/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";
const randomImages = [
  'https://avatar.iran.liara.run/public/34',
  'https://avatar.iran.liara.run/public/12',
  'https://avatar.iran.liara.run/public/43',
  'https://avatar.iran.liara.run/public/13',
  'https://avatar.iran.liara.run/public/39',
];

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const randomImage=randomImages[Math.floor(Math.random()*randomImages.length)];
    const result = await pool.query(
      "INSERT INTO users (username,email,password, profile_image) VALUES ($1, $2 ,$3, $4) RETURNING *",
      [username, email, hashedPassword,randomImage]
    );
    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid creadentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "10h" });
    let finalResult = { ...user, token };
    res.json({ user: finalResult });
  } catch (error) {
    res.status(500).json({ error: "Failed to Log in" });
  }
};
