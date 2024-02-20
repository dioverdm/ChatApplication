"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const chatRouter_1 = __importDefault(require("./chatRouter"));
const messageRouter_1 = __importDefault(require("./messageRouter"));
const router = express_1.default.Router();
router.use('/auth', userRouter_1.default);
router.use('/chat', chatRouter_1.default);
router.use('/message', messageRouter_1.default);
exports.default = router;
