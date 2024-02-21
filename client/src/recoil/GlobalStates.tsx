import { atom } from 'recoil';
import { ChatSchema } from '../components/chatComponents/MyChats';
import { UserSchema } from '../components/chatComponents/GroupChatModal';

export const selectedChatState = atom<ChatSchema>({
    key: 'selectedChatState',
    default: undefined,
});

export const userState = atom<UserSchema>({
    key: 'userState',
    default: undefined,
});

export const notificationState = atom<string[]>({
    key: 'notificationState',
    default: [],
});

export const chatsState = atom<ChatSchema[]>({
    key: 'chatsState',
    default: [],
});
