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
exports.allMessages = exports.sendMessages = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const zod_1 = require("zod");
const userModel_1 = __importDefault(require("../models/userModel"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const BodySchema = zod_1.z.object({
    content: zod_1.z.string().max(150),
    chatId: zod_1.z.string()
});
//  POST /api/message/
const sendMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, chatId } = BodySchema.parse(req.body);
        const modifiedChatId = JSON.parse(chatId);
        const id = req._id;
        // console.log(typeof(id!));
        let mssg = yield messageModel_1.default.create({
            sender: new mongoose_1.default.Types.ObjectId(req._id),
            content: content,
            chat: modifiedChatId
        });
        const val = yield mssg.populate('sender');
        // console.log(val);
        let data = yield mssg.populate('chat');
        data = yield userModel_1.default.populate(data, {
            path: 'chat.users',
            select: 'name pic email',
        });
        yield chatModel_1.default.findByIdAndUpdate(modifiedChatId, { latestMessage: data });
        return res.json(data);
    }
    catch (error) {
        // console.log(error);
        // console.log((error as Error).message);
        return res.status(400).send(error.message);
    }
});
exports.sendMessages = sendMessages;
//   GET /api/message/:chatId
const allMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageModel_1.default.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    }
    catch (error) {
        // console.log(error)
        return res.status(400).send(error.message);
    }
});
exports.allMessages = allMessages;
