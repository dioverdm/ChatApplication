import { atom } from 'recoil';
import { ChatSchema } from '../components/chatComponents/MyChats';
import { UserSchema } from '../components/chatComponents/GroupChatModal';
import mongoose from 'mongoose';


export interface messageSchema {
    chat: ChatSchema;
    content: string;
    sender: UserSchema;
    createdAt?: Date;
    updatedAt?: Date;
    _id: mongoose.Schema.Types.ObjectId;
}

export const selectedChatState = atom<ChatSchema>({
    key: 'selectedChatState',
    default: undefined,
});

export const userState = atom<UserSchema>({
    key: 'userState',
    default: undefined,
});

export const notificationState = atom<messageSchema[]>({
    key: 'notificationState',
    default: [],
});

export const chatsState = atom<ChatSchema[]>({
    key: 'chatsState',
    default: [],
});
