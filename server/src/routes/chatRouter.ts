import express from "express";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chatController";
import { authMiddleware } from '../middlewares/authMiddleware';
import { newRequest } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authMiddleware);
router.post('/', accessChat)
router.get('/', fetchChats);
router.post("/group", createGroupChat);
router.put("/rename", renameGroup);
router.put("/groupremove", removeFromGroup);
router.put("/groupadd", addToGroup);

export default router;
