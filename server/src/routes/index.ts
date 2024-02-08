import express from "express";
import userRouter from './userRouter';
import chatRouter from './chatRouter';

const router = express.Router();
router.use('/auth', userRouter);
router.use('/chat', chatRouter);

export default router;