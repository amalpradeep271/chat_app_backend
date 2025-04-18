import { fetchContacts, addContact } from './../controllers/contactsControllers';
import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();


router.get("/", verifyToken, fetchContacts);
router.get("/", verifyToken, addContact);

export default router;
