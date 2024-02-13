import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../chatLogics/chatLogic";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { Button } from "@chakra-ui/react";
import { selectedChatState, chatsState, userState } from "../../recoil/GlobalStates"
// import { UserInfo, useChatState } from "../../context/chatProvider";
import { UserInfo } from "../../recoil/GlobalStates";
import { useRecoilState } from "recoil";
import { axiosClient } from "../../utils/axiosClient";
interface MyChatsProps {
    fetchAgain: boolean;
}

const MyChats: React.FC<MyChatsProps> = ({ fetchAgain }) => {

    const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
    const [user, setUser] = useRecoilState(userState);

    const [chats, setChats] = useRecoilState(chatsState);
    const [loggedUser, setLoggedUser] = useState<UserInfo>();

    // const { selectedChat, setSelectedChat, user, chats, setChats } = useChatState();

    const toast = useToast();

    const fetchChats = async () => {
        // console.log(user._id);
        console.log(user.token);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosClient.get("/api/chat", config);
            setChats(prevData => [...prevData, JSON.stringify(data)]);
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
                {chats ? (
                    <Stack overflowY="scroll" >
                        {Array.isArray(chats) && chats.map((chat) => {
                            return (
                                <Box
                                    onClick={() => setSelectedChat!(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={Math.random()}  // {change it when get chat}
                                >
                                    <Text>
                                        {!JSON.parse(chat).isGroupChat
                                            ? getSender(loggedUser!, JSON.parse(chat).users)
                                            : JSON.parse(chat).chatName}
                                    </Text>
                                    {JSON.parse(chat).latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{JSON.parse(chat).latestMessage.sender.name} : </b>
                                            {JSON.parse(chat).latestMessage.content.length > 50
                                                ? JSON.parse(chat).latestMessage.content.substring(0, 51) + "..."
                                                : JSON.parse(chat).latestMessage.content}
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
