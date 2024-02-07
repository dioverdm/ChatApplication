import express from "express";
import { signpController } from "../controllers/userController";
const router = express.Router();


router.post('/signup', signpController);


export default router;