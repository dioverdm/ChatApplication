import { Button, useColorMode } from "@chakra-ui/react";
import theme from "./theme";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const ColorModeToggler = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <header>
            <Button onClick={toggleColorMode}
                bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                _hover={{ bg: "teal.600" }}
                _focus={{ boxShadow: "outline" }}
                border='1px solid #7359f8'
            >
                {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
        </header>
    );
};
