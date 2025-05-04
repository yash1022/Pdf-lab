import axios from "axios";

const  api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include credentials (cookies) in requests


})
export default api;