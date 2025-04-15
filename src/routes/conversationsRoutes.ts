import { fetchAllConversationsByUserId } from "../controllers/conversationsController";
import { verifyToken } from "../middlewares/authMiddleware";
import { Router, Request, Response } from "express";
const router = Router();

router.get("/", verifyToken, fetchAllConversationsByUserId);

export default router;
