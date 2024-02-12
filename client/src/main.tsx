import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './context/chatProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <BrowserRouter>
        <ChatProvider>
            <ChakraProvider>
                <App />
            </ChakraProvider>
        </ChatProvider>
    </BrowserRouter>
    // </React.StrictMode>,
)
