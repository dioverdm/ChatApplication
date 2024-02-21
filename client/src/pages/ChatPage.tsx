import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/chatComponents/sideDrawer";
import MyChats from "../components/chatComponents/MyChats";
import ChatBox from "../components/chatComponents/chatBox";
import { useEffect, useState } from "react";
import { userState } from "../recoil/GlobalStates";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

function ChatPage() {
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
    useEffect(() => {
        const User = localStorage.getItem("userInfo");
        if (User) {
            setUser(JSON.parse(User!));
            navigate('/chat');
        }
    }, [])
    const [fetchAgain, setFetchAgain] = useState<boolean>(false);
    return (
        <div>
            {user && <SideDrawer />}
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