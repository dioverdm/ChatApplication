import { atom } from 'recoil';
import mongoose from 'mongoose';

export interface UserInfo {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    pic: string,
    isAdmin: boolean,
    token: string
}

export const selectedChatState = atom<string>({
    key: 'selectedChatState',
    default: undefined,
});

export const userState = atom<UserInfo>({
    key: 'userState',
    default: undefined,
});

export const notificationState = atom<string[]>({
    key: 'notificationState',
    default: [],
});

export const chatsState = atom<string[]>({
    key: 'chatsState',
    default: [],
});
