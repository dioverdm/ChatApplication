import axios from "axios";
const baseURL = 'https://thoughtful-amye-deewan.koyeb.app'

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true
})