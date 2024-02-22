import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./style.css";
import { IconButton, Spinner, useColorMode, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../chatLogics/chatLogic";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./profileModal";
import ScrollableChat from "./ScrollableChat";
import io, { Socket } from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useRecoilState, useRecoilValue } from "recoil";
import { notificationState, selectedChatState, userState } from "../../recoil/GlobalStates";
import { axiosClient } from "../../utils/axiosClient";
import { messageSchema } from "./ScrollableChat";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ChatSchema } from "./MyChats";
import theme from "../DarkMode/theme";
const ENDPOINT = import.meta.env.MODE === "development" ? 'http://localhost:4000' : import.meta.env.VITE_SERVER_BASE_URL;
var socket: Socket<DefaultEventsMap, DefaultEventsMap>, selectedChatCompare: ChatSchema;


interface MyChatsProps {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

const SingleChat: React.FC<MyChatsProps> = ({ fetchAgain, setFetchAgain }) => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<messageSchema[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false);
    const [istyping, setIsTyping] = useState<boolean>(false);
    const toast = useToast();
    const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
    const user = useRecoilValue(userState);
    const [notification, setNotification] = useRecoilState(notificationState);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        return () => {
            socket.close();
        }
    }, []);

    const fetchMessages = async () => {
        console.log(selectedChat);
        if (!selectedChat || Object.keys(selectedChat).length === 0) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axiosClient.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event: KeyboardEvent<HTMLImageElement>) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axiosClient.post(
                    "/api/message/send",
                    {
                        content: newMessage,
                        chatId: JSON.stringify(selectedChat._id),
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            console.log(newMessageRecieved);
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage((e.target as HTMLInputElement).value);

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const { colorMode } = useColorMode();
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            aria-label=""
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat({} as ChatSchema)}
                            _hover={{ bg: "teal.600" }}
                            _focus={{ boxShadow: "outline" }}
                        />
                        {messages && selectedChat && Object.keys(selectedChat).length !== 0 &&
                            (!selectedChat.isGroup ? (
                                <>
                                    {getSender(user, selectedChat.users!)}
                                    <ProfileModal
                                        user={getSenderFull(user, selectedChat.users!)}
                                    />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName?.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </>
                            ))}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping ? <div>typing...</div> : <></>}
                            <Input
                                variant="filled"
                                bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.foreground}
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={(e) => { typingHandler(e) }}
                                color={colorMode === 'dark' ? 'white' : 'black'}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                // to get socket.io on same page
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;