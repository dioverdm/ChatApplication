import express from "express";
import { allUsers, loginController, signpController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.get('/user', authMiddleware, allUsers);
router.post('/signup', signpController);
router.post('/login', loginController);

export default router;