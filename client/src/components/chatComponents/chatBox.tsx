import { Box, useColorMode } from '@chakra-ui/react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { selectedChatState } from '../../recoil/GlobalStates';
import SingleChat from './SingleChat';
import theme from '../DarkMode/theme';

interface MyChatsProps {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBox: React.FC<MyChatsProps> = ({ fetchAgain, setFetchAgain }) => {
    const selectedChat = useRecoilValue(selectedChatState);
    const { colorMode } = useColorMode();
    return (
        <Box
            display={{ base: selectedChat && Object.keys(selectedChat).length !== 0 ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.foreground}
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
}

export default ChatBox