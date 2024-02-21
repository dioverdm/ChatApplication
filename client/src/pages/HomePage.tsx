import { Box, Container, Text, useColorMode } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Signup from '../components/Authentication/Signup'
import Login from '../components/Authentication/Login'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userState } from '../recoil/GlobalStates'
import { useSetRecoilState } from 'recoil'
import { ColorModeToggler } from '../components/DarkMode/ColorModeToggler'
import theme from '../components/DarkMode/theme'

function HomePage() {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const {colorMode}=useColorMode();
    useEffect(() => {
        const User = localStorage.getItem("userInfo");
        if (User) {
            setUser(JSON.parse(User!));
            navigate('/chat');
        }
    }, [])
    return <Container maxW="md"  centerContent>
        <ColorModeToggler/>
        <Box
            display="flex" 
            justifyContent="center"
            p={3}
            bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.foreground}
            w="100%"
            m="20px 0 15px 0"
            border='5px solid #7359f8'
            borderRadius="lg"
            borderWidth="1px"
        >
            <Text fontSize="4xl">Chat App</Text>
        </Box>
        <Box bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.foreground}
        w="100%" p={4} borderRadius="lg" borderWidth="1px" border='1px solid #7359f8'>
            <Tabs variant='soft-rounded'>
                <TabList mb='1em'>
                    <Tab width='50%' border='1px solid #7359f8'>Login</Tab>
                    <Tab width='50%' border='1px solid #7359f8'>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container >
}

export default HomePage