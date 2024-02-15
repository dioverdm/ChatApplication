import { Box } from '@chakra-ui/react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { selectedChatState } from '../../recoil/GlobalStates';
import SingleChat from './SingleChat';

interface MyChatsProps {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBox: React.FC<MyChatsProps> = ({ fetchAgain, setFetchAgain }) => {
    const selectedChat=useRecoilValue(selectedChatState);

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
}

export default ChatBox