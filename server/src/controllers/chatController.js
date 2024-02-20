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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToGroup = exports.removeFromGroup = exports.renameGroup = exports.createGroupChat = exports.fetchChats = exports.accessChat = void 0;
var chatModel_1 = require("../models/chatModel");
var userModel_1 = require("../models/userModel");
var mongoose_1 = require("mongoose");
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
var accessChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, myid, UserId, isChat, chat, chatData, createdChat, FullChat, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                userId = req.body.id;
                if (!userId) {
                    return [2 /*return*/, res.status(400).send("UserId param not sent with request")];
                }
                myid = new mongoose_1.default.Types.ObjectId(req._id);
                UserId = new mongoose_1.default.Types.ObjectId(userId);
                return [4 /*yield*/, chatModel_1.default.find({
                        isGroupChat: false,
                        $and: [
                            { users: { $elemMatch: { $eq: myid } } },
                            { users: { $elemMatch: { $eq: UserId } } },
                        ],
                    })
                        .populate("users", "-password")
                        .populate("latestMessage")];
            case 1:
                isChat = _a.sent();
                return [4 /*yield*/, userModel_1.default.populate(isChat, {
                        path: "latestMessage.sender",
                        select: "name pic email",
                    })];
            case 2:
                chat = _a.sent();
                if (chat.length > 0) {
                    return [2 /*return*/, res.send(chat[0])];
                }
                chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [myid, UserId],
                };
                return [4 /*yield*/, chatModel_1.default.create(chatData)];
            case 3:
                createdChat = _a.sent();
                return [4 /*yield*/, chatModel_1.default.findOne({ _id: createdChat._id }).populate("users", "-password")];
            case 4:
                FullChat = _a.sent();
                res.status(200).json(FullChat);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                return [2 /*return*/, res.send(error_1.message)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.accessChat = accessChat;
// @description     Fetch all chats for a user
// @route           GET /api/chat/
// @access          Protected
var fetchChats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var myid, chat, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                myid = new mongoose_1.default.Types.ObjectId(req._id);
                return [4 /*yield*/, chatModel_1.default.find({ users: { $elemMatch: { $eq: myid } } })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")
                        .populate("latestMessage")
                        .sort({ updatedAt: -1 })];
            case 1:
                chat = _a.sent();
                return [4 /*yield*/, userModel_1.default.populate(chat, {
                        path: "latestMessage.sender",
                        select: "name pic email",
                    })
                    // console.log(result);
                ];
            case 2:
                result = _a.sent();
                // console.log(result);
                res.status(200).send(result);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, res.send(error_2.message)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchChats = fetchChats;
//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
var createGroupChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var myid, users, _a, _b, groupChat, fullGroupChat, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                myid = new mongoose_1.default.Types.ObjectId(req._id);
                if (!req.body.users || !req.body.name) {
                    return [2 /*return*/, res.status(400).send({ message: "Please Fill all the feilds" })];
                }
                users = JSON.parse(req.body.users);
                // console.log(users);
                if (users.length < 2) {
                    return [2 /*return*/, res.status(400).send("More than 2 users are required to form a group chat")];
                }
                _b = (_a = users).push;
                return [4 /*yield*/, userModel_1.default.findOne({ _id: myid })];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [4 /*yield*/, chatModel_1.default.create({
                        chatName: req.body.name,
                        users: users,
                        isGroup: true,
                        groupAdmin: myid,
                    })];
            case 2:
                groupChat = _c.sent();
                return [4 /*yield*/, chatModel_1.default.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")];
            case 3:
                fullGroupChat = _c.sent();
                // console.log(fullGroupChat);
                res.status(200).json(fullGroupChat);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _c.sent();
                console.log(error_3);
                return [2 /*return*/, res.send(error_3.message)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createGroupChat = createGroupChat;
// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
var renameGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, chatName, updatedChat;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, chatName = _a.chatName;
                return [4 /*yield*/, chatModel_1.default.findByIdAndUpdate(chatId, {
                        chatName: chatName,
                    }, {
                        new: true,
                    }).populate("users", "-password").populate("groupAdmin", "-password")];
            case 1:
                updatedChat = _b.sent();
                if (!updatedChat) {
                    res.status(404);
                    throw new Error("Chat Not Found");
                }
                else {
                    res.json(updatedChat);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.renameGroup = renameGroup;
// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
var removeFromGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, removed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, userId = _a.userId;
                return [4 /*yield*/, chatModel_1.default.findByIdAndUpdate(chatId, {
                        $pull: { users: userId },
                    }, {
                        new: true,
                    }).populate("users", "-password").populate("groupAdmin", "-password")];
            case 1:
                removed = _b.sent();
                if (!removed) {
                    res.status(404);
                    throw new Error("User Not Found");
                }
                else {
                    res.json(removed);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.removeFromGroup = removeFromGroup;
// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
var addToGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, added;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, userId = _a.userId;
                return [4 /*yield*/, chatModel_1.default.findByIdAndUpdate(chatId, {
                        $push: { users: userId },
                    }, {
                        new: true,
                    })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")];
            case 1:
                added = _b.sent();
                if (!added) {
                    res.status(404);
                    throw new Error("Chat Not Found");
                }
                else {
                    res.json(added);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.addToGroup = addToGroup;
