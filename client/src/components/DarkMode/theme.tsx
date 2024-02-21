import { extendTheme, type ThemeConfig } from '@chakra-ui/react'


const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    colors: {
        light: {
            background: '#ffffff',
            text: '#E9ECEF',
            foreground: '#E8E8E8'
        },
        dark: {
            background: '#0e0d11',
            foreground: '#1d1b22',
            text: '#F8F9FA'
        }
    }
})


export default theme