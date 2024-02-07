import { useEffect } from 'react';
import { axiosClient } from '../utils/axiosClient';


function ChatPage() {

    async function Test() {
        const data = await axiosClient.get('/chat');
        // console.log(data);
        // console.log(data.config);
        // console.log(data.config.data);
        console.log(data.data);
    }
    useEffect(() => {
        Test();
    }, [])
    return (
        <div>ChatPage</div>
    )
}

export default ChatPage