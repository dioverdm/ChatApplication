import express from "express";
const {
    accessChat,
    fetchChats,
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post('/', accessChat)
router.get('/', fetchChats);
router.post("/group", createGroupChat);
router.put("/rename", renameGroup);
router.put("/groupremove", removeFromGroup);
router.put("/groupadd", addToGroup);

export default router;
