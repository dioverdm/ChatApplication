import mongoose from "mongoose";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface UserInfo {
    // Define the properties of your user object
    // For example:
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    pic: string,
    isAdmin: boolean,
    token: string
    // Add other properties as needed
}

interface ChatContextType {
    selectedChat: string | undefined; // Update this type according to your selectedChat data structure
    setSelectedChat: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
    user: UserInfo | undefined;
    setUser: React.Dispatch<React.SetStateAction<UserInfo | undefined>> | undefined;
    notification: string[]; // Update this type according to your notification data structure
    setNotification: React.Dispatch<React.SetStateAction<string[]>> | undefined;
    chats: string[]; // Update this type according to your chats data structure
    setChats: React.Dispatch<React.SetStateAction<string[]>> | undefined;
}

type Props = {
    children: React.ReactNode
}

const ChatContext = createContext<ChatContextType>({
    selectedChat: undefined,
    setSelectedChat: undefined,
    user: undefined,
    setUser: undefined,
    notification: [],
    setNotification: undefined,
    chats: [],
    setChats: undefined
});

const ChatProvider = ({ children }: Props) => {
    const [selectedChat, setSelectedChat] = useState<string>();
    const userInfoString = localStorage.getItem("userInfo");
    // console.log("userinfo", userInfoString);

    const userInfo: UserInfo = JSON.parse(userInfoString!);

    const [user, setUser] = useState<UserInfo | undefined>(userInfo);
    const [notification, setNotification] = useState<string[]>([]);
    const [chats, setChats] = useState<string[]>([]);

    const navigate = useNavigate();

    console.log("1");
    useEffect(() => {
        console.log('2');
        const userInfoString = localStorage.getItem("userInfo");
        // console.log("userinfo", userInfoString);
        if (userInfoString) {
            const userInfo: UserInfo = JSON.parse(userInfoString);
            setUser(userInfo);
        } else {
            // navigate("/chat");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;
