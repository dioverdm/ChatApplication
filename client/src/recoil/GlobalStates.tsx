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


// Define atoms
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

// Usage in components
// const YourComponent = () => {
//     const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
//     const [user, setUser] = useRecoilState(userState);
//     const [notification, setNotification] = useRecoilState(notificationState);
//     const [chats, setChats] = useRecoilState(chatsState);

//     // Alternatively, you can use useSetRecoilState for setters
//     // const setSelectedChat = useSetRecoilState(selectedChatState);
//     // const setUser = useSetRecoilState(userState);
//     // const setNotification = useSetRecoilState(notificationState);
//     // const setChats = useSetRecoilState(chatsState);

//     // Your component code here
// };
