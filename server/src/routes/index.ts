import express from "express";
import userRouter from './userRouter';

const router = express.Router();
router.use('/auth', userRouter);

export default router;