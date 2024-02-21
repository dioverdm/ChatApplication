import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { UserSchema } from "../chatComponents/GroupChatModal";
import React from "react";

interface Props {
    user: UserSchema;
    handleFunction: () => void;
    admin: UserSchema;
}

const UserBadgeItem: React.FC<Props> = ({ user, handleFunction, admin }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            {admin._id === user._id && <span> (Admin)</span>}
            <CloseIcon pl={1} />
        </Badge>
    );
};

export default UserBadgeItem;
