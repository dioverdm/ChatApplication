import { newRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import mongoose from "mongoose";
import  Message from '../models/messageModel';
import {z} from 'zod';
import User from '../models/userModel';
import Chat from '../models/chatModel';

const BodySchema=z.object({
    content:z.string().max(150),
    chatId:z.string()
})

//  POST /api/message/
export const sendMessages=async (req:newRequest,res:Response)=>{
    try {
        const {content,chatId}=BodySchema.parse(req.body);
        const modifiedChatId=JSON.parse(chatId);
        const id=req._id;
        // console.log(typeof(id!));
        let mssg=await Message.create({
            sender:new mongoose.Types.ObjectId(req._id!),
            content:content,
            chat:modifiedChatId
        })
        const val=await mssg.populate('sender');
        // console.log(val);
        let data=await mssg.populate('chat');
        data=await  User.populate(data,{
            path:'chat.users',
            select:'name pic email',
        });
        await Chat.findByIdAndUpdate(modifiedChatId,{latestMessage:data});
        return res.json(data);
    } catch (error) {
        // console.log(error);
        // console.log((error as Error).message);
        return res.status(400).send((error as Error).message);
    }
}


//   GET /api/message/:chatId


export const allMessages=async (req:newRequest,res:Response)=>{
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        // console.log(error)
        return res.status(400).send((error as Error).message);
    }
}