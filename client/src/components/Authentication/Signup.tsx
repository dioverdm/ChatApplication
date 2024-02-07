import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import React, { useState } from 'react';
// import { useToast } from '@chakra-ui/react'
// import { useHistory } from "react-router";

function Signup() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    // const history = useHistory();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [confirmpassword, setConfirmpassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pic, setPic] = useState<Blob | File>();
    const [picLoading, setPicLoading] = useState<boolean>(false);

    const submitHandler = async () => {

    }

    const postDetails = (pics: Blob | File) => {
        setPicLoading(true);
        if(!pics){
            toast({
                title:"Please upload an Image!!",
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            return;
        }
        
    }
    return <VStack spacing='5px'>
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
                type="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={show ? "text" : "password"}
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => {
                    const files = e.target?.files;
                    if (files) {
                        postDetails(files[0]);
                    }
                }
                }
            />
        </FormControl>
        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={picLoading}
        >
            Sign Up
        </Button>
    </VStack>
}

export default Signup