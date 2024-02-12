import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/chatComponents/sideDrawer";
import MyChats from "../components/chatComponents/MyChats";
import ChatBox from "../components/chatComponents/chatBox";
import { useChatState } from "../context/chatProvider";
import { useState } from "react";

function ChatPage() {
    const { user } = useChatState();
    const [fetchAgain, setFetchAgain] = useState<boolean>(false);
    return (
        <div>
            <SideDrawer />
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </div>
    )
}

export default ChatPage;