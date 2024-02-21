import axios from "axios";
const baseURL = import.meta.env.MODE === "development" ? 'http://localhost:4000' : import.meta.env.VITE_SERVER_BASE_URL;

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true
})