import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, //MenuGroup,
    MenuItem, MenuDivider, Avatar, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
    DrawerHeader, DrawerBody, Input, DrawerFooter, useDisclosure, useToast, Spinner
} from '@chakra-ui/react';
import { useRef, useState } from 'react'
import ProfileModal from './profileModal';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { selectedChatState, chatsState, userState, notificationState } from "../../recoil/GlobalStates"
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { UserInfo } from '../../recoil/GlobalStates';
// import { getSender } from '../../chatLogics/chatLogic';

function SideDrawer() {
    const setSelectedChat = useSetRecoilState(selectedChatState);
    const user = useRecoilValue(userState);
    const [chats, setChats] = useRecoilState(chatsState);
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>();
    const notification = useRecoilValue(notificationState);
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
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
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

    const accessChat = async (usr: UserInfo) => {
        // console.log(user);

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
            if (!chats.find((c) => { JSON.parse(c)._id === data._id })) setChats!([JSON.stringify(data!), ...chats]);
            setSelectedChat!(JSON.stringify(data));
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
    // notification.map((notif) => {
    //     console.log(notif);
    // })
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                    <Button ref={btnRef} variant='ghost' onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: 'flex' }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl' fontFamily='Work sans'>Chat App</Text>
                <div>
                    <Menu>
                        <MenuButton>
                            <BellIcon fontSize='2xl' margin={1} />
                        </MenuButton>
                        <MenuList>
                            {!notification.length && "No New Messages"}
                            {/* {notification.map((notf) => {
                                const notif = JSON.parse(notf)
                                console.log(notif);
                                return (
                                    <MenuList key={notif._id}>
                                        {
                                            notif.chat.isGroup ?
                                                `New Message in ${notif.chat.chatName}`
                                                : `New Message from ${getSender(user, notif.chat.users)}`
                                        }
                                    </MenuList>
                                )
                            })} */}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" src={user!.pic} name={user!.name}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user!}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
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
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box>
                            <Input placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
                            // <span>results</span>
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}

                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleSearch}>Search</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer