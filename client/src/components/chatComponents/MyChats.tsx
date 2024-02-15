import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { getSender } from "../../chatLogics/chatLogic";
import ChatLoading from "./ChatLoading";
import GroupChatModal, { UserSchema } from "./GroupChatModal";
import { Button } from "@chakra-ui/react";
import { selectedChatState, chatsState, userState } from "../../recoil/GlobalStates"
import { UserInfo } from "../../recoil/GlobalStates";
import { useRecoilState, useRecoilValue } from "recoil";
import { axiosClient } from "../../utils/axiosClient";
import mongoose from "mongoose";


interface MyChatsProps {
    fetchAgain: boolean;
}

interface ChatSchema{
    _id:mongoose.Schema.Types.ObjectId;
    chatName:string;
    isGroup:boolean;
    users?:UserSchema[];
    latestMessage?:mongoose.Schema.Types.ObjectId;
    groupAdmin:UserSchema;
}
const MyChats: React.FC<MyChatsProps> = ({ fetchAgain }) => {

    const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
    const user= useRecoilValue(userState);
    const [chats, setChats] = useRecoilState(chatsState);
    const [loggedUser, setLoggedUser] = useState<UserInfo>();
    const toast = useToast();
    
    const arr:any=[];
    chats.map((chat)=>{
        arr.push(JSON.parse(chat));
    })
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosClient.get("/api/chat", config);
            console.log(data);
            data.map((ind:any)=>{
                setChats(prevData=>[...prevData,JSON.stringify(ind)]);
            })
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")!));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {/* <Text>I was here</Text> */}
                {chats ? (
                    <Stack overflowY="scroll" >
                        {(chats).map((temp) => {
                            const chat:ChatSchema=JSON.parse(temp);
                            return(
                                <Box
                                    onClick={() => setSelectedChat!(JSON.stringify(chat))}
                                    cursor="pointer"
                                    bg={selectedChat === JSON.stringify(chat) ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === JSON.stringify(chat) ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={Math.random()}  // {change it when get chat}
                                >
                                    {/* <Text>{1}</Text> */}
                                    <Text>
                                        {!chat.isGroup
                                            ?getSender(loggedUser!,chat.users!)
                                            :chat.chatName}
                                    </Text>
                                    {/* {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )} */}
                                </Box>
                            )
                    })}
                    </Stack>
                ) : (<ChatLoading />)}
            </Box>
        </Box>
    );
};

export default MyChats;
