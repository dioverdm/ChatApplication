import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuGroup,
    MenuItem, MenuDivider, Avatar, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
    DrawerHeader, DrawerBody, Input, DrawerFooter, useDisclosure, useToast, Spinner
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react'
import { UserInfo, useChatState } from '../../context/chatProvider';
import ProfileModal from './profileModal';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';

function SideDrawer() {

    const { user } = useChatState();
    console.log(user);


    // console.log("side-drawer", user!.name);
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }

    const { chats, setChats, setSelectedChat } = useChatState();
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

    const accessChat = async (user: UserInfo) => {
        console.log(user);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axiosClient.post(`/api/chat`, { "_id": user._id }, config);

            //chat with a single person
            if (!chats.find((c) => { JSON.parse(c)._id === data._id })) setChats!([data!, ...chats]);
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
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user!.name} src={user!.pic}
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
                                    key={usr._id}
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