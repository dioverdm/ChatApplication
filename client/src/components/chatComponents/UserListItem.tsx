import { Avatar, Box, Text, useColorMode } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react'
import { UserSchema } from './GroupChatModal';
import theme from '../DarkMode/theme';

interface props {
    user: UserSchema,
    handleFunction: MouseEventHandler<HTMLDivElement>
}

const UserListItem: React.FC<props> = ({ user, handleFunction }) => {
    const { colorMode } = useColorMode();
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.foreground}
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            w="100%"
            display="flex"
            alignItems="center"
            color={colorMode === 'dark' ? 'white' : 'black'}
            mt={2}
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
}

export default UserListItem