import mongoose from "mongoose";
import { UserSchema } from "../components/chatComponents/GroupChatModal";
import { messageSchema } from "../components/chatComponents/ScrollableChat";
import { UserInfo } from "../recoil/GlobalStates";

export const isSameSenderMargin = (messages:messageSchema[], m:messageSchema, i:number, userId:mongoose.Schema.Types.ObjectId) => {
    // console.log(i === messages.length - 1);
    // console.log(messages);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameSender = (messages:messageSchema[], m:messageSchema, i:number, userId:mongoose.Schema.Types.ObjectId) => {
    // console.log(messages);
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages:messageSchema[], i:number, userId:mongoose.Schema.Types.ObjectId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages:messageSchema[], m:messageSchema, i:number) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser: UserSchema, users: UserSchema[]) => {
    // console.log(users);
    // if (!users) return 'lol';
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser:UserInfo, users:any) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};
