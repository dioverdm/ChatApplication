"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToGroup = exports.removeFromGroup = exports.renameGroup = exports.createGroupChat = exports.fetchChats = exports.accessChat = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.id;
        if (!userId) {
            return res.status(400).send("UserId param not sent with request");
        }
        const myid = new mongoose_1.default.Types.ObjectId(req._id);
        const UserId = new mongoose_1.default.Types.ObjectId(userId);
        let isChat = yield chatModel_1.default.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: myid } } },
                { users: { $elemMatch: { $eq: UserId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");
        const chat = yield userModel_1.default.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        if (chat.length > 0) {
            return res.send(chat[0]);
        }
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [myid, UserId],
        };
        const createdChat = yield chatModel_1.default.create(chatData);
        const FullChat = yield chatModel_1.default.findOne({ _id: createdChat._id }).populate("users", "-password");
        res.status(200).json(FullChat);
    }
    catch (error) {
        return res.send(error.message);
    }
});
exports.accessChat = accessChat;
// @description     Fetch all chats for a user
// @route           GET /api/chat/
// @access          Protected
const fetchChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myid = new mongoose_1.default.Types.ObjectId(req._id);
        // console.log(myid);
        const chat = yield chatModel_1.default.find({ users: { $elemMatch: { $eq: myid } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        const result = yield userModel_1.default.populate(chat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        // console.log(result);
        res.status(200).send(result);
    }
    catch (error) {
        return res.send(error.message);
    }
});
exports.fetchChats = fetchChats;
//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myid = new mongoose_1.default.Types.ObjectId(req._id);
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the feilds" });
        }
        var users = JSON.parse(req.body.users);
        // console.log(users);
        if (users.length < 2) {
            return res.status(400).send("More than 2 users are required to form a group chat");
        }
        users.push(yield userModel_1.default.findOne({ _id: myid }));
        const groupChat = yield chatModel_1.default.create({
            chatName: req.body.name,
            users: users,
            isGroup: true,
            groupAdmin: myid,
        });
        // console.log(groupChat);
        const fullGroupChat = yield chatModel_1.default.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        // console.log(fullGroupChat);
        res.status(200).json(fullGroupChat);
    }
    catch (error) {
        console.log(error);
        return res.send(error.message);
    }
});
exports.createGroupChat = createGroupChat;
// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, chatName } = req.body;
    const updatedChat = yield chatModel_1.default.findByIdAndUpdate(chatId, {
        chatName: chatName,
    }, {
        new: true,
    }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(updatedChat);
    }
});
exports.renameGroup = renameGroup;
// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    // check if the requester is admin
    const removed = yield chatModel_1.default.findByIdAndUpdate(chatId, {
        $pull: { users: userId },
    }, {
        new: true,
    }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("User Not Found");
    }
    else {
        res.json(removed);
    }
});
exports.removeFromGroup = removeFromGroup;
// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    // check if the requester is admin
    const added = yield chatModel_1.default.findByIdAndUpdate(chatId, {
        $push: { users: userId },
    }, {
        new: true,
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(added);
    }
});
exports.addToGroup = addToGroup;
