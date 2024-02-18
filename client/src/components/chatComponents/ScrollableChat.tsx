import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../../chatLogics/chatLogic";
import { useRecoilValue } from "recoil";
import { UserInfo, userState } from "../../recoil/GlobalStates";
import { ChatSchema } from "./MyChats";
import mongoose from "mongoose";

export interface messageSchema {
    _id: mongoose.Schema.Types.ObjectId;
    sender: UserInfo;
    content: string;
    chat: ChatSchema;
}

interface ScrollableChatProps {
    messages: messageSchema[];
}

const ScrollableChat: React.FC<ScrollableChatProps> = ({ messages }) => {
    // const { user } = ChatState();
    // console.log("scrollable",messages);
    const user = useRecoilValue(userState);
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={JSON.stringify(m._id)}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
