import React from 'react'

interface MyChatsProps {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBox: React.FC<MyChatsProps> = ({ fetchAgain, setFetchAgain }) => {
    setFetchAgain(false);
    fetchAgain;
    return (
        <div>chatBox</div>
    )
}

export default ChatBox