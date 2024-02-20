"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.post('/', chatController_1.accessChat);
router.get('/', chatController_1.fetchChats);
router.post("/group", chatController_1.createGroupChat);
router.put("/rename", chatController_1.renameGroup);
router.put("/groupremove", chatController_1.removeFromGroup);
router.put("/groupadd", chatController_1.addToGroup);
exports.default = router;
