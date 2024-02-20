"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var chatModel = new mongoose_1.default.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'message'
    },
    groupAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('chat', chatModel);
