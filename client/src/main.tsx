import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import theme from './components/DarkMode/theme.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <RecoilRoot>
        <BrowserRouter>
            <ChakraProvider>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <App />
            </ChakraProvider>
        </BrowserRouter>
    </RecoilRoot>
    // </React.StrictMode>,
)
