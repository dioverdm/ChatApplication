import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useState } from 'react';
// import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
// import axiosCli from "axios";
import { axiosClient } from "../../utils/axiosClient";
// import { useNavigate } from "react-router";

function Signup() {
    const [show1, setShow1] = useState(false);
    const [show2, setshow2] = useState(false);
    const handleClick1 = () => setShow1(!show1);
    const handleClick2 = () => setshow2(!show2);
    const toast = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [confirmpassword, setConfirmpassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pic, setPic] = useState<string>();
    const [picLoading, setPicLoading] = useState<boolean>(false);

    const submitHandler = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        if (password.length < 8 || password.length > 50) {
            toast({
                title: "Password should be between 8 and 50",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        console.log(name, email, password, pic);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axiosClient.post(
                "/api/auth/signup",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            console.log(data);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            navigate("/chat");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
        }
    };

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const file: File | null = e.target.files ? e.target.files[0] : null;
        const reader: FileReader = new FileReader();
        if (file) {
            reader.onloadend = () => {
                setPic(reader.result as string); // Assuming setPostImg accepts a string
            };
            reader.readAsDataURL(file);
        }
    }


    // const postDetails = (pics: Blob | File) => {
    //     setPicLoading(true);
    //     if (!pics) {
    //         toast({
    //             title: "Please upload an Image!!",
    //             status: 'warning',
    //             duration: 5000,
    //             isClosable: true,
    //             position: 'bottom'
    //         });
    //         return;
    //     }
    //     if (pics.type === "image/jpeg" || pics.type === "image/png") {
    //         const data = new FormData();
    //         data.append("file", pics);
    //         data.append("upload_preset", "chatApp");
    //         data.append("cloud_name", "dhircmng6");
    //         fetch("https://api.cloudinary.com/v1_1/dhircmng6/image/upload", {
    //             method: "post",
    //             body: data,
    //         })
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 setPic(data.url.toString());
    //                 console.log(data.url.toString());
    //                 setPicLoading(false);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 setPicLoading(false);
    //             });
    //     } else {
    //         toast({
    //             title: "Please Select an Image!",
    //             status: "warning",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom",
    //         });
    //         setPicLoading(false);
    //         return;
    //     }

    // }
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
                    type={show1 ? "text" : "password"}
                    placeholder="Enter Password"
                    minLength={8}
                    maxLength={100}
                    id="signupPassword"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick1}>
                        {show1 ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={show2 ? "text" : "password"}
                    placeholder="Confirm password"
                    minLength={8}
                    maxLength={100}
                    id="confirmPassword"
                    onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick2}>
                        {show2 ? "Hide" : "Show"}
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
                    // const files = e.target?.files;
                    // if (files) {
                    //     postDetails(files[0]);
                    // }
                    handleImageChange(e);
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