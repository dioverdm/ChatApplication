import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box, Button, Tooltip, Text, Menu, MenuButton, MenuList,
    MenuItem, MenuDivider, Avatar, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
    DrawerHeader, DrawerBody, Input, DrawerFooter, useDisclosure, useToast, Spinner, useColorMode, Badge
} from '@chakra-ui/react';
import { useRef, useState } from 'react'
import ProfileModal from './profileModal';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { selectedChatState, chatsState, userState, notificationState } from "../../recoil/GlobalStates"
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { UserSchema } from './GroupChatModal';
import { ColorModeToggler } from '../DarkMode/ColorModeToggler';
import { getSender } from '../../chatLogics/chatLogic';
import theme from '../DarkMode/theme';
import { messageSchema } from '../../recoil/GlobalStates';

function SideDrawer() {
    const setSelectedChat = useSetRecoilState(selectedChatState);
    const user = useRecoilValue(userState);
    const [chats, setChats] = useRecoilState(chatsState);
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<UserSchema[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>();
    const [notification, setNotification] = useRecoilState(notificationState);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }
    const toast = useToast();
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter Something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user!.token}`,
                },
            };

            const { data } = await axiosClient.get(`/api/auth/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const accessChat = async (usr: UserSchema) => {
        for (let chat of chats) {
            if (chat.chatName === 'sender') {
                if ((chat.users)![0]._id === usr._id || (chat.users)![1]._id === usr._id) {
                    toast({
                        title: 'User is already in chat list',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-left'
                    });
                    return;
                }
            }
        }
        try {
            setLoadingChat(true);
            // console.log(user);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axiosClient.post(`/api/chat`, { "id": usr._id }, config);

            //chat with a single person
            if (!chats.find((c) => { c._id === data._id })) setChats!([data!, ...chats]);
            setSelectedChat!(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleNotification = (notif: messageSchema) => {
        setNotification(notification.filter((n) => n.chat._id !== notif.chat._id));
    }

    // console.log('notification', notification);
    const { colorMode } = useColorMode();
    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                    <Button ref={btnRef}
                        variant='ghost'
                        onClick={onOpen}
                        bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.foreground}
                        _hover={{ bg: "teal.600" }}
                        _focus={{ boxShadow: "outline" }}
                    >
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: 'flex' }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work sans'>TalkWave</Text>
                <div
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                    <Menu>
                        <MenuButton
                            _hover={{ bg: "teal.600" }}
                            _focus={{ boxShadow: "outline" }}
                            borderRadius={999}
                            mr={2}
                        >
                            <BellIcon
                                fontSize='2xl'
                            />
                            {notification.length > 0 && (
                                <Badge
                                    borderRadius="full"
                                    bg='red'
                                    fontSize="0.8em"
                                    color='white'
                                    ml={-1}
                                    mt={-1}
                                >
                                    {notification.length}
                                </Badge>
                            )}
                        </MenuButton>
                        <MenuList
                            bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                            display='flex'
                            flexDirection='column'
                            alignItems='start'
                            // justifyContent='space-between'
                            height={notification.length > 0 ? 300 : 10}
                            overflowY='scroll'
                        >
                            {!notification.length && <span style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>No New Messages</span>}
                            {notification.map((notif) => {
                                return (
                                    <MenuItem
                                        key={JSON.stringify(notif._id)}
                                        bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.foreground}
                                        _hover={{ bg: "teal.600" }}
                                        _focus={{ boxShadow: "outline" }}
                                        cursor={'pointer'}
                                        mt={2}
                                        onClick={() => {
                                            setSelectedChat(notif.chat);
                                            handleNotification(notif);
                                        }}
                                        borderRadius={10}
                                        padding={3}
                                    >
                                        {
                                            notif.chat.isGroup ?
                                                <span>
                                                    New Message in Group <span>{notif.chat.chatName}</span>
                                                </span>
                                                : <span>
                                                    New Message from <span style={{ color: '#66f859' }}>{getSender(user, (notif.chat.users)!)}</span>
                                                </span>
                                        }
                                    </MenuItem>
                                )
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <ColorModeToggler />
                    </Menu>
                    <Menu>
                        <MenuButton as={Button}
                            bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background} ml={2}
                            rightIcon={<ChevronDownIcon />}
                            _hover={{ bg: "teal.600" }}
                            _focus={{ boxShadow: "outline" }}
                        >
                            <Avatar size="sm" cursor="pointer" src={user!.pic} name={user!.name}
                            />
                        </MenuButton>
                        <MenuList
                            bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                        >
                            <ProfileModal user={user!}>
                                <MenuItem bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                                    _hover={{ bg: "teal.600" }}
                                    _focus={{ boxShadow: "outline" }}
                                >My Profile
                                </MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                                _hover={{ bg: "teal.600" }}
                                _focus={{ boxShadow: "outline" }}
                                onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                >
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box>
                            <Input placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                            />
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((usr) => (
                                <UserListItem
                                    key={JSON.stringify(usr._id)}
                                    user={usr}
                                    handleFunction={() => accessChat(usr)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}

                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            variant='outline'
                            bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                            _hover={{ bg: "teal.600" }}
                            _focus={{ boxShadow: "outline" }}
                            mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleSearch}>Search</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default SideDrawer