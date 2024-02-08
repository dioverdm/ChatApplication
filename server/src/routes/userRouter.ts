import express from "express";
import { loginController, signpController } from "../controllers/userController";
const router = express.Router();


router.post('/signup', signpController);
router.post('/login', loginController);

export default router;