import express from 'express';
import { sendMessages,allMessages } from '../controllers/messageController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router=express.Router();
router.use(authMiddleware);
router.get('/:chatId',allMessages);
router.post('/send',sendMessages);


export default router;