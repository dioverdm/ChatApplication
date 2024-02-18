import express from "express";
import userRouter from './userRouter';
import chatRouter from './chatRouter';
import messageRouter from './messageRouter';

const router = express.Router();
router.use('/auth', userRouter);
router.use('/chat', chatRouter);
router.use('/message',messageRouter);

export default router;