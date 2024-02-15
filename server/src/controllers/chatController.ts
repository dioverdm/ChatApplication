import { newRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import mongoose from "mongoose";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const accessChat = async (req: newRequest, res: Response) => {
    try {
        const userId = req.body.id;
        if (!userId) {
            return res.status(400).send("UserId param not sent with request");
        }
        const myid = new mongoose.Types.ObjectId(req._id);
        const UserId = new mongoose.Types.ObjectId(userId);
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: myid } } },
                { users: { $elemMatch: { $eq: UserId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        const chat = await User.populate(isChat, {
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

        const createdChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
        );
        res.status(200).json(FullChat);
    } catch (error) {
        return res.send((error as Error).message);
    }
};

// @description     Fetch all chats for a user
// @route           GET /api/chat/
// @access          Protected
export const fetchChats = async (req: newRequest, res: Response) => {
    try {
        const myid = new mongoose.Types.ObjectId(req._id);
        const chat = await Chat.find({ users: { $elemMatch: { $eq: myid } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        const result = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "name pic email",
        })

        res.status(200).send(result);
    }
    catch (error) {
        return res.send((error as Error).message);
    }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
export const createGroupChat = async (req: newRequest, res: Response) => {
    try {
        const myid = new mongoose.Types.ObjectId(req._id);
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the feilds" });
        }
        var users = JSON.parse(req.body.users);
        // console.log(users);

        if (users.length < 2) {
            return res.status(400).send("More than 2 users are required to form a group chat");
        }

        users.push(await User.findOne({ _id: myid }));


        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroup: true,
            groupAdmin: myid,
        });

        // console.log(groupChat);
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

        // console.log(fullGroupChat);
        res.status(200).json(fullGroupChat);
    } catch (error) {
        console.log(error);
        return res.send((error as Error).message);
    }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
export const renameGroup = async (req: newRequest, res: Response) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
export const removeFromGroup = async (req: newRequest, res: Response) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        res.json(removed);
    }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
export const addToGroup = async (req: newRequest, res: Response) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
};

