import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { getSender } from "../../chatLogics/chatLogic";
import ChatLoading from "./ChatLoading";
import GroupChatModal, { UserSchema } from "./GroupChatModal";
import { Button, useColorMode } from "@chakra-ui/react";
import { selectedChatState, chatsState, userState } from "../../recoil/GlobalStates";
import { useRecoilState, useRecoilValue } from "recoil";
import { axiosClient } from "../../utils/axiosClient";
import mongoose from "mongoose";
import { messageSchema } from "./ScrollableChat";
import theme from "../DarkMode/theme";


interface MyChatsProps {
    fetchAgain: boolean;
}

export interface ChatSchema {
    _id: mongoose.Schema.Types.ObjectId;
    chatName: string;
    isGroup: boolean;
    users?: UserSchema[];
    latestMessage?: messageSchema;
    groupAdmin: UserSchema;
    token?: string;
}
const MyChats: React.FC<MyChatsProps> = ({ fetchAgain }) => {

    const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
    const user = useRecoilValue(userState);
    const [chats, setChats] = useRecoilState(chatsState);
    const [loggedUser, setLoggedUser] = useState<UserSchema>();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosClient.get("/api/chat", config);
            // console.log('mychat', data);
            setChats(data);
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
    }, [fetchAgain]);

    // console.log('selected chat from my chats', selectedChat);
    const { colorMode } = useColorMode();

    return (
        <Box
            display={{ base: selectedChat && Object.keys(selectedChat).length !== 0 ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
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
                        bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.foreground}
                        _hover={{ bg: "teal.600" }}
                        _focus={{ boxShadow: "outline" }}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll" >
                        {(chats).map((chat) => {
                            return (
                                <Box
                                    onClick={() => setSelectedChat!(chat)}
                                    cursor="pointer"
                                    backgroundColor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={colorMode === 'dark' ? "white" : 'black'}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    _hover={{ bg: "teal.600" }}
                                    _focus={{ boxShadow: "outline" }}
                                    bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.foreground}
                                    key={JSON.stringify(chat._id)}
                                >
                                    <Text>
                                        {!chat.isGroup
                                            ? getSender(loggedUser!, chat.users!)
                                            : chat.chatName}
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name === user.name ? 'You' : user.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}
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
